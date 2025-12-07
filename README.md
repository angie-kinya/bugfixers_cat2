# Introduction
This lab introduces the Document Data Model using MongoDB. Unlike relational databases (SQL) that use rigid tables and rows, MongoDB stores data in flexible, JSON-like documents. This allows for nested structures and varying fields between data entries, making it ideal for content management, e-commerce catalogs, and real-time analytics.

**Lab Objective**: By the end of this session, you will be able to launch a MongoDB container, create database, perform CRUD operations, and manage a flexible product catalog scenario.

## Applied Scenario

### Business Problem
"Read & Tech Haven" is a modern bookstore selling physical books, e-books, audiobooks, electronics, and accessories. The business faces challenges managing diverse product types with varying attributes, inventory rules, and the need for personalized recommendations and format analysis. For example, physical books have dimension as an attributte , which is not applicable to audio_books, and viceversa, for download format. Among many more.

### Why Document Data Model Solves This
Traditional relational databases struggle with rigid schemas when handling heterogeneous product types, frequently changing attributes, and nested data structures. MongoDB's document model provides flexible schemas, embedded documents for complex specifications, and the ability to easily add new product categories while supporting complex queries across diverse data types. 


# Lab Guide

### Prerequisites
- Docker, Docker Compose, Code Editor(VS Code) and git installed on your system

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
  

2. **Navigate to project root directory, via the terminal on your machine**
   ```bash
   cd bugfixers_cat2
   ```
   This is the root folder containing `docker-compose.yml` file. Confirm its there!


