// Switch to bookstore database
use bookstore

// Drop existing collections
db.books.drop()
db.products.drop()

print("Setting up bookstore database...")

// Create books collection 
db.books.insertMany([
  {
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
  },
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
  },
  {
    isbn: "978-0596517748",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    publisher: "O'Reilly Media",
    year: 2008,
    price: 29.99,
    categories: ["Programming", "JavaScript"],
    stock: 12,
    reviews: {
      average: 4.5,
      count: 723
    }
  }
])

print("Books collection created with sample data")

// Switch to ecommerce database
use ecommerce

// Drop existing products collection
db.products.drop()

// Create products collection 
db.products.insertMany([
  {
    sku: "BOOK-001",
    type: "physical_book",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    price: 47.99,
    currency: "USD",
    stock: {
      warehouse_a: 12,
      warehouse_b: 8
    },
    dimensions: {
      weight_kg: 0.68,
      pages: 464
    },
    categories: ["Software Engineering", "Programming"],
    ratings: {
      average: 4.6,
      total: 1247,
      distribution: { 5: 856, 4: 298, 3: 67, 2: 18, 1: 8 }
    },
    reviews: [
      {
        user: "john_dev",
        rating: 5,
        comment: "Essential reading for any developer",
        date: ISODate("2024-10-15"),
        helpful_votes: 23
      },
      {
        user: "sarah_eng",
        rating: 4,
        comment: "Great book, some examples feel dated",
        date: ISODate("2024-11-01"),
        helpful_votes: 12
      }
    ],
    created_at: ISODate("2024-01-15"),
    updated_at: ISODate("2024-11-20")
  },
  {
    sku: "EBOOK-002",
    type: "ebook",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    price: 29.99,
    currency: "USD",
    format: "PDF",
    file_size_mb: 12.4,
    drm_protected: true,
    download_limit: 3,
    categories: ["Software Engineering", "Programming"],
    ratings: {
      average: 4.7,
      total: 834
    },
    created_at: ISODate("2024-01-15"),
    updated_at: ISODate("2024-11-20")
  },
  {
    sku: "AUDIO-003",
    type: "audiobook",
    title: "The Phoenix Project",
    author: "Gene Kim",
    narrator: "Julia Whelan",
    price: 24.99,
    currency: "USD",
    duration_minutes: 942,
    format: "MP3",
    bitrate: "128kbps",
    categories: ["DevOps", "Business", "IT Management"],
    ratings: {
      average: 4.8,
      total: 2103
    },
    created_at: ISODate("2024-02-01"),
    updated_at: ISODate("2024-11-22")
  },
  {
    sku: "BOOK-004",
    type: "physical_book",
    title: "Domain-Driven Design",
    author: "Eric Evans",
    isbn: "978-0321125217",
    price: 59.99,
    currency: "USD",
    stock: {
      warehouse_a: 5,
      warehouse_b: 3
    },
    dimensions: {
      weight_kg: 0.91,
      pages: 560
    },
    categories: ["Software Architecture", "Design Patterns"],
    ratings: {
      average: 4.5,
      total: 456
    },
    reviews: [],
    created_at: ISODate("2024-03-10"),
    updated_at: ISODate("2024-11-18")
  }
])

print("Products collection created with sample data")

// Create indexes for better performance
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ type: 1, "ratings.average": -1 })
db.products.createIndex({ 
  title: "text", 
  author: "text", 
  categories: "text" 
})

print("Indexes created successfully")

// Display collection stats
print("\n=== Database Setup Complete ===")
print("Bookstore database:")
print("  - Books: " + db.getSiblingDB("bookstore").books.countDocuments() + " documents")
print("\nEcommerce database:")
print("  - Products: " + db.products.countDocuments() + " documents")
print("\nIndexes on products collection:")
db.products.getIndexes().forEach(index => {
  print("  - " + index.name)
})