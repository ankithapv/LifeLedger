# Independent test samples for LifeLedger
# These examples are separate from training_data.py

evaluation_texts = [
    # Aadhaar
    "UIDAI issued identity card with twelve digit resident identification number",
    "Government of India Aadhaar number and resident QR verification",

    # PAN
    "Income Tax Department permanent account number issued to taxpayer",
    "PAN identification card containing taxpayer name and date of birth",

    # Passport
    "Indian travel document containing passport number and nationality",
    "Passport issued by regional passport office for international travel",

    # Driving Licence
    "Motor vehicle department authorisation to drive two wheeler and car",
    "Transport authority driving permit with licence number and vehicle class",

    # Insurance
    "Insurance certificate showing policyholder premium and insured coverage",
    "Insurer document containing sum assured beneficiary and policy details",

    # Other
    "University semester examination timetable and subject information",
    "Residential rental contract containing landlord and tenant information",
]

evaluation_labels = [
    "Aadhaar", "Aadhaar",
    "PAN", "PAN",
    "Passport", "Passport",
    "Driving Licence", "Driving Licence",
    "Insurance", "Insurance",
    "Other", "Other",
]