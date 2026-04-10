# REM Sleep Behavior Disorder Model Training

This directory contains optimized implementations for model training and inference with built-in overfitting detection.

## Structure

```
models/
├── __init__.py
├── train.py              # Main training orchestrator with overfitting checks
├── model_output.py       # ModelOutput & ModalityResult classes
├── xgb_model.py          # XGBoost model implementation
├── rf_model.py           # Random Forest model implementation
├── fusion.py             # Intra-modal fusion strategies
└── README.md             # This file
```

## Key Features

- **Overfitting Detection**: Automatic comparison of train/validation/test performance
- **Proper Evaluation**: Models evaluated on held-out test sets
- **Data Leakage Prevention**: Target variable excluded from features
- **Flexible Output**: Output files created in `output/` directory (can be deleted)

## Models Included

1. **XGBoost Model** - Gradient boosting with early stopping
2. **Random Forest** - Ensemble decision trees with OOB scoring
3. **Fusion Engine** - Combines predictions through voting/averaging

## Usage

```python
from train import REMTrainingPipeline

# Initialize pipeline (output directory created automatically)
pipeline = REMTrainingPipeline(data_dir='../dataset', output_dir='./output')

# Run complete pipeline with overfitting checks
modality_result = pipeline.run_complete_pipeline(fusion_method='voting')
```

## Output Files (Created in `output/`)

- `xgb_model.pkl` - Trained XGBoost model (optional)
- `rf_model.pkl` - Trained Random Forest model (optional)
- `modality_result.json` - Final fused predictions and metrics
- `training_report.txt` - Detailed performance report
- `processed_data/` - Preprocessed features and labels
