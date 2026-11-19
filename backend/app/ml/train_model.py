import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from app.ml.training_data import training_texts, training_labels


# Split dataset into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    training_texts,
    training_labels,
    test_size=0.2,
    random_state=42,
    stratify=training_labels
)


# Create the ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )),
    ("classifier", MultinomialNB())
])


# Train the model
model.fit(X_train, y_train)


# Evaluate the model using unseen test samples
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)


# Display evaluation results
print("\n========== LIFELedger ML EVALUATION ==========")

print(f"Total dataset samples: {len(training_texts)}")
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")
print(f"Document categories: {len(set(training_labels))}")

print(f"\nTest Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    zero_division=0
))

print("===============================================")


# Save the trained model
MODEL_PATH = Path(__file__).resolve().parent / "document_classifier.pkl"

with open(MODEL_PATH, "wb") as file:
    pickle.dump(model, file)


print("\nLifeLedger document classification model trained successfully!")
print(f"Model saved at: {MODEL_PATH}")