import pickle
from pathlib import Path


MODEL_PATH = Path(__file__).resolve().parent / "document_classifier.pkl"


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "ML model not found. Run train_model.py first."
        )

    with open(MODEL_PATH, "rb") as file:
        return pickle.load(file)


def predict_document_category(document_text: str) -> str:
    if not document_text or not document_text.strip():
        raise ValueError("Document text cannot be empty.")

    model = load_model()

    prediction = model.predict([document_text])

    return prediction[0]