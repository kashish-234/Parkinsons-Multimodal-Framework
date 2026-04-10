# REM Sleep Behavior Disorder - Complete ML Pipeline

Complete end-to-end machine learning pipeline for REM Sleep Behavior Disorder prediction and classification.

## Project Structure

```
REmm/
├── dataset/
│   ├── __init__.py
│   ├── preprocess.py           # Data loading, cleaning, feature extraction
│   └── [processed data]        # Created dynamically during training
│
├── models/
│   ├── __init__.py
│   ├── train.py                # Main training orchestrator
│   ├── model_output.py         # ModelOutput & ModalityResult classes
│   ├── xgb_model.py            # XGBoost model implementation
│   ├── rf_model.py             # Random Forest model implementation
│   ├── fusion.py               # Intra-modal fusion logic
│   └── README.md               # Model-specific documentation
│
├── dataset.csv
├── dataset.xls
├── Features_of_REM_Behavior_Disorder-Archived_09Apr2026.csv
├── REM_Sleep_Behavior_Disorder_Screening_Questionnaire_09Apr2026.csv
├── REM_Sleep_Disorder_Questionnaire-Archived_09Apr2026.csv
├── Parkinson_guidelines.docx
├── FILE_INVENTORY.md
├── REM_Architecture.drawio
├── requirements.txt
└── run_pipeline.py             # Main execution script
```

## Dynamic Output Files

During training, the following files are created in `models/output/` (can be deleted after use):

```
models/output/
├── modality_result.json     # Final fused model results & metrics
├── training_report.txt      # Detailed training report
├── xgb_model.pkl           # Trained XGBoost model
├── rf_model.pkl            # Trained Random Forest model
└── processed_data/
    ├── features.csv        # Preprocessed features
    ├── labels.csv          # Target labels
    └── merged_raw_data.csv # Combined raw dataset
```

## Pipeline Overview

### Architecture Flow

```
Data Loading → Preprocessing → Feature Selection → Train/Val/Test Split
    ↓
├──→ Train XGBoost Model (with validation) → Evaluate on Test Set
└──→ Train Random Forest (with validation) → Evaluate on Test Set
    ↓
Check for Overfitting (Train vs Val vs Test performance)
    ↓
Intra-Modal Fusion (Voting/Averaging)
    ↓
Generate Final ModalityResult
    ↓
Save Results & Clean Up (optional)
```

### Key Features

- **Overfitting Detection**: Automatic checks comparing train/validation/test performance
- **Proper Evaluation**: Models evaluated on held-out test sets, not training data
- **Data Leakage Prevention**: Target variable removed from features
- **Flexible Output**: Output files created dynamically and can be deleted
- **Modular Design**: Separate components for easy modification and testing

## Quick Start

### Prerequisites
```bash
pip install -r requirements.txt
```

### Run Complete Pipeline
```bash
# From project root
python run_pipeline.py

# Or run training directly
cd models
python train.py
```

### Expected Output
- Training progress with overfitting checks
- Model performance metrics (accuracy, F1-score, etc.)
- Feature importance rankings
- Files saved to `models/output/` (can be deleted after use)

## Component Details

### 1. Dataset Module (`dataset/preprocess.py`)

**REMDataProcessor Class:**
- `load_all_datasets()` - Load all 4 CSV sources
- `clean_column_names()` - Standardize column naming
- `handle_missing_values()` - Imputation strategies
- `remove_duplicates()` - Data deduplication
- `merge_datasets()` - Combine sources
- `extract_rem_features()` - Select REM-specific features (excludes target variable)
- `save_processed_data()` - Export processed data

**Output:** Processed features DataFrame and labels Series

### 2. Training Pipeline (`models/train.py`)

**REMTrainingPipeline Class:**
- `load_and_prepare_data()` - Load and preprocess data
- `select_rem_features()` - Feature selection and test split creation
- `train_xgb_model()` - Train XGBoost with overfitting detection
- `train_rf_model()` - Train Random Forest with overfitting detection
- `fuse_models()` - Ensemble fusion using test set performance
- `save_results()` - Save results and generate reports

**Key Improvements:**
- Proper train/validation/test splits (60%/20%/20%)
- Overfitting detection comparing train vs validation vs test performance
- Data leakage prevention (target variable excluded from features)
- Automatic output directory creation

### 3. Model Components (`models/`)

#### 3a. ModelOutput (`model_output.py`)
```python
@dataclass
class ModelOutput:
    model_name: str
    predictions: np.ndarray
    probabilities: Optional[np.ndarray]
    feature_importance: Dict[str, float]
    accuracy, precision, recall, f1_score, auc_roc: float
    config: Dict[str, Any]
```

#### 3b. ModalityResult (`model_output.py`)
```python
@dataclass
class ModalityResult:
    modality_name: str = "REM"
    fusion_method: str
    num_models: int
    ensemble_accuracy, precision, recall, f1_score: float
    aggregated_feature_importance: Dict[str, float]
```
    fusion_method: str  # "voting" or "averaging"
