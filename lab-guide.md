# NoSQL Database Lab Guide: Document Data Model with MongoDB

## Executive Summary

**Target Database:** MongoDB 8.0  
**Data Model:** Document (JSON-based)  
**Estimated Time:** 45 minutes  
**Prerequisites:** Basic command line knowledge, Docker installed (or administrative access for direct installation)

---

## 1. Setup Instructions

### Docker Installation and Mongo DB setup

**Steps:**

```bash
# Pull MongoDB image
docker pull mongo:8.0

# Create a named volume for data persistence
docker volume create bugfixers_data

# Run MongoDB container
docker run -d \
  --name bugfixers_cat2 \
  -p 27017:27017 \
  -v bugfixers_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:8.0

# Verify container is running
docker ps | grep bugfixers_cat2

# Access MongoDB shell
docker exec -it bugfixers_cat2 mongosh -u admin -p password123
```
![MongoDB Image](images/Screenshot%20From%202025-11-28%2015-32-03.png)
![MongoDB Image](images/Screenshot%20From%202025-11-28%2015-33-57.png)
![MongoDB Image](images/Screenshot%20From%202025-11-28%2015-34-14.png)

**Verification:**
```javascript
// Inside mongosh, run:
db.version()
// Should output: 8.0.x
```

---

## 2. Basic CRUD Operations

### Database and Collection Setup

```javascript
// Switch to new database 
use bookstore

// View current database
db.getName()
```

### CREATE Operations

```javascript
// Insert single document
db.books.insertOne({
  isbn: "978-0134685991",
  title: "Effective Java",
  author: "Joshua Bloch",
  publisher: "Addison-Wesley",
  year: 2018,
  price: 45.99,
  categories: ["Programming", "Java"],
  stock: 15,
  reviews: {
    average: 4.7,
    count: 342
  }
})

// Insert multiple documents
db.books.insertMany([
  {
    isbn: "978-0135957059",
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    publisher: "Addison-Wesley",
    year: 2019,
    price: 42.50,
    categories: ["Programming", "Best Practices"],
    stock: 23,
    reviews: {
      average: 4.8,
      count: 891
    }
  },
  {
    isbn: "978-1617294136",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    year: 2017,
    price: 52.00,
    categories: ["Databases", "Distributed Systems"],
    stock: 8,
    reviews: {
      average: 4.9,
      count: 567
    }
  }
])
```

### READ Operations

```javascript
// Find all documents
db.books.find()

// Find with specific criteria
db.books.find({ year: { $gte: 2018 } })

// Find one document
db.books.findOne({ isbn: "978-0134685991" })

// Projection (select specific fields)
db.books.find(
  { price: { $lt: 50 } },
  { title: 1, price: 1, author: 1, _id: 0 }
)

// Complex query with operators
db.books.find({
  $and: [
    { categories: "Programming" },
    { stock: { $gt: 10 } },
    { "reviews.average": { $gte: 4.5 } }
  ]
}).pretty()
```

### UPDATE Operations

```javascript
// Update single document
db.books.updateOne(
  { isbn: "978-0134685991" },
  { 
    $set: { price: 39.99 },
    $inc: { stock: 5 }
  }
)

// Update multiple documents
db.books.updateMany(
  { publisher: "Addison-Wesley" },
  { $mul: { price: 0.9 } }  // 10% discount
)

// Add element to array
db.books.updateOne(
  { isbn: "978-1617294136" },
  { $push: { categories: "Architecture" } }
)
```

### DELETE Operations

```javascript
// Delete single document
db.books.deleteOne({ isbn: "978-0134685991" })

// Delete multiple documents
db.books.deleteMany({ stock: { $eq: 0 } })

// Delete all documents (keep collection)
db.books.deleteMany({})
```

---

## 3. Applied Scenario and Complex Queries: Read and Tech Haven

### Problem Context

This is an online bookstore that sells(physical books, E-books, audiobooks, electronics and accessories) 
The importance of using a document managment system for this bookstore is it needs a flexible database system that can:
  - Handle varying product attributes (books vs. ebooks vs. audiobooks)
  - Store nested review data and ratings
  - Support dynamic inventory tracking
  - Enable fast searches across multiple fields
  - Accommodate frequent schema changes without migrations

**Why Document Model?**  
Document databases excel here because each product can have a unique structure stored as a self-contained JSON document, eliminating rigid schemas and JOIN operations.

### Implementation

