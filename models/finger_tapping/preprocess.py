import pandas as pd


def load_and_preprocess(file_path):
    df = pd.read_csv(file_path)

    # convert labels
    y = df["diagnosed"].astype(str).str.lower().map({
        "yes": 1,
        "no": 0
    })

    # remove invalid rows
    mask = y.notna()
    df = df[mask]
    y = y[mask]

    # drop useless columns
    X = df.drop(columns=["diagnosed", "Unnamed: 0"], errors="ignore")

    # keep numeric only
    X = X.select_dtypes(include=["number"])

    return X, y