3. **Create & Start MongoDB container**
   ```bash
   docker-compose up -d
   ```
   *up*: tells Docker to build/pull and start the services defined in the YML file.

   *-d*: Detached mode (runs in the background so it doesn't lock up your terminal)

   This starts MongoDB with Mongo-Express (web UI) in the background. These are defined in the `docker-compose.yml` file.

4. **Verify the Setup**
  To check if the container is running correctly, use:
    ```bash
   docker compose ps
   ```
   You should see **bugfixers_cat2** listed with a status of "Up". If its not started, check if you have another container using the same port as the one defined in our yml file

5. **Access MongoDB shell**
   ```bash
   docker exec -it bugfixers_cat2 mongosh -u admin -p password123
   ```
   You're now in the MongoDB command-line interface. Your prompt should look like,
   ```bash  
   test>
    ```


## Basic CRUD Operations

Once you're in the MongoDB shell, practice these fundamental operations:

### 1. **Create a New Database**
   ```javascript
   use bookstore
   ```
   **Expected Output**: `switched to db bookstore`
   
   MongoDB creates the database when you first insert data into it.

### 2. **Insert Data (Single Item)**
   ```javascript
   db.products.insertOne({
     name: "Introduction to MongoDB",
     category: "book",
     price: 29.99,
     stock: 50
   })
   ```
   **Expected Output**: 
   ```javascript
   {
     acknowledged: true,
     insertedId: ObjectId("...")
   }
   ```

### 3. **Insert Data (Multiple Items)**
   ```javascript
   db.products.insertMany([
     { name: "Python Guide", category: "book", price: 34.99, stock: 30 },
     { name: "JavaScript Basics", category: "book", price: 27.99, stock: 45 }
   ])
   ```
   **Expected Output**:
   ```javascript
   {
     acknowledged: true,
     insertedIds: [ ObjectId("..."), ObjectId("...") ]
   }
   ```

### 4. **Read (Find) Data**

   **Retrieve all products:**
   ```javascript
   db.products.find().pretty()
   ```
   **Expected Output**: All documents in the collection, formatted for readability.

   **Retrieve a specific product:**
   ```javascript
   db.products.findOne({ name: "Introduction to MongoDB" })
   ```
   **Expected Output**: The first matching document, or `null` if not found.

### 5. **Update Data (Modify an Item)**
   ```javascript
   db.products.updateOne(
     { name: "Introduction to MongoDB" },
     { $set: { price: 24.99, stock: 40 } }
   )
   ```
   **Expected Output**:
   ```javascript
   {
     acknowledged: true,
     matchedCount: 1,
     modifiedCount: 1
   }
   ```
   `$set` updates specified fields without affecting others.
   You can also run the command for data read to confirm the update.
   ```javascript
   db.products.findOne({ name: "Introduction to MongoDB" })
   ```
   

### 6. **Remove (Delete) Data**
   ```javascript
   db.products.deleteOne({ name: "Introduction to MongoDB" })
   ```
   **Expected Output**:
   ```javascript
   {
     acknowledged: true,
     deletedCount: 1
   }
   ```
   Removes the first document matching the criteria. Now when you run the data read command , it should return null
   ```javascript
   db.products.findOne({ name: "Introduction to MongoDB" })
   ```

### 7. **Add a New Field to an Existing Document**
   You can add new fields to existing documents without modifying other fields:
   ```javascript
   db.products.updateOne(
     { name: "Python Guide" },
     { $set: { description: "A comprehensive guide to Python programming", isbn: "978-0123456789" } }
   )
   ```
   **Expected Output**:
   ```javascript
   {
     acknowledged: true,
     matchedCount: 1,
     modifiedCount: 1
   }
   ```
   Verify the update by reading the document:
   ```javascript
   db.products.findOne({ name: "Python Guide" })
   ```
   The document now includes the new `description` and `isbn` fields while preserving all existing fields.

### 8. **Add a New Nested Field**
   MongoDB supports nested documents, allowing you to store complex, hierarchical data:
   ```javascript
   db.products.updateOne(
     { name: "Python Guide" },
     { $set: { 
       metadata: {
         publisher: "Tech Books Inc",
         publication_date: "2023-01-15",
         pages: 450,
         language: "English"
       }
     } }
   )
   ```
   **Expected Output**:
   ```javascript
   {
     acknowledged: true,
     matchedCount: 1,
     modifiedCount: 1
   }
   ```
   You can also add nested fields to existing nested objects:
   ```javascript
   db.products.updateOne(
     { name: "Python Guide" },
     { $set: { 
       "metadata.format": "Paperback",
       "metadata.dimensions": {
         width: 6,
         height: 9,
         unit: "inches"
       }
     } }
   )
   ```

### 9. **Query a Nested Field**
   To query documents based on nested field values, use dot notation:
   ```javascript
   db.products.find({ "metadata.publisher": "Tech Books Inc" }).pretty()
   ```
   **Expected Output**: All products where the nested `metadata.publisher` field matches "Tech Books Inc".

   You can also query nested fields with conditions:
   ```javascript
   db.products.find({ "metadata.pages": { $gt: 400 } }).pretty()
   ```
   This returns all products with more than 400 pages.

   Query deeply nested fields:
   ```javascript
   db.products.find({ "metadata.dimensions.width": { $gte: 6 } }).pretty()
   ```
   This finds products where the nested `dimensions.width` is greater than or equal to 6.

   Verify your nested data structure:
   ```javascript
   db.products.findOne({ name: "Python Guide" })
   ```

## Conclusion on Basic CRUD Operations

MongoDB's document model provides a flexible and intuitive way to manage data. The basic CRUD operations form the foundation of database interactions:

- **Create**: `insertOne()` and `insertMany()` allow you to add new documents to collections. MongoDB automatically creates databases and collections when you first insert data.

- **Read**: `find()` and `findOne()` enable you to retrieve documents. You can query by any field, including nested fields using dot notation, and use various operators for complex filtering.

- **Update**: `updateOne()` and `updateMany()` with operators like `$set`, `$inc`, and `$push` let you modify existing documents. You can add new fields, update existing ones, or modify nested structures without affecting other fields.

- **Delete**: `deleteOne()` and `deleteMany()` remove documents from collections based on specified criteria.

The flexibility of MongoDB's document model shines when working with nested fields. Unlike relational databases that require joins across tables, MongoDB allows you to store related data together in nested documents, making queries more efficient and the data model more intuitive for many use cases. This is particularly valuable for scenarios like product catalogs, where different product types may have varying attributes that can be stored flexibly within the same collection.

## Advanced Query Scenarios

Now that you've mastered the basic CRUD operations, it's time to tackle more complex real-world scenarios. This section will challenge you to work with a realistic bookstore database setup and perform advanced queries that demonstrate MongoDB's powerful querying capabilities.

### Setup the Database

Before you begin, you need to set up the bookstore and ecommerce databases with sample data. This setup script will create two databases:

1. **bookstore** database with a `books` collection containing programming and technical books
2. **ecommerce** database with a `products` collection containing various product types (physical books, ebooks, audiobooks)

**To load the setup script:**

1. **Exit the MongoDB shell** (if you're currently in it) by typing `exit` or pressing `Ctrl+D`

2. **Load the setup script from your terminal** (not inside MongoDB shell), confirm the file `setup-bookstore.js` is in the root folder before running this command:
   ```bash
   docker exec -i bugfixers_cat2 mongosh -u admin -p password123 < setup-bookstore.js
   ```

   **Expected Output**: You should see messages indicating:
   - Books collection created with sample data
   - Products collection created with sample data
   - Indexes created successfully
   - Database setup complete with document counts

3. **Re-enter the MongoDB shell** to begin working with the data:
   ```bash
   docker exec -it bugfixers_cat2 mongosh -u admin -p password123
   ```

### Perform Advanced Query Operations

Now that your databases are set up, you'll work through a series of advanced query operations. These operations are defined in the `crud-operations.js` file and cover:

- **Complex filtering** with multiple conditions and logical operators
- **Aggregation pipelines** for data analysis and transformation
- **Nested field queries** using dot notation
- **Array operations** including element matching and manipulation
- **Text search** using MongoDB's full-text search capabilities
- **Business scenarios** such as:
  - Finding products with stock across multiple warehouses
  - Calculating average prices by product type
  - Finding top-rated products
  - Revenue analysis by category
  - Inventory management operations
  - Processing sales and restocking
  - Adding customer reviews
  - Applying promotional discounts
  - Finding low-stock items
  - Calculating total inventory value

**To work through these operations:**

1. **Open the `crud-operations.js` file** in your editor to see all the queries

2. **Copy and execute each query** one at a time in the MongoDB shell, or execute the entire file:
   ```bash
   docker exec -i bugfixers_cat2 mongosh -u admin -p password123 < crud-operations.js
   ```

3. **For learning purposes**, we recommend executing queries individually so you can:
   - Observe the output of each query
   - Understand what each operation does
   - Modify queries to experiment with different conditions
   - Verify results using `find()` operations

4. **Key queries to focus on:**
   - Complex queries with `$and`, `$or`, and nested conditions
   - Aggregation pipelines with `$group`, `$match`, `$project`, `$sort`, and `$unwind`
   - Queries using `$expr` for computed field comparisons
   - Text search queries
   - Regular expression queries for pattern matching
   - Date range queries
   - Array operations with `$push`, `$pull`, and `$size`

**Importnat to Note:**
- After each query, verify the results using `find()` or `findOne()`
- Experiment by modifying query conditions to see how results change
- Pay attention to how nested fields are accessed using dot notation
- Notice how aggregation pipelines transform data step by step
- Compare the efficiency of different query approaches

NB: See screenshots in the `images` folder to see the expected output. 

## Collaborators
|**Admission No.** | **Name** | **Task** |
|:------------:|:-----|:-----|
| 124461 | Angela Gitonga | Environment Setup |
| 099913 | Gloria Simiyu | Applied Scenarios and screenshots |
| 138133 | Neville Masheti | Documentation |
| 223108 | David Chomba | CRUD Operations |
| 225518 | Nathan Omeri | Testing and Validation |


