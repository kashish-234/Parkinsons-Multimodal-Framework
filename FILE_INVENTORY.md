# Complete File Inventory & Component Guide

## Project Structure Overview

```
REmm/
├── dataset/                    # Data preprocessing module and raw CSV sources
├── models/                     # Model training & fusion module
│   └── output/                 # Output directory (created dynamically, can be deleted)
├── README.md                   # Main project documentation
├── REM_Architecture.drawio     # Visual architecture diagram
├── requirements.txt            # Python dependencies
├── run_pipeline.py            # Quick-start execution script
└── FILE_INVENTORY.md           # Component listing and documentation
```

## File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| **README.md** | Complete project documentation, usage examples, architecture overview |
| **REM_Architecture.drawio** | Visual architecture diagram for the REM training system |
| **requirements.txt** | Python package dependencies |
| **run_pipeline.py** | Quick-start script to execute the pipeline |
| **FILE_INVENTORY.md** | This file - complete component listing |

### Dataset Module (`dataset/`)

| File | Class/Function | Purpose |
|------|------------------|---------|
| **preprocess.py** | `REMDataProcessor` | Main preprocessing engine |
| | `prepare_dataset()` | Complete pipeline function |
| | | - Load all 4 CSV files |
| | | - Clean column names |
| | | - Handle missing values |
| | | - Remove duplicates |
| | | - Merge datasets |
| | | - Extract REM features |
| | | - Output: features.csv, labels.csv |
| **__init__.py** | (empty) | Python package marker |

### Models Module (`models/`)
| **File**            | **Class/Function**    | **Purpose**                                                                                                                                                                              |
| ------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **model_output.py** | `ModelOutput`         | Container for individual model predictions; stores predictions, probabilities, performance metrics (accuracy, precision, recall, F1, AUC), and feature importance                        |
|                     | `ModalityResult`      | Final fused result from REM modality; combines all ModelOutput objects, stores fused predictions & probabilities, ensemble metrics, and aggregated feature importance                    |
| **xgb_model.py**    | `XGBModel`            | Wrapper for XGBoost classifier; supports training with early stopping, prediction methods, feature importance extraction, model serialization (save/load), and performance evaluation    |
| **rf_model.py**     | `RFModel`             | Wrapper for Random Forest classifier; supports training with OOB scoring, prediction methods, feature importance extraction, model serialization (save/load), and performance evaluation |
| **fusion.py**       | `IntraModalFusion`    | Implements fusion strategies including majority voting, weighted voting, probability averaging, and weighted averaging                                                                   |
|                     | `REMModalityEnsemble` | Manages model fusion; adds model outputs, generates ModalityResult, evaluates ensemble performance, and aggregates feature importance scores                                             |
| **train.py**        | `REMTrainingPipeline` | Main pipeline controller; handles data loading, REM feature selection, training of XGBoost and Random Forest models, model fusion, saving results, and executing full pipeline           |
| **README.md**       | (documentation)       | Provides module-specific documentation and usage instructions                                                                                                                            |
| ****init**.py**     | (empty)               | Marks the directory as a Python package                                                                                                                                                  |

### Output Directory (`models/output/` - created dynamically)

| **File Name**                          | **Description**                            | **Key Contents**                                                                         | **Purpose / Usage**                                           |
| -------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **modality_result.json**               | Final output file containing model results | Predictions, probabilities, evaluation metrics, feature importance                       | Used to analyze model performance and results                 |
| **training_report.txt**                | Training summary report                    | Dataset details, individual model performance (XGBoost, Random Forest), ensemble metrics | Helps in comparing models and understanding training outcomes |
| **xgb_model.pkl**                      | Serialized XGBoost model                   | Trained model weights and structure                                                      | Used for direct prediction without retraining                 |
| **rf_model.pkl**                       | Serialized Random Forest model             | Trained model data                                                                       | Used for inference and predictions                            |
| **processed_data/features.csv**        | Preprocessed feature dataset               | Cleaned REM sleep features                                                               | Input data for training models                                |
| **processed_data/labels.csv**           | Output labels dataset                      | Patient diagnosis (target variable)                                                      | Used to train and evaluate models                             |
| **processed_data/merged_raw_data.csv** | Combined raw dataset                       | Merged data from all sources before preprocessing                                        | Used for data preparation and feature engineering             |

## Quick Reference: Class Methods

