// Switch to bookstore database
use bookstore

// Insert single document
db.books.insertOne({
  isbn: "978-0201616224",
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt",
  publisher: "Addison-Wesley",
  year: 1999,
  price: 49.99,
  categories: ["Programming", "Software Development"],
  stock: 20,
  reviews: {
    average: 4.7,
    count: 1523
  }
})

// Insert multiple documents
db.books.insertMany([
  {
    isbn: "978-0132350884",
    title: "Clean Code",
    author: "Robert C. Martin",
    publisher: "Prentice Hall",
    year: 2008,
    price: 47.99,
    categories: ["Programming", "Software Engineering"],
    stock: 25,
    reviews: {
      average: 4.6,
      count: 2341
    }
  },
  {
    isbn: "978-0321573513",
    title: "Algorithms",
    author: "Robert Sedgewick",
    publisher: "Addison-Wesley",
    year: 2011,
    price: 74.99,
    categories: ["Computer Science", "Algorithms"],
    stock: 10,
    reviews: {
      average: 4.8,
      count: 876
    }
  }
])

// Find all documents
db.books.find().pretty()

// Find with specific criteria
db.books.find({ year: { $gte: 2010 } }).pretty()

// Find one document
db.books.findOne({ isbn: "978-0134685991" })

// select specific fields
db.books.find(
  { price: { $lt: 50 } },
  { title: 1, price: 1, author: 1, _id: 0 }
)

// Complex query with multiple conditions
db.books.find({
  $and: [
    { categories: "Programming" },
    { stock: { $gt: 10 } },
    { "reviews.average": { $gte: 4.5 } }
  ]
}).pretty()

// Find books by category
db.books.find({ categories: { $in: ["Programming", "Software Engineering"] } })

// Count documents
db.books.countDocuments({ year: { $gte: 2015 } })

// Update single document: set new price
db.books.updateOne(
  { isbn: "978-0134685991" },
  { $set: { price: 39.99, last_updated: new Date() } }
)

// Increment stock
db.books.updateOne(
  { isbn: "978-0134685991" },
  { $inc: { stock: 5 } }
)

// Update multiple documents: apply discount
db.books.updateMany(
  { publisher: "Addison-Wesley" },
  { 
    $mul: { price: 0.9 },
    $set: { discount_applied: true }
  }
)

// Add element to array
db.books.updateOne(
  { isbn: "978-1617294136" },
  { $push: { categories: "System Design" } }
)

// Remove element from array
db.books.updateOne(
  { isbn: "978-1617294136" },
  { $pull: { categories: "System Design" } }
)

// Update nested field
db.books.updateOne(
  { isbn: "978-0134685991" },
  { 
    $set: { 
      "reviews.average": 4.8,
      "reviews.count": 350
    } 
  }
)

// Delete single document
db.books.deleteOne({ isbn: "978-0596517748" })

// Delete multiple documents
db.books.deleteMany({ stock: 0 })

// Delete documents with condition
db.books.deleteMany({ 
  year: { $lt: 2000 },
  stock: { $lt: 5 }
})


//Scenarios for e-commerce
use ecommerce

// Find all physical books with stock
db.products.find({
  type: "physical_book",
  $expr: {
    $gt: [
      { $add: ["$stock.warehouse_a", "$stock.warehouse_b"] },
      0
    ]
  }
}).pretty()

// Find highly-rated ebooks under $35
db.products.find({
  type: "ebook",
  price: { $lt: 35 },
  "ratings.average": { $gte: 4.5 }
})

// Find products in specific category
db.products.find({
  categories: { $in: ["Programming", "Software Engineering"] }
})

// Calculate average price by product type
db.products.aggregate([
  {
    $group: {
      _id: "$type",
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
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
      author: 1,
      type: 1,
      price: 1,
      "ratings.average": 1,
      "ratings.total": 1,
      _id: 0
    }
  }
])

// Products with most reviews
db.products.aggregate([
  { $match: { reviews: { $exists: true } } },
  {
    $project: {
      title: 1,
      type: 1,
      reviewCount: { $size: "$reviews" },
      "ratings.average": 1
    }
  },
  { $sort: { reviewCount: -1 } }
])

// Revenue potential by category
db.products.aggregate([
  { $unwind: "$categories" },
  {
    $group: {
      _id: "$categories",
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: "$price" },
      totalRevenuePotential: { $sum: "$price" }
    }
  },
  { $sort: { totalRevenuePotential: -1 } }
])

// Process a sale which also decreases the stock
db.products.updateOne(
  { sku: "BOOK-001" },
  { 
    $inc: { 
      "stock.warehouse_a": -1
    },
    $set: {
      updated_at: new Date()
    }
  }
)

// Restock product
db.products.updateOne(
  { sku: "BOOK-004" },
  { 
    $inc: { 
      "stock.warehouse_a": 10,
      "stock.warehouse_b": 5
    }
  }
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
        date: new Date(),
        helpful_votes: 0
      }
    },
    $inc: { "ratings.total": 1 }
  }
)

// Update ratings after new review
db.products.updateOne(
  { sku: "BOOK-001" },
  {
    $set: {
      "ratings.average": 4.65,
      updated_at: new Date()
    }
  }
)

// Apply promotional discount to category
db.products.updateMany(
  { 
    categories: "Programming",
    type: "physical_book"
  },
  {
    $mul: { price: 0.85 },
    $set: { 
      discount_applied: true,
      discount_rate: 0.15,
      updated_at: new Date()
    }
  }
)

// Search for products 
db.products.find({
  $text: { $search: "programming clean code" }
},
{
  score: { $meta: "textScore" }
}).sort({ score: { $meta: "textScore" } })

// Find products with low stock
db.products.find({
  type: "physical_book",
  $expr: {
    $lt: [
      { $add: ["$stock.warehouse_a", "$stock.warehouse_b"] },
      10
    ]
  }
},
{
  sku: 1,
  title: 1,
  stock: 1,
  _id: 0
})


// Find products with reviews containing specific keywords
db.products.find({
  "reviews.comment": /quality|excellent/i
})

// Products by price range
db.products.find({
  price: { $gte: 20, $lte: 50 }
}).sort({ price: 1 })

// Products updated in the last 7 days
db.products.find({
  updated_at: {
    $gte: new Date(new Date().setDate(new Date().getDate() - 7))
  }
})

// Calculate total inventory value
db.products.aggregate([
  { 
    $match: { 
      type: "physical_book",
      stock: { $exists: true }
    } 
  },
  {
    $project: {
      title: 1,
      totalStock: { $add: ["$stock.warehouse_a", "$stock.warehouse_b"] },
      price: 1
    }
  },
  {
    $project: {
      title: 1,
      totalStock: 1,
      price: 1,
      inventoryValue: { $multiply: ["$totalStock", "$price"] }
    }
  },
  {
    $group: {
      _id: null,
      totalValue: { $sum: "$inventoryValue" },
      totalItems: { $sum: "$totalStock" }
    }
  }
])

// Print success message
print("\n✓ All CRUD operations completed successfully!")
print("Use db.books.find() or db.products.find() to view the data")