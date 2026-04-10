"""
REM Model Training Pipeline Orchestrator
Coordinates data loading, model training, fusion, and evaluation
"""

import sys
import os
import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional
import json

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from dataset.preprocess import prepare_dataset
from models.xgb_model import XGBModel
from models.rf_model import RFModel
from models.fusion import REMModalityEnsemble, ModalityResult
from models.model_output import ModelOutput


class REMTrainingPipeline:
    """
    Complete REM model training pipeline
    Handles: data loading → feature selection → model training → fusion → results
    """
    
    def __init__(self, data_dir: str = '.', output_dir: str = './results'):
        """
        Initialize training pipeline
        
        Args:
            data_dir: Directory containing raw datasets
            output_dir: Directory to save results
        """
        self.data_dir = data_dir
        self.output_dir = output_dir
        self.features = None
        self.labels = None
        self.models = {}
        self.modality_result: Optional[ModalityResult] = None
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
    
    def load_and_prepare_data(self) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Load and preprocess data
        
        Returns:
            Tuple of (features, labels)
        """
        print("\n" + "="*60)
        print("STEP 1: DATA LOADING AND PREPROCESSING")
        print("="*60)
        
        self.features, self.labels = prepare_dataset(
            data_dir=self.data_dir,
            output_dir=os.path.join(self.output_dir, 'processed_data')
        )
        
        print(f"\n✓ Data prepared: {self.features.shape}")
        print(f"  Features: {self.features.shape[1]} columns")
        print(f"  Samples: {self.features.shape[0]} rows")
        print(f"  Labels distribution:\n{self.labels.value_counts()}")
        
        return self.features, self.labels
    
    def select_rem_features(self) -> pd.DataFrame:
        """
        Select REM-specific features for model training
        
        Returns:
            Selected features dataframe
        """
        print("\n" + "="*60)
        print("STEP 2: REM FEATURE SELECTION")
        print("="*60)
        
        # REM symptom features
        rem_symptoms = [col for col in self.features.columns 
                       if any(term in col for term in ['drm', 'slp', 'ptcg', 'awaken', 'remem', 'dstrb'])]
        
        # Comorbidity features
        comorbidity = [col for col in self.features.columns 
                      if any(term in col for term in ['stroke', 'hetra', 'parkism', 'rls', 'narclpsy', 'deprs', 'epilepsy'])]
        
        # Select top features based on variance
        selected_features = []
        
        # Add high-variance features
        for col in self.features.columns:
            if col in rem_symptoms or col in comorbidity:
                if self.features[col].std() > 0:
                    selected_features.append(col)
        
        # If too few features, include all available
        if len(selected_features) < 5:
            selected_features = [col for col in self.features.columns 
                               if self.features[col].std() > 0]
        
        selected_data = self.features[selected_features].copy()
        
        print(f"\n✓ Selected {len(selected_features)} REM features:")
        for i, feat in enumerate(selected_features, 1):
            print(f"  {i}. {feat}")
        
        self.features = selected_data
        return selected_data
    
    def train_xgb_model(self) -> ModelOutput:
        """
        Train XGBoost model
        
        Returns:
            ModelOutput object
        """
        print("\n" + "="*60)
        print("STEP 3A: TRAINING XGBoost MODEL")
        print("="*60)
        
        xgb_params = {
            'n_estimators': 150,
            'max_depth': 7,
            'learning_rate': 0.1,
            'subsample': 0.85,
            'colsample_bytree': 0.8,
            'reg_lambda': 1.5,
            'reg_alpha': 0.8,
        }
        
        xgb_model = XGBModel(model_name="XGBoost", **xgb_params)
        xgb_model.train(self.features, self.labels, validation_split=0.2)
        
        # Get model output
        model_output = xgb_model.get_model_output(self.features, self.labels)
        
        print(f"\nXGBoost Performance:")
        print(f"  Accuracy:  {model_output.accuracy:.4f}")
        print(f"  Precision: {model_output.precision:.4f}")
        print(f"  Recall:    {model_output.recall:.4f}")
        print(f"  F1-Score:  {model_output.f1_score:.4f}")
        
        # Save model
        xgb_model.save(os.path.join(self.output_dir, 'xgb_model.pkl'))
        
        self.models['xgb'] = xgb_model
        return model_output
    
    def train_rf_model(self) -> ModelOutput:
        """
        Train Random Forest model
        
        Returns:
            ModelOutput object
        """
        print("\n" + "="*60)
        print("STEP 3B: TRAINING RANDOM FOREST MODEL")
        print("="*60)
        
        rf_params = {
            'n_estimators': 150,
            'max_depth': 25,
            'min_samples_split': 5,
            'min_samples_leaf': 2,
            'max_features': 'sqrt',
        }
        
        rf_model = RFModel(model_name="RandomForest", **rf_params)
        rf_model.train(self.features, self.labels, validation_split=0.2)
        
        # Get model output
        model_output = rf_model.get_model_output(self.features, self.labels)
        
        print(f"\nRandom Forest Performance:")
        print(f"  Accuracy:  {model_output.accuracy:.4f}")
        print(f"  Precision: {model_output.precision:.4f}")
        print(f"  Recall:    {model_output.recall:.4f}")
        print(f"  F1-Score:  {model_output.f1_score:.4f}")
        
        # Save model
        rf_model.save(os.path.join(self.output_dir, 'rf_model.pkl'))
        
        self.models['rf'] = rf_model
        return model_output
    
    def fuse_models(self, model_outputs: list, fusion_method: str = "voting",
                   fusion_weights: Optional[Dict[str, float]] = None) -> ModalityResult:
        """
        Fuse multiple models through intra-modal fusion
        
        Args:
            model_outputs: List of ModelOutput objects
            fusion_method: 'voting' or 'averaging'
            fusion_weights: Optional weights for models
            
        Returns:
            ModalityResult with fused predictions
        """
        print("\n" + "="*60)
        print("STEP 4: INTRA-MODAL FUSION")
        print("="*60)
        
        ensemble = REMModalityEnsemble(fusion_method=fusion_method)
        
        for model_output in model_outputs:
            ensemble.add_model_output(model_output)
        
        # Create modality result
        self.modality_result = ensemble.create_modality_result(
            y_true=self.labels,
            fusion_weights=fusion_weights
        )
        
        ensemble.print_summary()
        
        return self.modality_result
    
    def save_results(self) -> None:
        """Save final results to disk"""
        print("\n" + "="*60)
        print("STEP 5: SAVING RESULTS")
        print("="*60)
        
        if self.modality_result is None:
            print("No modality result to save")
            return
        
        # Save as JSON
        json_path = os.path.join(self.output_dir, 'modality_result.json')
        self.modality_result.save_to_json(json_path)
        
        # Save detailed report
        report_path = os.path.join(self.output_dir, 'training_report.txt')
        self._save_report(report_path)
        
        print(f"\n✓ Results saved to {self.output_dir}")
    
    def _save_report(self, filepath: str) -> None:
        """Save detailed training report"""
        with open(filepath, 'w') as f:
            f.write("="*70 + "\n")
            f.write("REM SLEEP BEHAVIOR DISORDER - MODEL TRAINING REPORT\n")
            f.write("="*70 + "\n\n")
            
            # Dataset info
            f.write("DATASET INFORMATION\n")
            f.write("-"*70 + "\n")
            f.write(f"Total Samples: {len(self.labels)}\n")
            f.write(f"Features Used: {self.features.shape[1]}\n")
            f.write(f"Feature Names:\n")
            for feat in self.features.columns:
                f.write(f"  - {feat}\n")
            f.write(f"\nLabel Distribution:\n")
            for label, count in self.labels.value_counts().items():
                f.write(f"  Label {label}: {count} samples ({count/len(self.labels)*100:.2f}%)\n")
            
            # Individual models
            f.write("\n" + "="*70 + "\n")
            f.write("INDIVIDUAL MODEL PERFORMANCE\n")
            f.write("="*70 + "\n\n")
            
            for model_output in self.modality_result.model_outputs:
                f.write(f"{model_output.model_name}\n")
                f.write("-"*70 + "\n")
                summary = model_output.get_summary()
                f.write(f"  Accuracy:  {summary['accuracy']:.4f}\n")
                f.write(f"  Precision: {summary['precision']:.4f}\n")
                f.write(f"  Recall:    {summary['recall']:.4f}\n")
                f.write(f"  F1-Score:  {summary['f1_score']:.4f}\n")
                if summary['auc_roc']:
                    f.write(f"  AUC-ROC:   {summary['auc_roc']:.4f}\n")
                f.write("\n")
            
            # Ensemble results
            f.write("\n" + "="*70 + "\n")
            f.write("ENSEMBLE RESULTS (Fused)\n")
            f.write("="*70 + "\n\n")
            f.write(f"Fusion Method: {self.modality_result.fusion_method}\n")
            f.write(f"Accuracy:  {self.modality_result.ensemble_accuracy:.4f}\n")
            f.write(f"Precision: {self.modality_result.ensemble_precision:.4f}\n")
            f.write(f"Recall:    {self.modality_result.ensemble_recall:.4f}\n")
            f.write(f"F1-Score:  {self.modality_result.ensemble_f1:.4f}\n")
            if self.modality_result.ensemble_auc_roc:
                f.write(f"AUC-ROC:   {self.modality_result.ensemble_auc_roc:.4f}\n")
            
            # Top features
            f.write("\n" + "="*70 + "\n")
            f.write("TOP 10 AGGREGATED FEATURES\n")
            f.write("="*70 + "\n\n")
            
            top_features = list(self.modality_result.aggregated_feature_importance.items())[:10]
            for i, (feat, importance) in enumerate(top_features, 1):
                f.write(f"{i}. {feat}: {importance:.4f}\n")
        
        print(f"✓ Report saved to {filepath}")
    
    def run_complete_pipeline(self, fusion_method: str = "voting",
                             fusion_weights: Optional[Dict[str, float]] = None) -> ModalityResult:
        """
        Execute complete training pipeline
        
        Args:
            fusion_method: Method for fusing models
            fusion_weights: Optional weights for fusion
            
        Returns:
            Final ModalityResult
        """
        print("\n" + "#"*60)
        print("# REM MODEL TRAINING PIPELINE")
        print("#"*60)
        
        try:
            # Step 1: Load data
            self.load_and_prepare_data()
            
            # Step 2: Select features
            self.select_rem_features()
            
            # Step 3: Train models
            xgb_output = self.train_xgb_model()
            rf_output = self.train_rf_model()
            
            model_outputs = [xgb_output, rf_output]
            
            # Step 4: Fuse models
            self.modality_result = self.fuse_models(
                model_outputs,
                fusion_method=fusion_method,
                fusion_weights=fusion_weights
            )
            
            # Step 5: Save results
            self.save_results()
            
            print("\n" + "#"*60)
            print("# ✓ PIPELINE COMPLETED SUCCESSFULLY")
            print("#"*60 + "\n")
            
            return self.modality_result
        
        except Exception as e:
            print(f"\n✗ Pipeline failed: {str(e)}")
            raise


# Example usage
if __name__ == "__main__":
    # Initialize pipeline
    pipeline = REMTrainingPipeline(
        data_dir='../dataset',
        output_dir='./results'
    )
    
    # Run complete pipeline
    modality_result = pipeline.run_complete_pipeline(
        fusion_method="voting",  # or "averaging"
        fusion_weights=None  # or {'XGBoost': 0.6, 'RandomForest': 0.4}
    )
    
    # Access results
    print("\n" + "="*60)
    print("FINAL MODALITY RESULT")
    print("="*60)
    print(modality_result)



