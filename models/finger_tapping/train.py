import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

from models.finger_tapping.model import FingerTappingModel


# =========================
# LOAD DATA
# =========================

def load_data(file_path):
    df = pd.read_csv(file_path)

    print("Columns:", df.columns)

    # target column
    y = df["diagnosed"].map({"yes": 1, "no": 0})

    # drop non-useful columns
    X = df.drop(columns=[
        "diagnosed",
        "gender",
        "age"
    ], errors="ignore")

    # keep only numeric features
    X = X.select_dtypes(include=[np.number])

    print("Final shape:", X.shape, y.shape)
    print("Class balance:\n", y.value_counts())

    return X, y


# =========================
# TRAIN FUNCTION
# =========================

def train_model(file_path):
    X, y = load_data(file_path)

    # split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    # handle imbalance
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    # init model
    model = FingerTappingModel(scale_pos_weight=scale_pos_weight)

    # train
    model.fit(X_train, y_train)

    # =========================
    # EVALUATION
    # =========================

    y_pred = model.model.predict(X_test)

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # =========================
    # SAMPLE PREDICTION (IMPORTANT)
    # =========================

    sample = X_test.iloc[[0]].values
    output = model.predict(sample)

    print("\nSample ModelOutput:")
    print(output)

    return model


# =========================
# RUN
# =========================

if __name__ == "__main__":
    model = train_model("data/fingertapping.csv")  #  change path if needed