#### Step 1: Create Sample Product Catalog
```bash
# access container
docker exec -it bugfixers_cat2 mongosh -u admin -p password123

#use the bookstore database
use bookstore

# Create products collection
db.createCollection("products")

# Insert products
db.products.insertOne({
  product_id: "BK-001",
  name: "The Midnight Library",
  category: "Physical Book",
  price: 14.99
})

# or insert using insert-products.js file
docker exec -i bugfixers_cat2 mongosh -u admin -p password123 < insert-products.js

```

#### Step 2: Complex Queries for Mixed Bookstore

```javascript
// Query 1: Cross-Category Search
//Find all products related to "reading" regardless of category
db.products.find({
  $or: [
    { tags: "reading" },
    { category: { $in: ["Physical Book", "E-Book", "Audiobook"] } },
    { subcategory: "E-Reader" },
    { name: /read/i }
  ]
}).pretty()

//Query 2: Price Analysis by Category
// Compare pricing across different formats of the same content
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      avg_price: { $avg: "$price" },
      min_price: { $min: "$price" },
      max_price: { $max: "$price" },
      total_products: { $sum: 1 },
      total_stock: { $sum: "$stock_quantity" },
      avg_discount: { $avg: "$discount" }
    }
  },
  {
    $sort: { avg_price: -1 }
  }
])

//Query 3: Inventory Management for Physical vs Digital books
// Identify products that need restocking (physical) vs unlimited (digital) copies
db.products.aggregate([
  {
    $addFields: {
      inventory_status: {
        $switch: {
          branches: [
            {
              case: { $in: ["$category", ["Physical Book", "Electronics", "Accessories"]] },
              then: {
                $cond: {
                  if: { $lt: ["$stock_quantity", 20] },
                  then: "LOW_STOCK",
                  else: "IN_STOCK"
                }
              }
            },
            {
              case: { $in: ["$category", ["E-Book", "Audiobook"]] },
              then: "UNLIMITED"
            }
          ],
          default: "UNKNOWN"
        }
      }
    }
  },
  {
    $match: {
      inventory_status: "LOW_STOCK"
    }
  },
  {
    $project: {
      name: 1,
      category: 1,
      stock_quantity: 1,
      inventory_status: 1,
      restock_priority: {
        $cond: {
          if: { $gt: ["$ratings.average", 4.5] },
          then: "HIGH",
          else: "MEDIUM"
        }
      }
    }
  }
])

//Query 4: Customer Bundle Recommendations
bookstore> db.products.aggregate([
  {
    $match: {
      product_id: { $ne: "BK-001" }
    }
  },
  {
    $addFields: {
      bundle_score: {
        $add: [
          { $cond: [{ $eq: ["$category", "Electronics"] }, 30, 0] },
          { $cond: [{ $eq: ["$subcategory", "E-Reader"] }, 40, 0] },
          { $cond: [{ $in: ["reading", "$tags"] }, 20, 0] },
          { $multiply: ["$ratings.average", 10] },
          { $cond: [{ $gt: ["$discount", 15] }, 15, 0] }
        ]
      }
    }
  },
  {
    $sort: { bundle_score: -1 }
  },
  {
    $limit: 3
  },
  {
    $project: {
      name: 1,
      category: 1,
      price: 1,
      discount: 1,
      bundle_score: 1,
      recommendation: {
        $switch: {
          branches: [
            { 
              case: { $eq: ["$category", "Electronics"] }, 
              then: "Perfect device for reading 'The Midnight Library'" 
            },
            { 
              case: { $eq: ["$category", "Accessories"] }, 
              then: "Enhance your reading of 'The Midnight Library'" 
            },
            { 
              case: { $eq: ["$category", "Audiobook"] }, 
              then: "Listen to stories like 'The Midnight Library' anywhere" 
            }
          ],
          default: "Complements 'The Midnight Library' perfectly"
        }
      },
      _id: 0
    }
  }
]).pretty()

//Query 5: Format Conversion Analysis
//FInd books available in diffrent formats
db.products.aggregate([
  {
    $group: {
      _id: "$name",
      formats: { $addToSet: "$category" },
      format_count: { $sum: 1 },
      prices: { $push: { format: "$category", price: "$price" } },
      avg_rating: { $avg: "$ratings.average" }
    }
  },
  {
    $match: {
      format_count: { $gt: 1 }
    }
  },
  {
    $project: {
      title: "$_id",
      available_formats: "$formats",
      format_count: 1,
      price_comparison: "$prices",
      avg_rating: 1,
      price_difference: {
        $subtract: [
          { $max: "$prices.price" },
          { $min: "$prices.price" }
        ]
      }
    }
  },
  {
    $sort: { format_count: -1 }
  }
])

// Query 6: Author/Publisher Performance
// Analyze performance by author or publisher across formats
db.products.aggregate([
  {
    $match: {
      $or: [
        { category: "Physical Book" },
        { category: "E-Book" },
        { category: "Audiobook" }
      ]
    }
  },
  {
    $group: {
      _id: "$author",
      total_titles: { $sum: 1 },
      formats: { $addToSet: "$category" },
      avg_rating: { $avg: "$ratings.average" },
      total_ratings: { $sum: "$ratings.count" },
      avg_price: { $avg: "$price" },
      publishers: { $addToSet: "$publisher" }
    }
  },
  {
    $addFields: {
      format_count: { $size: "$formats" },
      popularity_score: {
        $multiply: ["$avg_rating", { $divide: ["$total_ratings", 1000] }]
      }
    }
  },
  {
    $sort: { popularity_score: -1 }
  },
  {
    $limit: 10
  }
])

```

