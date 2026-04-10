"""
Data Preprocessing for REM Sleep Behavior Disorder Dataset
Handles loading, cleaning, and preparing data for model training
"""

import pandas as pd
import numpy as np
import os
from typing import Tuple, Dict, List
from pathlib import Path
import warnings

warnings.filterwarnings('ignore')


class REMDataProcessor:
    """Preprocessing pipeline for REM datasets"""
    
    def __init__(self, data_dir: str = '.'):
        self.data_dir = data_dir
        self.datasets = {}
        self.merged_data = None
        self.features = None
        self.labels = None
        
    def load_all_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all REM-related CSV files"""
        files = {
            'main': 'dataset.csv',
            'features': 'Features_of_REM_Behavior_Disorder-Archived_09Apr2026.csv',
            'questionnaire': 'REM_Sleep_Behavior_Disorder_Screening_Questionnaire_09Apr2026.csv',
            'questionnaire_archived': 'REM_Sleep_Disorder_Questionnaire-Archived_09Apr2026.csv'
        }
        
        for key, filename in files.items():
            filepath = os.path.join(self.data_dir, filename)
            if os.path.exists(filepath):
                try:
                    df = pd.read_csv(filepath)
                    self.datasets[key] = df
                    print(f"[OK] Loaded {key}: {df.shape}")
                except Exception as e:
                    print(f"[ERROR] Error loading {key}: {e}")
        
        return self.datasets
    
    def clean_column_names(self) -> None:
        """Standardize column names"""
        for key, df in self.datasets.items():
            df.columns = df.columns.str.strip()
            df.columns = df.columns.str.replace(r'\s+', ' ', regex=True)
            df.columns = df.columns.str.lower().str.replace(' ', '_').str.replace('[()/-]', '', regex=True)
            self.datasets[key] = df
        print("✓ Column names cleaned")
    
    def handle_missing_values(self) -> None:
        """Handle missing values with appropriate strategies"""
        for key, df in self.datasets.items():
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            categorical_cols = df.select_dtypes(include=['object']).columns
            
            # Fill numeric with median
            for col in numeric_cols:
                try:
                    null_count = df[col].isnull().sum()
                    if null_count > 0:
                        df[col].fillna(df[col].median(), inplace=True)
                except:
                    pass
            
            # Fill categorical with mode
            for col in categorical_cols:
                try:
                    null_count = df[col].isnull().sum()
                    if null_count > 0:
                        mode_val = df[col].mode()
                        if len(mode_val) > 0:
                            df[col].fillna(mode_val.iloc[0], inplace=True)
                except:
                    pass
            
            self.datasets[key] = df
        print("[OK] Missing values handled")
    
    def remove_duplicates(self) -> None:
        """Remove duplicate rows"""
        for key, df in self.datasets.items():
            before = len(df)
            df.drop_duplicates(inplace=True)
            after = len(df)
            if before > after:
                print(f"  Removed {before - after} duplicates from {key}")
            self.datasets[key] = df
    
    def merge_datasets(self) -> pd.DataFrame:
        """Merge all datasets into single dataframe"""
        if 'questionnaire' in self.datasets:
            merged = self.datasets['questionnaire'].copy()
        else:
            merged = self.datasets['main'].copy()
        
        print(f"Starting merge: {merged.shape}")
        
        # Merge with features
        if 'features' in self.datasets:
            try:
                merge_cols = ['patno', 'event_id']
                features_df = self.datasets['features']
                if all(col in features_df.columns for col in merge_cols):
                    merged = merged.merge(features_df, on=merge_cols, how='left', suffixes=('', '_med'))
                    print(f"After merging features: {merged.shape}")
            except Exception as e:
                print(f"Could not merge features: {e}")
        
        self.merged_data = merged
        return merged
    
    def extract_rem_features(self) -> pd.DataFrame:
        """Extract REM-specific features for modeling"""
        if self.merged_data is None:
            raise ValueError("Run merge_datasets first")
        
        df = self.merged_data.copy()
        
        # REM symptom features (excluding the target variable ptcgboth)
        rem_symptom_cols = [
            'drmvivid', 'drmagrac', 'drmnoctb', 'slplmbmv',
            'slpinjur', 'drmverbl', 'drmfight', 'drmumv', 'drmobjfl',
            'mvawaken', 'drmremem', 'slpdstrb'
        ]
        
        # Comorbidity features
        comorbidity_cols = [
            'stroke', 'hetra', 'parkism', 'rls', 'narclpsy', 'deprs',
            'epilepsy', 'brninfm', 'cnsoth'
        ]
        
        # Medication features
        medication_cols = [
            'onclnzp', 'onbenz', 'onmlaton', 'onssri', 'onnorsri',
            'ontriadp', 'onbtablk'
        ]
        
        # Select available features
        available_rem_features = [col for col in rem_symptom_cols if col in df.columns]
        available_comorbidity = [col for col in comorbidity_cols if col in df.columns]
        available_medication = [col for col in medication_cols if col in df.columns]
        
        # Create feature set
        feature_cols = available_rem_features + available_comorbidity + available_medication
        
        # Handle numeric conversions
        for col in feature_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col].fillna(df[col].median(), inplace=True)
        
        self.features = df[feature_cols].copy()
        self.labels = df['ptcgboth'].copy()  # Primary outcome
        
        # Remap labels to start from 0 for classification models
        label_map = {val: idx for idx, val in enumerate(sorted(self.labels.unique()))}
        self.labels = self.labels.map(label_map)
        
        print(f"[OK] Extracted REM features: {self.features.shape}")
        print(f"[OK] Labels shape: {self.labels.shape}")
        
        return self.features, self.labels
    
    def get_processed_data(self) -> Tuple[pd.DataFrame, pd.Series]:
        """Get processed features and labels"""
        return self.features, self.labels
    
    def save_processed_data(self, output_dir: str = '.') -> None:
        """Save processed data to disk"""
        os.makedirs(output_dir, exist_ok=True)
        
        if self.features is not None:
            self.features.to_csv(os.path.join(output_dir, 'features.csv'), index=False)
            print(f"✓ Saved features to {output_dir}/features.csv")
        
        if self.labels is not None:
            self.labels.to_csv(os.path.join(output_dir, 'labels.csv'), index=False)
            print(f"✓ Saved labels to {output_dir}/labels.csv")
        
        if self.merged_data is not None:
            self.merged_data.to_csv(os.path.join(output_dir, 'merged_raw_data.csv'), index=False)
            print(f"✓ Saved merged data to {output_dir}/merged_raw_data.csv")


def prepare_dataset(data_dir: str = '.', output_dir: str = None) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Complete preprocessing pipeline
    
    Returns:
        Tuple of (features, labels)
    """
    processor = REMDataProcessor(data_dir=data_dir)
    
    # Execute pipeline
    processor.load_all_datasets()
    processor.clean_column_names()
    processor.handle_missing_values()
    processor.remove_duplicates()
    processor.merge_datasets()
    features, labels = processor.extract_rem_features()
    
    # Save if output directory specified
    if output_dir:
        processor.save_processed_data(output_dir)
    
    return features, labels


if __name__ == "__main__":
    # Example usage
    features, labels = prepare_dataset(data_dir='.', output_dir='./processed')
    print(f"\nFinal dataset: {features.shape}")
    print(f"Features shape: {features.shape}")
    print(f"Labels distribution:\n{labels.value_counts()}")



