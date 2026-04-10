"""
Model Output and Result Containers
Stores predictions, probabilities, and metadata from individual models
"""

import numpy as np
import pandas as pd
from dataclasses import dataclass, asdict
from typing import Dict, List, Any, Optional
import json


@dataclass
class ModelOutput:
    """
    Container for individual model predictions and outputs
    """
    model_name: str
    predictions: np.ndarray
    probabilities: Optional[np.ndarray] = None
    feature_importance: Optional[Dict[str, float]] = None
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    auc_roc: Optional[float] = None
    config: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        data = asdict(self)
        # Convert numpy arrays to lists for JSON serialization
        if isinstance(data['predictions'], np.ndarray):
            data['predictions'] = data['predictions'].tolist()
        if isinstance(data['probabilities'], np.ndarray):
            data['probabilities'] = data['probabilities'].tolist()
        return data
    
    def get_summary(self) -> Dict[str, float]:
        """Get performance summary"""
        return {
            'model': self.model_name,
            'accuracy': self.accuracy,
            'precision': self.precision,
            'recall': self.recall,
            'f1_score': self.f1_score,
            'auc_roc': self.auc_roc
        }
    
    def __repr__(self) -> str:
        summary = self.get_summary()
        return f"ModelOutput({json.dumps(summary, indent=2)})"


@dataclass
class ModalityResult:
    """
    Final fused result from REM modality
    Combines outputs from multiple models through intra-modal fusion
    """
    modality_name: str = "REM"
    
    # Individual model outputs
    model_outputs: List[ModelOutput] = None
    
    # Fused predictions
    fused_predictions: Optional[np.ndarray] = None
    fused_probabilities: Optional[np.ndarray] = None
    
    # Ensemble metrics
    ensemble_accuracy: Optional[float] = None
    ensemble_precision: Optional[float] = None
    ensemble_recall: Optional[float] = None
    ensemble_f1: Optional[float] = None
    ensemble_auc_roc: Optional[float] = None
    
    # Feature importance aggregation
    aggregated_feature_importance: Optional[Dict[str, float]] = None
    
    # Fusion method details
    fusion_method: str = "voting"  # voting, averaging, stacking
    fusion_weights: Optional[Dict[str, float]] = None
    
    def __post_init__(self):
        if self.model_outputs is None:
            self.model_outputs = []
    
    def add_model_output(self, model_output: ModelOutput) -> None:
        """Add individual model output"""
        self.model_outputs.append(model_output)
    
    def get_individual_summaries(self) -> pd.DataFrame:
        """Get summary of all individual models"""
        summaries = [m.get_summary() for m in self.model_outputs]
        return pd.DataFrame(summaries)
    
    def get_ensemble_summary(self) -> Dict[str, Any]:
        """Get ensemble performance summary"""
        return {
            'modality': self.modality_name,
            'fusion_method': self.fusion_method,
            'num_models': len(self.model_outputs),
            'accuracy': self.ensemble_accuracy,
            'precision': self.ensemble_precision,
            'recall': self.ensemble_recall,
            'f1_score': self.ensemble_f1,
            'auc_roc': self.ensemble_auc_roc
        }
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        data = {
            'modality_name': self.modality_name,
            'model_outputs': [m.to_dict() for m in self.model_outputs],
            'ensemble_metrics': self.get_ensemble_summary(),
            'aggregated_feature_importance': self.aggregated_feature_importance,
            'fusion_method': self.fusion_method,
            'fusion_weights': self.fusion_weights
        }
        return data
    
    def save_to_json(self, filepath: str) -> None:
        """Save result to JSON file"""
        import json
        data = self.to_dict()
        # Convert numpy arrays
        def convert(obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, np.floating):
                return float(obj)
            raise TypeError
        
        with open(filepath, 'w') as f:
            json.dump(data, f, default=convert, indent=2)
        print(f"✓ Saved ModalityResult to {filepath}")
    
    def __repr__(self) -> str:
        summary = self.get_ensemble_summary()
        return f"ModalityResult({json.dumps(summary, indent=2)})"


