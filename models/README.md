# REM Sleep Behavior Disorder Model Training

This directory contains optimized implementations for model training and inference.

## Structure

```
models/
├── __init__.py
├── train.py              # Main training orchestrator
├── model_output.py       # ModelOutput & ModalityResult classes
├── xgb_model.py          # XGBoost model implementation
├── rf_model.py           # Random Forest model implementation
└── fusion.py             # Intra-modal fusion strategies
```

## Models Included

1. **XGBoost Model** - Gradient boosting for REM feature classification
2. **Random Forest** - Ensemble decision trees
3. **Fusion Engine** - Combines predictions through voting/averaging

## Usage

```python
from train import REMTrainingPipeline

pipeline = REMTrainingPipeline(data_dir='.', output_dir='./results')
modality_result = pipeline.run_complete_pipeline(fusion_method='voting')
```

## Output

- `xgb_model.pkl` - Trained XGBoost model
- `rf_model.pkl` - Trained Random Forest model
- `modality_result.json` - Final fused predictions and results
- `training_report.txt` - Detailed performance metrics
