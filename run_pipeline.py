"""
Quick Start Script for REM ML Pipeline
Run this script to execute the complete pipeline
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from models.train import REMTrainingPipeline


def main():
    """Execute complete REM training pipeline"""
    
    print("\n" + "="*70)
    print("REM SLEEP BEHAVIOR DISORDER - ML PIPELINE")
    print("="*70)
    
    # Configuration
    config = {
        'data_dir': './dataset',
        'output_dir': './models/results',
        'fusion_method': 'voting',  # or 'averaging'
        'fusion_weights': None,      # or {'XGBoost': 0.6, 'RandomForest': 0.4}
    }
    
    try:
        # Initialize pipeline
        print(f"\nInitializing pipeline...")
        print(f"  Data directory: {config['data_dir']}")
        print(f"  Output directory: {config['output_dir']}")
        print(f"  Fusion method: {config['fusion_method']}")
        
        pipeline = REMTrainingPipeline(
            data_dir=config['data_dir'],
            output_dir=config['output_dir']
        )
        
        # Run complete pipeline
        modality_result = pipeline.run_complete_pipeline(
            fusion_method=config['fusion_method'],
            fusion_weights=config['fusion_weights']
        )
        
        # Print final summary
        print("\n" + "="*70)
        print("PIPELINE EXECUTION SUMMARY")
        print("="*70)
        
        summary = modality_result.get_ensemble_summary()
        print(f"\nEnsemble Results:")
        for key, value in summary.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.4f}")
            else:
                print(f"  {key}: {value}")
        
        print(f"\nOutput files saved to: {config['output_dir']}")
        print("  - modality_result.json (predictions and metrics)")
        print("  - training_report.txt (detailed report)")
        print("  - xgb_model.pkl (XGBoost model)")
        print("  - rf_model.pkl (Random Forest model)")
        print("  - processed_data/ (preprocessed features)")
        
        print("\n✓ Pipeline completed successfully!\n")
        
        return True
    
    except Exception as e:
        print(f"\n✗ Error during pipeline execution:")
        print(f"  {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
