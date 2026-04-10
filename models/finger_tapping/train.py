from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib

from preprocess import load_and_preprocess
from model import get_model


# 🔥 CHANGE THIS PATH
DATA_PATH = "D:/path_to_your_csv/fingertapping_features_severity_diagnosis_June13_2023.csv"


def train():
    X, y = load_and_preprocess(DATA_PATH)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # handle imbalance
    scale_pos_weight = len(y_train[y_train == 0]) / len(y_train[y_train == 1])

    model = get_model(scale_pos_weight)

    model.fit(X_train, y_train)

    return model, X_test, y_test


def evaluate(model, X_test, y_test):
    y_pred = model.predict(X_test)

    print(confusion_matrix(y_test, y_pred))
    print(classification_report(y_test, y_pred))


if __name__ == "__main__":
    model, X_test, y_test = train()
    evaluate(model, X_test, y_test)

    joblib.dump(model, "finger_tapping_model.pkl")
