# Hands-On Lab: Document Data Model Using MongoDB (Direct Local Python + Django Setup)

## 1. Introduction

This hands-on lab provides a practical introduction to the **Document
Data Model** using **MongoDB**.\
In this lab, you will integrate MongoDB into an existing
Python--Django project , perform CRUD operations through Django REST
API endpoints, and observe how MongoDB stores flexible, semi-structured
documents.

------------------------------------------------------------------------

## 2. Prerequisites
- To complete this lab, you need:
- Your system must already have the following utilities installed localy: - Python 3.8+ - Django installed -
- PyMongo installed - Postman installed - Existing Django project that will extend this crude demonstrations
- the mongo is running either locally or on a remote server
- python project virtual environment created and activated
- Basic command-line knowledge
- Basic Python Django skills
- VS Code or any preferred editor

### Confirming Python & PyMongo Installation

``` python

Chomba@DESKTOP-R340GC5 MINGW64 /d/Projects/python
$ python --version
Python 3.10.7
(appsenv) 

PyMongo is installed using the pip install pymongo to the project virtual env, the pip list command shows that pymongo is already installed

Pygments                      2.19.1
PyJWT                         2.10.1
pymongo                       4.10.1
pyodbc                        5.2.0


```

------------------------------------------------------------------------

## 3. MongoDB Connection Setup

Your Django backend connects directly to a remote MongoDB instance:

``` python
from pymongo import MongoClient

connection_string = "mongodb://AgAdmin:NatAg2030%23%24%21WW@ip_address:27017"
client = MongoClient(connection_string)
db = client["cat2_test"]

try:
    print("Connection successful!")
except Exception as e:
    print("Connection failed:", str(e))
```

------------------------------------------------------------------------

## 4. Document Data Storage in MongoDB

MongoDB stores documents in JSON-like format: there is no specific models schema, each record can have its own layout of content, its flexible

``` json
{
  "test_name": "Sample Test",
  "score": 88,
  "tags": ["backend", "django", "mongodb"]
}
```

------------------------------------------------------------------------

## 5. Django REST API CRUD Endpoints

### 5.1 POST -- Insert Document

``` python
def post(self, request):
    collection = db['cat2_tests']
    data = request.data

    if not isinstance(data, dict):
        return Response({"error": "Body must be JSON"}, status=400)

    result = collection.insert_one(data)
    return Response({"message": "Document created", "_id": str(result.inserted_id)}, status=201)
```

Sample POST Request (Postman):

The postman images and mongo atlas data layouts is uploaded in the images folder



### 5.2 get -- retreave Existing Document

``` python
 def post(self, request):
        """Insert a new document"""
        collection = db['cat2_tests']
        data = request.data

        if not isinstance(data, dict):
            return Response(
                {"error": "Request body must be a JSON object"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = collection.insert_one(data)
        return Response({
            "message": "Document created",
            "_id": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)
  

Sample Get Request (Postman):

The postman images and mongo atlas data layouts is uploaded in the images folder
```

### 5.3 PUT -- Update Existing Document

``` python
 def put(self, request, _id):
        """Update a document by _id (from URL)"""
        collection = db['cat2_tests']
        try:
            obj_id = ObjectId(_id)
        except Exception:
            return Response(
                {"error": "Invalid _id format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        update_data = request.data
        if not isinstance(update_data, dict):
            return Response(
                {"error": "Update data must be a JSON object"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = collection.update_one(
            {"_id": obj_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"message": "Document updated"})
```

### 5.4 Delete -- Delete Existing Document

``` python

    def delete(self, request, _id):
        """Delete a document by _id (from URL)"""
        collection = db['cat2_tests']
        try:
            obj_id = ObjectId(_id)
        except Exception:
            return Response(
                {"error": "Invalid _id format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = collection.delete_one({"_id": obj_id})

        if result.deleted_count == 0:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"message": "Document deleted"})
```

below are the enpoints urls

 # cat2

    path('cat2_tests/', MongoCRUDView.as_view(), name='mongo-list-create'),

    # For GET/PUT/PATCH/DELETE single
    path('cat2_tests/<str:_id>/', MongoCRUDView.as_view(), name='mongo-detail'),




## 6. Applied Scenario: Farmer Registration System

This scenerio helps to demeonstarte how different farmers might have different farm structure,for crops, livestocks or fisheries.
The document model database(mongoDb) helps to handle this dynamism through the flexible nature of the model base non relational database

MongoDB handles nested structures:

``` json
{
  "farmer": {
    "farmer_id": "1002456",
    "national_id_no": "0000000",
    "farmer_name": "John Mwangi",
    "gender": "Male",
    "admin_units": {
      "county": "NAKURU",
      "subcounty": "NAKURU NORTH",
      "ward": "BAHATI",
    "crops": [
      {
        "crop_name": "Maize",
        "acreage": 1.5,
        "purpose": "Commercial",
        "irrigated": false,
        "variety": "Pioneer 30G19",
        "season": "Long Rains"
      },
      {
        "crop_name": "Potatoes",
        "acreage": 0.8,
        "purpose": "Commercial",
        "irrigated": false,
        "variety": "Shangi",
        "season": "Short Rains"
      }
    ],
    "livestock": [
      {
        "type": "Cattle",
        "breed": "Friesian",
        "count": 5,
        "purpose": "Dairy",
        "housing": "Zero Grazing"
      },
      {
        "type": "Goats",
        "breed": "Galla",
        "count": 12,
        "purpose": "Meat"
      }
    ],
    "created_at": "2025-12-10T18:22:00Z",
    "updated_at": "2025-12-10T18:22:00Z"
  }
}

```

## 7. Validation Screenshots

Included: - Postman POST GET,PUT  and DELETE results
- MongoDB Atlas/Compass showing documents
- Terminal connection test

these screen shots are uploaded to the images folder inside this BUG_FIXERS CAT2 project folder








