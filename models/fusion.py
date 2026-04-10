"""
Intra-Modal Fusion: Combines predictions from multiple REM models
Implements voting, averaging, and stacking-based ensemble methods
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Optional
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.linear_model import LogisticRegression

from models.model_output import ModelOutput, ModalityResult


class IntraModalFusion:
    """Fuses predictions from multiple models within REM modality"""
    
    def __init__(self, fusion_method: str = "voting", weights: Optional[Dict[str, float]] = None):
        """
        Initialize fusion strategy
        
        Args:
            fusion_method: 'voting', 'averaging', or 'stacking'
            weights: Model weights for weighted fusion (optional)
        """
        self.fusion_method = fusion_method
        self.weights = weights or {}
        self.stacking_model = None
        
    def voting_fusion(self, model_outputs: List[ModelOutput]) -> np.ndarray:
        """
        Majority voting fusion
        
        Args:
            model_outputs: List of ModelOutput objects
            
        Returns:
            Fused predictions
        """
        predictions = np.column_stack([m.predictions for m in model_outputs])
        
        # Majority voting
        fused = np.apply_along_axis(
            lambda x: np.bincount(x.astype(int)).argmax(),
            axis=1,
            arr=predictions
        )
        
        return fused
    
    def weighted_voting_fusion(self, model_outputs: List[ModelOutput],
                              weights: Dict[str, float]) -> np.ndarray:
        """
        Weighted majority voting
        
        Args:
            model_outputs: List of ModelOutput objects
            weights: Model weights
            
        Returns:
            Fused predictions
        """
        weighted_votes = np.zeros((len(model_outputs[0].predictions), 
                                   max(model_outputs[0].predictions) + 1))
        
        for model_output in model_outputs:
            weight = weights.get(model_output.model_name, 1.0)
            for i, pred in enumerate(model_output.predictions):
                weighted_votes[i, int(pred)] += weight
        
        return np.argmax(weighted_votes, axis=1)
    
    def averaging_fusion(self, model_outputs: List[ModelOutput]) -> np.ndarray:
        """
        Average probability fusion
        
        Args:
            model_outputs: List of ModelOutput objects
            
        Returns:
            Fused predictions from averaged probabilities
        """
        probs = np.column_stack([m.probabilities[:, 1] if m.probabilities.shape[1] == 2 
                                 else np.max(m.probabilities, axis=1) 
                                 for m in model_outputs])
        
        avg_probs = np.mean(probs, axis=1)
        threshold = 0.5
        fused = (avg_probs >= threshold).astype(int)
        
        return fused
    
    def weighted_averaging_fusion(self, model_outputs: List[ModelOutput],
                                  weights: Dict[str, float]) -> np.ndarray:
        """
        Weighted average probability fusion
        
        Args:
            model_outputs: List of ModelOutput objects
            weights: Model weights
            
        Returns:
            Fused predictions
        """
        weighted_sum = np.zeros_like(model_outputs[0].probabilities[:, 1] 
                                    if model_outputs[0].probabilities.shape[1] == 2 
                                    else np.max(model_outputs[0].probabilities, axis=1),
                                    dtype=float)
        weight_total = 0
        
        for model_output in model_outputs:
            weight = weights.get(model_output.model_name, 1.0)
            probs = (model_output.probabilities[:, 1] 
                    if model_output.probabilities.shape[1] == 2 
                    else np.max(model_output.probabilities, axis=1))
            weighted_sum += weight * probs
            weight_total += weight
        
        avg_probs = weighted_sum / weight_total
        threshold = 0.5
        fused = (avg_probs >= threshold).astype(int)
        
        return fused
    
    def fuse(self, model_outputs: List[ModelOutput]) -> np.ndarray:
        """
        Perform fusion based on selected method
        
        Args:
            model_outputs: List of ModelOutput objects
            
        Returns:
            Fused predictions
        """
        if self.fusion_method == "voting":
            if self.weights:
                return self.weighted_voting_fusion(model_outputs, self.weights)
            else:
                return self.voting_fusion(model_outputs)
        
        elif self.fusion_method == "averaging":
            if self.weights:
                return self.weighted_averaging_fusion(model_outputs, self.weights)
            else:
                return self.averaging_fusion(model_outputs)
        
        else:
            raise ValueError(f"Unknown fusion method: {self.fusion_method}")
    
    def get_fused_probabilities(self, model_outputs: List[ModelOutput]) -> np.ndarray:
        """
        Get fused probability estimates
        
        Args:
            model_outputs: List of ModelOutput objects
            
        Returns:
            Averaged probability array
        """
        if self.fusion_method == "voting":
            # Convert voting to probabilities
            predictions = np.column_stack([m.predictions for m in model_outputs])
            num_models = len(model_outputs)
            
            # Determine number of classes
            n_classes = len(np.unique(predictions))
            
            fused = np.zeros((len(model_outputs[0].predictions), n_classes))
            fused_preds = self.fuse(model_outputs)
            
            for i, pred in enumerate(fused_preds):
                pred_int = int(pred)
                fused[i, pred_int] = np.sum(predictions[i] == pred_int) / num_models
                for j in range(n_classes):
                    if j != pred_int:
                        fused[i, j] = (1 - fused[i, pred_int]) / (n_classes - 1)
            
            return fused
        
        else:  # averaging
            # Get probabilities from all models
            all_probs = [m.probabilities for m in model_outputs]
            
            # Handle different probability dimensions
            n_classes = all_probs[0].shape[1]
            avg_probs = np.zeros((len(model_outputs[0].predictions), n_classes))
            
            for i in range(len(model_outputs[0].predictions)):
                for j in range(n_classes):
                    avg_probs[i, j] = np.mean([probs[i, j] if j < probs.shape[1] else 0 
                                              for probs in all_probs])
            
            # Normalize to sum to 1
            avg_probs = avg_probs / avg_probs.sum(axis=1, keepdims=True)
            
            return avg_probs


class REMModalityEnsemble:
    """
    REM Modality Ensemble: Orchestrates model training and fusion
    """
    
    def __init__(self, fusion_method: str = "voting"):
        """
        Initialize REM ensemble
        
        Args:
            fusion_method: Method for fusing model predictions
        """
        self.fusion_method = fusion_method
        self.model_outputs: List[ModelOutput] = []
        self.modality_result: Optional[ModalityResult] = None
        self.fusion = None
    
    def add_model_output(self, model_output: ModelOutput) -> None:
        """Add trained model output"""
        self.model_outputs.append(model_output)
    
    def create_modality_result(self, y_true: pd.Series = None,
                               fusion_weights: Optional[Dict[str, float]] = None) -> ModalityResult:
        """
        Create final ModalityResult by fusing all models
        
        Args:
            y_true: True labels for evaluation (optional)
            fusion_weights: Weights for models (optional)
            
        Returns:
            ModalityResult object
        """
        if not self.model_outputs:
            raise ValueError("No model outputs to fuse")
        
        # Initialize fusion
        self.fusion = IntraModalFusion(self.fusion_method, fusion_weights)
        
        # Fuse predictions
        fused_predictions = self.fusion.fuse(self.model_outputs)
        fused_probabilities = self.fusion.get_fused_probabilities(self.model_outputs)
        
        # Create result object
        self.modality_result = ModalityResult(
            modality_name="REM",
            model_outputs=self.model_outputs,
            fused_predictions=fused_predictions,
            fused_probabilities=fused_probabilities,
            fusion_method=self.fusion_method,
            fusion_weights=fusion_weights or {}
        )
        
        # Evaluate if labels provided
        if y_true is not None:
            metrics = self._evaluate_ensemble(fused_predictions, y_true)
            self.modality_result.ensemble_accuracy = metrics['accuracy']
            self.modality_result.ensemble_precision = metrics['precision']
            self.modality_result.ensemble_recall = metrics['recall']
            self.modality_result.ensemble_f1 = metrics['f1_score']
            self.modality_result.ensemble_auc_roc = metrics.get('auc_roc')
        
        # Aggregate feature importance
        self.modality_result.aggregated_feature_importance = self._aggregate_feature_importance()
        
        return self.modality_result
    
    def _evaluate_ensemble(self, predictions: np.ndarray, y_true: pd.Series) -> Dict[str, float]:
        """Evaluate ensemble performance"""
        metrics = {
            'accuracy': accuracy_score(y_true, predictions),
            'precision': precision_score(y_true, predictions, average='weighted', zero_division=0),
            'recall': recall_score(y_true, predictions, average='weighted', zero_division=0),
            'f1_score': f1_score(y_true, predictions, average='weighted', zero_division=0),
        }
        
        try:
            n_classes = len(np.unique(y_true))
            if n_classes == 2:
                metrics['auc_roc'] = roc_auc_score(y_true, self.modality_result.fused_probabilities[:, 1])
            elif n_classes > 2:
                metrics['auc_roc'] = roc_auc_score(y_true, self.modality_result.fused_probabilities, 
                                                  multi_class='ovr', average='weighted')
        except:
            metrics['auc_roc'] = None
        
        return metrics
    
    def _aggregate_feature_importance(self) -> Dict[str, float]:
        """Average feature importance across models"""
        if not self.model_outputs or not self.model_outputs[0].feature_importance:
            return {}
        
        # Collect all feature names
        all_features = set()
        for m in self.model_outputs:
            if m.feature_importance:
                all_features.update(m.feature_importance.keys())
        
        # Average importance
        aggregated = {}
        for feature in all_features:
            values = [m.feature_importance.get(feature, 0) 
                     for m in self.model_outputs if m.feature_importance]
            aggregated[feature] = np.mean(values)
        
        # Sort by importance
        aggregated = dict(sorted(aggregated.items(), 
                               key=lambda x: x[1], reverse=True))
        
        return aggregated
    
    def print_summary(self) -> None:
        """Print ensemble summary"""
        print("\n" + "="*60)
        print("REM MODALITY ENSEMBLE SUMMARY")
        print("="*60)
        
        if self.modality_result:
            print(f"\nFusion Method: {self.fusion_method}")
            print(f"Number of Models: {len(self.model_outputs)}")
            print(f"\nEnsemble Metrics:")
            print(f"  Accuracy:  {self.modality_result.ensemble_accuracy:.4f}")
            print(f"  Precision: {self.modality_result.ensemble_precision:.4f}")
            print(f"  Recall:    {self.modality_result.ensemble_recall:.4f}")
            print(f"  F1-Score:  {self.modality_result.ensemble_f1:.4f}")
            if self.modality_result.ensemble_auc_roc:
                print(f"  AUC-ROC:   {self.modality_result.ensemble_auc_roc:.4f}")
            
            print(f"\nIndividual Model Performance:")
            for output in self.model_outputs:
                print(f"  {output.model_name}:")
                print(f"    Accuracy: {output.accuracy:.4f}")
                print(f"    F1-Score: {output.f1_score:.4f}")
            
            print(f"\nTop 5 Aggregated Features:")
            top_features = list(self.modality_result.aggregated_feature_importance.items())[:5]
            for feat, importance in top_features:
                print(f"  {feat}: {importance:.4f}")
        
        print("="*60)