### REMDataProcessor
```python
processor = REMDataProcessor(data_dir='.')
processor.load_all_datasets()           # → Dict[str, DataFrame]
processor.clean_column_names()          # → None
processor.handle_missing_values()       # → None
processor.remove_duplicates()           # → None
merged = processor.merge_datasets()     # → DataFrame
features, labels = processor.extract_rem_features()  # → Tuple
processor.save_processed_data(output_dir)  # → None
```

### XGBModel & RFModel
```python
model = XGBModel(model_name="XGBoost", **params)  # or RFModel
model.train(X, y)                       # → Dict (results)
preds = model.predict(X)                # → ndarray
probs = model.predict_proba(X)          # → ndarray
metrics = model.evaluate(X, y)          # → Dict[str, float]
importance = model.get_feature_importance()  # → Dict[str, float]
output = model.get_model_output(X, y)   # → ModelOutput
model.save(filepath)                    # → None
model.load(filepath)                    # → None
```

### IntraModalFusion
```python
fusion = IntraModalFusion(fusion_method="voting", weights=None)
preds = fusion.fuse(model_outputs)      # → ndarray
probs = fusion.get_fused_probabilities(model_outputs)  # → ndarray
```

### REMModalityEnsemble
```python
ensemble = REMModalityEnsemble(fusion_method="voting")
ensemble.add_model_output(model_output)  # → None
result = ensemble.create_modality_result(y_true, weights)  # → ModalityResult
ensemble.print_summary()                # → None
```

### REMTrainingPipeline
```python
pipeline = REMTrainingPipeline(data_dir='.', output_dir='./results')
features, labels = pipeline.load_and_prepare_data()  # → Tuple
features = pipeline.select_rem_features()  # → DataFrame
xgb_out = pipeline.train_xgb_model()    # → ModelOutput
rf_out = pipeline.train_rf_model()      # → ModelOutput
result = pipeline.fuse_models([xgb_out, rf_out])  # → ModalityResult
pipeline.save_results()                 # → None
result = pipeline.run_complete_pipeline()  # → ModalityResult
```

### ModalityResult
```python
result.add_model_output(model_output)   # → None
df = result.get_individual_summaries()  # → DataFrame
summary = result.get_ensemble_summary()  # → Dict
result.save_to_json(filepath)           # → None
dict_data = result.to_dict()            # → Dict
```

## Data Flow Summary

```
Raw CSV Files (4 datasets)
        ↓
REMDataProcessor.load_all_datasets()
        ↓
Clean & Merge
        ↓
Extract REM Features
        ↓
Features DataFrame + Labels Series
        ↓
├─→ XGBModel.train() → ModelOutput
└─→ RFModel.train()  → ModelOutput
        ↓
IntraModalFusion.fuse()
        ↓
REMModalityEnsemble.create_modality_result()
        ↓
ModalityResult (fused predictions + ensemble metrics)
        ↓
ModalityResult.save_to_json()
        ↓
Results Directory (JSON, reports, models)
```

## Usage Patterns

### Pattern 1: Complete Pipeline (Recommended)
```python
from models.train import REMTrainingPipeline

pipeline = REMTrainingPipeline()
result = pipeline.run_complete_pipeline()
```

### Pattern 2: Step-by-Step Control
```python
from dataset.preprocess import prepare_dataset
from models.xgb_model import XGBModel
from models.rf_model import RFModel
from models.fusion import REMModalityEnsemble

features, labels = prepare_dataset()
xgb = XGBModel()
xgb.train(features, labels)
result = xgb.get_model_output(features, labels)
```

### Pattern 3: Custom Fusion
```python
ensemble = REMModalityEnsemble(fusion_method="averaging")
ensemble.add_model_output(xgb_output)
ensemble.add_model_output(rf_output)
result = ensemble.create_modality_result(y_true=labels, fusion_weights={...})
```

## Dependencies

See `requirements.txt`:
- pandas >= 1.0.0
- numpy >= 1.18.0
- scikit-learn >= 0.24.0
- xgboost >= 1.3.0
- joblib >= 1.0.0

## Key Features

✓ Complete data preprocessing pipeline
✓ Multiple classification models (XGBoost, Random Forest)
✓ Feature importance aggregation
✓ Multiple fusion strategies (voting, averaging, weighted)
✓ Comprehensive evaluation metrics
✓ Model serialization & persistence
✓ Detailed JSON reporting
✓ Modular & extensible architecture
✓ Type hints throughout codebase
✓ Comprehensive documentation

## Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Run pipeline: `python run_pipeline.py`
3. Check results in `results/` directory
4. Review `modality_result.json` for predictions
5. Review `training_report.txt` for detailed metrics
