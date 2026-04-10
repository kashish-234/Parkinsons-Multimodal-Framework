import numpy as np
from xgboost import XGBClassifier

from models.base.contracts import ModelOutput, SHAPFeature


class FingerTappingModel:
    MODEL_ID = "xgb_finger_tapping_v1"

    def __init__(self, scale_pos_weight=1.0):
        self.model = XGBClassifier(
            n_estimators=300,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=scale_pos_weight,
            eval_metric='logloss'
        )

    def fit(self, X, y):
        self.model.fit(X, y)

    def predict(self, X):
        """
        Returns ModelOutput (MANDATORY as per guidelines)
        """

        # probability of PD (class 1)
        prob = self.model.predict_proba(X)[0, 1]

        # raw logit (approx)
        raw_logit = float(np.log(prob / (1 - prob + 1e-6)))

        # dummy MC samples (for now)
        mc_samples = [float(prob)] * 50

        # basic SHAP placeholder (can improve later)
        shap_features = []

        return ModelOutput(
            model_id=self.MODEL_ID,
            modality="tapping",
            dataset="fingertapping",
            probability=float(prob),
            shap_features=shap_features,
            raw_logit=raw_logit,
            mc_samples=mc_samples,
            metadata={
                "num_features": X.shape[1]
            }
        )
