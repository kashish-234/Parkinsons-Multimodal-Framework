"""
Random Forest Model for REM Sleep Behavior Disorder Classification
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from typing import Tuple, Dict, Optional
import joblib

from models.model_output import ModelOutput


class RFModel:
    """Random Forest model for REM classification"""
    
    def __init__(self, model_name: str = "RandomForest", random_state: int = 42, **params):
        """
        Initialize Random Forest model
        
        Args:
            model_name: Name of the model
            random_state: Random seed for reproducibility
            **params: Additional Random Forest parameters
        """
        self.model_name = model_name
        self.random_state = random_state
        
        # Default parameters
        default_params = {
            'n_estimators': 100,
            'max_depth': 20,
            'min_samples_split': 5,
            'min_samples_leaf': 2,
            'max_features': 'sqrt',
            'bootstrap': True,
            'oob_score': True,
            'random_state': random_state,
            'n_jobs': -1
        }
        
        # Update with provided parameters
        default_params.update(params)
        self.params = default_params
        
        self.model = RandomForestClassifier(**default_params)
        self.scaler = StandardScaler()
        self.feature_names = None
        self.is_trained = False
        
    def train(self, X: pd.DataFrame, y: pd.Series, 
              validation_split: float = 0.2) -> Dict:
        """
        Train Random Forest model
        
        Args:
            X: Features dataframe
            y: Labels series
            validation_split: Fraction for validation set
            
        Returns:
            Training info dictionary
        """
        print(f"Training {self.model_name}...")
        
        # Store feature names
        self.feature_names = X.columns.tolist()
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=validation_split, random_state=self.random_state, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        self.is_trained = True
        
        # Get OOB score and validation score
        oob_score = self.model.oob_score_ if self.model.oob_score else None
        val_score = self.model.score(X_val_scaled, y_val)
        
        print(f"✓ {self.model_name} training completed")
        print(f"  OOB Score: {oob_score:.4f}" if oob_score else "  (OOB score not available)")
        print(f"  Validation Accuracy: {val_score:.4f}")
        
        return {
            'oob_score': oob_score,
            'validation_accuracy': val_score
        }
    
    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Make predictions
        
        Args:
            X: Features dataframe
            
        Returns:
            Predictions array
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        Get prediction probabilities
        
        Args:
            X: Features dataframe
            
        Returns:
            Probability array
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        
        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)
    
    def evaluate(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, float]:
        """
        Evaluate model performance
        
        Args:
            X: Features dataframe
            y: Labels series
            
        Returns:
            Dictionary of metrics
        """
        predictions = self.predict(X)
        probabilities = self.predict_proba(X)
        
        metrics = {
            'accuracy': accuracy_score(y, predictions),
            'precision': precision_score(y, predictions, average='weighted', zero_division=0),
            'recall': recall_score(y, predictions, average='weighted', zero_division=0),
            'f1_score': f1_score(y, predictions, average='weighted', zero_division=0),
        }
        
        # Calculate AUC if binary classification
        if len(np.unique(y)) == 2:
            try:
                metrics['auc_roc'] = roc_auc_score(y, probabilities[:, 1])
            except:
                metrics['auc_roc'] = None
        else:
            try:
                metrics['auc_roc'] = roc_auc_score(y, probabilities, multi_class='ovr', average='weighted')
            except:
                metrics['auc_roc'] = None
        
        return metrics
    
    def get_feature_importance(self) -> Dict[str, float]:
        """
        Get feature importance scores
        
        Returns:
            Dictionary of feature importances
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        
        importances = self.model.feature_importances_
        importance_dict = dict(zip(self.feature_names, importances))
        
        # Sort by importance
        importance_dict = dict(sorted(importance_dict.items(), 
                                     key=lambda x: x[1], reverse=True))
        
        return importance_dict
    
    def get_model_output(self, X: pd.DataFrame, y: pd.Series) -> ModelOutput:
        """
        Generate ModelOutput object
        
        Args:
            X: Features dataframe
            y: Labels series
            
        Returns:
            ModelOutput object
        """
        predictions = self.predict(X)
        probabilities = self.predict_proba(X)
        metrics = self.evaluate(X, y)
        feature_importance = self.get_feature_importance()
        
        return ModelOutput(
            model_name=self.model_name,
            predictions=predictions,
            probabilities=probabilities,
            feature_importance=feature_importance,
            accuracy=metrics['accuracy'],
            precision=metrics['precision'],
            recall=metrics['recall'],
            f1_score=metrics['f1_score'],
            auc_roc=metrics.get('auc_roc'),
            config=self.params
        )
    
    def save(self, filepath: str) -> None:
        """Save model to disk"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'params': self.params
        }, filepath)
        print(f"✓ Saved {self.model_name} to {filepath}")
    
    def load(self, filepath: str) -> None:
        """Load model from disk"""
        data = joblib.load(filepath)
        self.model = data['model']
        self.scaler = data['scaler']
        self.feature_names = data['feature_names']
        self.params = data['params']
        self.is_trained = True
        print(f"✓ Loaded {self.model_name} from {filepath}")


