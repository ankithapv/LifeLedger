# Training dataset for LifeLedger document classification

training_texts = [

    # Aadhaar
    "Unique Identification Authority of India Aadhaar card UID number",
    "Government of India Aadhaar identity proof date of birth address",
    "Aadhaar number resident name photograph identity card",
    "Unique Identification Aadhaar resident identity number",
    "Aadhaar card issued by UIDAI Government of India",
    "आधार पहचान पत्र भारतीय विशिष्ट पहचान प्राधिकरण",
    "Aadhaar enrollment number demographic information",
    "Aadhaar identity proof resident address QR code",
    "Aadhaar number UIDAI identity verification resident details",
    "Aadhaar card issued by Unique Identification Authority of India",
    "12 digit Aadhaar identification number Government of India",
    "Aadhaar biometric identity proof QR code resident",
    "Aadhaar enrolment identification address proof India",
    "UIDAI Aadhaar identity document resident photograph",
    "Aadhaar demographic details name date of birth gender",
    "Indian Aadhaar identity card unique identification number",

    # PAN
    "Permanent Account Number PAN Income Tax Department India",
    "Government of India PAN card ten character alphanumeric number",
    "Income tax PAN identity card taxpayer number",
    "Permanent Account Number issued by Income Tax Department",
    "PAN card holder name father's name date of birth",
    "Income Tax Department India PAN identification card",
    "Permanent Account Number taxpayer identification",
    "PAN number alphanumeric tax document",

    # Passport
    "Republic of India passport nationality date of birth place of birth",
    "Passport number country code surname given name date of issue",
    "Indian passport travel document immigration nationality",
    "Government of India passport office travel document",
    "Passport holder surname given names nationality Indian",
    "Date of issue date of expiry passport authority",
    "Passport number place of birth place of issue",
    "Republic of India international passport personal details",
    "Type code country code passport number nationality",
    "Passport travel document bearer signature immigration",

    # Driving Licence
    "Driving licence transport department vehicle registration authorised to drive",
    "Driving license licence number date of issue validity vehicle class",
    "Motor vehicle driving licence holder name date of birth",
    "Government driving licence issued by transport authority",
    "Driving licence number class of vehicle validity",
    "Learner driving licence motor vehicle department",
    "Authorisation to drive motorcycle car transport vehicle",
    "Driving licence holder address date of birth",

    # Insurance
    "Insurance policy number premium coverage nominee policy holder",
    "Life insurance policy document sum assured maturity date",
    "Health insurance coverage policy number claim details insurer",
    "Insurance company policy holder premium payment details",
    "Medical insurance policy coverage hospital expenses",
    "Life insurance nominee beneficiary policy details",
    "Insurance certificate policy period premium amount",
    "Vehicle insurance policy number insured declared value",

    # Other
    "Personal document general information miscellaneous records",
    "College admission certificate examination marks academic records",
    "Rental agreement property address tenant landlord agreement",
    "University degree certificate academic qualification",
    "Birth certificate date of birth registration details",
    "Employment offer letter company joining details",
    "Address proof residential information",
    "Property ownership document sale deed registration",

    # College Study Material
    "College study material semester notes subject syllabus unit chapter",
    "Engineering computer science data structures algorithms programming notes",
    "Binary tree linked list stack queue arrays data structures",
    "Lecture notes classroom teaching examples explanation diagrams",
    "JENNY'S LECTURES computer science programming tutorials",
    "Operating system database management system computer networks notes",
    "Python Java C programming language code examples",
    "Examination preparation question bank university syllabus",
    "Node pointer memory allocation linked representation binary tree",
    "Student academic notes textbook chapter concepts and exercises",
]

training_labels = [
    # Aadhaar
    "Aadhaar", "Aadhaar", "Aadhaar", "Aadhaar",
    "Aadhaar", "Aadhaar", "Aadhaar", "Aadhaar",
    "Aadhaar", "Aadhaar", "Aadhaar", "Aadhaar",
    "Aadhaar", "Aadhaar", "Aadhaar", "Aadhaar",

    # PAN
    "PAN", "PAN", "PAN", "PAN",
    "PAN", "PAN", "PAN", "PAN",

    # Passport
    "Passport", "Passport", "Passport", "Passport",
    "Passport", "Passport", "Passport", "Passport",
    "Passport", "Passport",

    # Driving Licence
    "Driving Licence", "Driving Licence", "Driving Licence",
    "Driving Licence", "Driving Licence", "Driving Licence",
    "Driving Licence", "Driving Licence",

    # Insurance
    "Insurance", "Insurance", "Insurance", "Insurance",
    "Insurance", "Insurance", "Insurance", "Insurance",

    # Other
    "Other", "Other", "Other", "Other",
    "Other", "Other", "Other", "Other",
    "Other", "Other", "Other", "Other",
    "Other", "Other", "Other", "Other",
    "Other", "Other"
]