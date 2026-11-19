import pickle
from pathlib import Path

from sklearn.metrics import accuracy_score, classification_report

from app.ml.evaluation_data import evaluation_texts, evaluation_labels


# Load the already trained model
MODEL_PATH = Path(__file__).resolve().parent / "document_classifier.pkl"

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


# Predict categories for independent evaluation samples
predictions = model.predict(evaluation_texts)


# Calculate evaluation accuracy
accuracy = accuracy_score(evaluation_labels, predictions)

print("\n========== INDEPENDENT ML EVALUATION ==========")

print(f"Evaluation samples: {len(evaluation_texts)}")
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(
    evaluation_labels,
    predictions,
    zero_division=0
))

print("\nIndividual Predictions:")

for text, actual, predicted in zip(
    evaluation_texts,
    evaluation_labels,
    predictions
):
    print(f"\nActual: {actual}")
    print(f"Predicted: {predicted}")
    print(f"Result: {'PASS' if actual == predicted else 'FAIL'}")

print("\n===============================================")