#### Step 3: Aggregation Pipeline (Analytics)

```javascript
// Calculate average price by product type
db.products.aggregate([
  {
    $group: {
      _id: "$type",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgPrice: -1 } }
])

// Find top-rated products
db.products.aggregate([
  { $match: { "ratings.total": { $gte: 100 } } },
  { $sort: { "ratings.average": -1 } },
  { $limit: 5 },
  {
    $project: {
      title: 1,
      type: 1,
      "ratings.average": 1,
      "ratings.total": 1
    }
  }
])
```

#### Step 4: Update Inventory

```javascript
// Process a sale (decrement stock)
db.products.updateOne(
  { sku: "BOOK-001" },
  { $inc: { "stock.warehouse_a": -1 } }
)

// Add customer review
db.products.updateOne(
  { sku: "BOOK-001" },
  {
    $push: {
      reviews: {
        user: "alice_coder",
        rating: 5,
        comment: "Improved my code quality significantly",
        date: new Date()
      }
    },
    $inc: { "ratings.total": 1 }
  }
)
```

#### Step 5: Text Search Setup

```javascript
// Create text index
db.products.createIndex({
  title: "text",
  author: "text",
  categories: "text"
})

// Search products
db.products.find({
  $text: { $search: "programming clean code" }
}).limit(3)
```

---

## 4. Advanced Features

### Indexing for Performance

```javascript
// Single field index
db.products.createIndex({ sku: 1 })

// Compound index
db.products.createIndex({ type: 1, "ratings.average": -1 })

// View all indexes
db.products.getIndexes()
```

### Schema Validation

```javascript
db.createCollection("products_validated", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "title", "price", "type"],
      properties: {
        sku: {
          bsonType: "string",
          pattern: "^[A-Z]+-[0-9]{3}$"
        },
        price: {
          bsonType: "double",
          minimum: 0
        }
      }
    }
  }
})
```

---

## 5. Key Outputs

**After inserting sample books:**
```
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('674...'),
    '1': ObjectId('674...'),
    '2': ObjectId('674...')
  }
}
```

**Find query result:**
```json
{
  "_id": ObjectId("674..."),
  "isbn": "978-1617294136",
  "title": "Designing Data-Intensive Applications",
  "author": "Martin Kleppmann",
  "price": 52.00,
  "categories": ["Databases", "Distributed Systems"],
  "reviews": {
    "average": 4.9,
    "count": 567
  }
}
```

**Aggregation output:**
```json
[
  { "_id": "physical_book", "avgPrice": 47.99, "count": 1 },
  { "_id": "ebook", "avgPrice": 29.99, "count": 1 },
  { "_id": "audiobook", "avgPrice": 24.99, "count": 1 }
]
```

---

## 6. Cleanup and Shutdown

```bash
# Docker cleanup
docker stop mongodb-lab
docker rm mongodb-lab
docker volume rm mongodb_data

# Direct installation
sudo systemctl stop mongod
```

---

## Key Takeaways

**Schema Flexibility:** Documents can have varying structures without migrations  
**Nested Data:** Store related information together (reviews inside products)  
**Rich Queries:** Support for complex filtering, sorting, and aggregation  
**Horizontal Scalability:** Easy sharding for growing datasets  
**Use Cases:** Content management, catalogs, user profiles, IoT data

---

## Additional Resources

- [MongoDB Official Documentation](https://www.mongodb.com/docs/manual/)
- [MongoDB University](https://learn.mongodb.com/) - Free courses
- [Mongo Shell Commands Reference](https://www.mongodb.com/docs/manual/reference/mongo-shell/)

---

**Lab Guide Version:** 1.0  
**Last Updated:** December 2025  
**Tested On:** MongoDB 8.0.3, Docker 24.0.7