```

#### 2c. XGBoost Model (`xgb_model.py`)
- Gradient boosting with optimal hyperparameters
- Early stopping for regularization
- Feature importance extraction
- `train()`, `predict()`, `evaluate()` methods

#### 2d. Random Forest Model (`rf_model.py`)
- Ensemble decision trees
- Out-of-bag score tracking
- Feature importance aggregation
- `train()`, `predict()`, `evaluate()` methods

#### 2e. Fusion Engine (`fusion.py`)
**IntraModalFusion Class:**
- Voting-based fusion (majority voting)
- Weighted voting fusion (custom weights)
- Averaging-based fusion (probability averaging)
- Weighted averaging fusion

**REMModalityEnsemble Class:**
- Orchestrates fusion of multiple models
- Aggregates feature importance
- Creates final ModalityResult

### 3. Training Orchestrator (`models/train.py`)

**REMTrainingPipeline Class:**

Pipeline steps:
1. `load_and_prepare_data()` - Load and preprocess
2. `select_rem_features()` - Feature selection
3. `train_xgb_model()` - Train XGBoost
4. `train_rf_model()` - Train Random Forest
5. `fuse_models()` - Combine predictions
6. `save_results()` - Export results

## Usage Examples

### Quick Start

```python
from models.train import REMTrainingPipeline

# Initialize pipeline
pipeline = REMTrainingPipeline(
    data_dir='.',
    output_dir='./results'
)

# Run complete pipeline
modality_result = pipeline.run_complete_pipeline(
    fusion_method='voting',
    fusion_weights=None  # or {'XGBoost': 0.6, 'RandomForest': 0.4}
)
```

### Step-by-Step

```python
from dataset.preprocess import prepare_dataset
from models.xgb_model import XGBModel
from models.rf_model import RFModel
from models.fusion import REMModalityEnsemble

# 1. Prepare data
features, labels = prepare_dataset(data_dir='.')

# 2. Train XGBoost
xgb = XGBModel()
xgb.train(features, labels)
xgb_output = xgb.get_model_output(features, labels)

# 3. Train Random Forest
rf = RFModel()
rf.train(features, labels)
rf_output = rf.get_model_output(features, labels)

# 4. Fuse predictions
ensemble = REMModalityEnsemble(fusion_method='voting')
ensemble.add_model_output(xgb_output)
ensemble.add_model_output(rf_output)
modality_result = ensemble.create_modality_result(y_true=labels)

# 5. Access results
print(modality_result)
modality_result.save_to_json('results.json')
```

### Custom Model Training

```python
from models.xgb_model import XGBModel

# Custom hyperparameters
params = {
    'n_estimators': 200,
    'max_depth': 8,
    'learning_rate': 0.05,
    'reg_lambda': 2.0
}

xgb = XGBModel(model_name="CustomXGB", **params)
xgb.train(features, labels)
xgb.save('my_xgb_model.pkl')
```

## Output Files

After running the pipeline, the `results/` directory contains:

1. **modality_result.json**
   - All model predictions
   - Fused predictions
   - Individual and ensemble metrics
   - Aggregated feature importance

2. **training_report.txt**
   - Dataset statistics
   - Individual model performance
   - Ensemble performance
   - Top 10 important features

3. **Model Checkpoints**
   - `xgb_model.pkl` - XGBoost model weights
   - `rf_model.pkl` - Random Forest model weights

4. **Processed Data**
   - `features.csv` - Preprocessed features
   - `labels.csv` - Labels
   - `merged_raw_data.csv` - Raw merged data

## Feature Selection

REM-specific features include:
- **Symptoms:** Dream vividness, aggressive content, sleep injuries, motor activity
- **Comorbidities:** Stroke, Parkinson's, RLS, Narcolepsy, Depression
- **Medications:** Clonazepam, Benzodiazepines, Antidepressants, SSRIs

## Fusion Methods

### Voting Fusion
- Each model casts one vote
- Class with most votes wins
- Simple and interpretable

### Weighted Voting
- Models weighted by performance
- Better leverages strong models
- Use `fusion_weights` parameter

### Averaging Fusion
- Average probability predictions
- Apply threshold (0.5 default)
- Smoother decision boundaries

### Weighted Averaging
- Weight probabilities by importance
- Custom weight configuration
- Fine-grained control

## Performance Metrics

Models are evaluated on:
- **Accuracy** - Overall correctness
- **Precision** - Positive prediction accuracy
- **Recall** - True positive detection rate
- **F1-Score** - Harmonic mean of precision/recall
- **AUC-ROC** - Area under ROC curve

## Dependencies

```
pandas>=1.0.0
numpy>=1.18.0
scikit-learn>=0.24.0
xgboost>=1.3.0
joblib>=1.0.0
```

## Installation

```bash
pip install pandas numpy scikit-learn xgboost joblib
```

## Related Files

- `Parkinson_guidelines.docx` - Clinical guidelines (reference)
- Raw CSV files - Source data for all 4 datasets
- `dataset.xls` - Alternative format dataset

## Notes

- All paths use forward slashes for cross-platform compatibility
- Models use StandardScaler for feature normalization
- Early stopping prevents overfitting in XGBoost
- Out-of-bag scoring used for Random Forest validation
- Feature importance aggregated across all models in fusion

## Future Enhancements

- Add more models (SVM, Gradient Boosting, Neural Networks)
- Implement stacking-based meta-learner fusion
- Add cross-validation for robust evaluation
- Include uncertainty quantification
- Add feature engineering pipeline
- Implement model interpretability (SHAP values)
