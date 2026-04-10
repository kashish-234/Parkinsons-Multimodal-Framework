import torch
import torch.nn as nn
import torch.optim as optim

from preprocess import load_and_preprocess
from model import FOGModel


# 🔥 CHANGE THIS PATH
DATA_PATH = "D:/daphnet+freezing+of+gait/dataset_fog_release/dataset"


def train():
    # load data
    train_loader, test_loader = load_and_preprocess(DATA_PATH)

    # model
    model = FOGModel()

    # loss (handle imbalance)
    weights = torch.tensor([1.0, 1.5])
    criterion = nn.CrossEntropyLoss(weight=weights)

    optimizer = optim.Adam(model.parameters(), lr=1e-3)

    # training loop
    for epoch in range(10):
        model.train()
        total_loss = 0

        for xb, yb in train_loader:
            optimizer.zero_grad()

            out = model(xb)
            loss = criterion(out, yb)

            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")

    return model, test_loader


def evaluate(model, test_loader):
    model.eval()

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for xb, yb in test_loader:
            out = model(xb)

            probs = torch.softmax(out, dim=1)[:, 1]
            preds = (probs > 0.4).int()

            all_preds.extend(preds.numpy())
            all_labels.extend(yb.numpy())

    from sklearn.metrics import classification_report, confusion_matrix

    print(confusion_matrix(all_labels, all_preds))
    print(classification_report(all_labels, all_preds))


if __name__ == "__main__":
    model, test_loader = train()
    evaluate(model, test_loader)

    torch.save(model.state_dict(), "gait_model.pt")
