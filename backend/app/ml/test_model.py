import unittest

from app.ml.predict import predict_document_category


class TestDocumentClassifier(unittest.TestCase):

    def test_aadhaar_classification(self):
        result = predict_document_category(
            "Aadhaar card Unique Identification Authority of India"
        )
        self.assertEqual(result, "Aadhaar")

    def test_pan_classification(self):
        result = predict_document_category(
            "Permanent Account Number Income Tax Department PAN"
        )
        self.assertEqual(result, "PAN")

    def test_passport_classification(self):
        result = predict_document_category(
            "Indian passport nationality date of birth travel document"
        )
        self.assertEqual(result, "Passport")

    def test_driving_licence_classification(self):
        result = predict_document_category(
            "Driving licence vehicle registration transport department"
        )
        self.assertEqual(result, "Driving Licence")

    def test_insurance_classification(self):
        result = predict_document_category(
            "Insurance policy premium coverage policy holder"
        )
        self.assertEqual(result, "Insurance")

    def test_empty_document_text(self):
        with self.assertRaises(ValueError):
            predict_document_category("")

    def test_other_document_classification(self):
        result = predict_document_category(
            "College engineering study material binary tree linked list notes"
        )
        self.assertEqual(result, "Other")

if __name__ == "__main__":
    unittest.main(verbosity=2)