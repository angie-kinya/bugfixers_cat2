// This file inserts products into the bookstore database

use bookstore;

// Clear existing data (optional)
db.products.drop();

db.products.insertMany([
    {
        product_id: "BK-001",
        name: "The Midnight Library",
        category: "Physical Book",
        subcategory: "Fiction",
        type: "Paperback",
        price: 14.99,
        discount: 10,
        stock_quantity: 45,
        author: "Matt Haig",
        publisher: "Penguin",
        isbn: "9780525559474",
        specifications: {
        pages: 304,
        language: "English",
        dimensions: "5.5 x 0.77 x 8.25 inches",
        weight: "0.6 lbs",
        publication_date: "2020-09-29"
        },
        tags: ["fiction", "contemporary", "bestseller"],
        ratings: {
        average: 4.5,
        count: 12345,
        reviews: [
            { user: "Reader123", rating: 5, comment: "Life-changing!" },
            { user: "BookWorm", rating: 4, comment: "Beautiful story" }
        ]
        },
        shipping: {
        weight: "0.7 lbs",
        dimensions: "8.5 x 5.5 x 0.8 in",
        fragile: false
        },
        metadata: {
        created_at: new Date("2023-01-15"),
        last_restocked: new Date("2024-03-01"),
        supplier: "Penguin Distributors"
        }
    },
    {
        product_id: "EBOOK-001",
        name: "Atomic Habits",
        category: "E-Book",
        subcategory: "Self-Help",
        type: "Digital",
        price: 9.99,
        discount: 0,
        stock_quantity: 9995, 
        author: "James Clear",
        publisher: "Avery",
        isbn: "9780735211292",
        specifications: {
        file_format: ["EPUB", "PDF", "MOBI"],
        file_size: "2.5 MB",
        drm_protected: true,
        print_length: 320,
        language: "English"
        },
        digital_assets: {
        sample_pages: 20,
        preview_available: true,
        delivery_method: "instant_download"
        },
        tags: ["self-help", "productivity", "non-fiction"],
        ratings: {
        average: 4.8,
        count: 25678
        },
        metadata: {
        created_at: new Date("2023-03-10"),
        downloads_count: 150230
        }
    },
    {
        product_id: "AUDIO-001",
        name: "Project Hail Mary",
        category: "Audiobook",
        subcategory: "Science Fiction",
        type: "Digital Audio",
        price: 24.99,
        discount: 15,
        stock_quantity: 9999,
        author: "Andy Weir",
        narrator: "Ray Porter",
        publisher: "Audible Studios",
        specifications: {
        duration: "16 hours 10 minutes",
        format: ["MP3", "M4B", "Streaming"],
        unabridged: true,
        language: "English"
        },
        audio_features: {
        sample_available: true,
        sample_duration: "5 minutes",
        bitrate: "128 kbps"
        },
        tags: ["sci-fi", "space", "audiobook", "bestseller"],
        ratings: {
        average: 4.9,
        count: 34567
        },
        metadata: {
        created_at: new Date("2023-05-20"),
        streaming_available: true
        }
    },
  
    {
        product_id: "ELEC-001",
        name: "Amazon Kindle Paperwhite",
        category: "Electronics",
        subcategory: "E-Reader",
        type: "Device",
        price: 139.99,
        discount: 20,
        stock_quantity: 28,
        brand: "Amazon",
        specifications: {
        display: "6.8-inch glare-free",
        resolution: "300 ppi",
        storage: "8 GB",
        battery_life: "10 weeks",
        connectivity: ["Wi-Fi", "Bluetooth"],
        water_resistant: "IPX8",
        weight: "7.3 oz"
        },
        features: [
        "Adjustable warm light",
        "32 LED front light",
        "Audible support",
        "Months of battery"
        ],
        compatibility: {
        formats: ["EPUB", "PDF", "MOBI", "AZW"],
        audible: true,
        kindle_unlimited: true
        },
        tags: ["e-reader", "amazon", "electronics", "reading"],
        ratings: {
        average: 4.7,
        count: 8923
        },
        shipping: {
        weight: "1.2 lbs",
        dimensions: "6.9 x 4.9 x 0.3 in",
        fragile: true,
        requires_battery: true
        },
        warranty: {
        duration: "1 year",
        type: "manufacturer"
        },
        metadata: {
        created_at: new Date("2024-01-15"),
        last_price_update: new Date("2024-12-01")
        }
    },
    
    {
        product_id: "ACC-001",
        name: "Flexible LED Book Light",
        category: "Accessories",
        subcategory: "Reading Light",
        type: "Accessory",
        price: 19.99,
        discount: 25,
        stock_quantity: 156,
        brand: "Vekkia",
        specifications: {
        light_type: "LED",
        color_temperature: "4000K",
        brightness_levels: 3,
        power_source: "USB rechargeable",
        battery_life: "80 hours",
        cord_length: "15 inches"
        },
        features: [
        "Clip-on design",
        "Adjustable gooseneck",
        "Memory function",
        "Portable"
        ],
        tags: ["accessory", "light", "reading", "gadget"],
        ratings: {
        average: 4.4,
        count: 4567
        },
        shipping: {
        weight: "0.3 lbs",
        dimensions: "8 x 4 x 2 in",
        fragile: false
        },
        metadata: {
        created_at: new Date("2023-11-30"),
        bestseller: true
        }
    },
    {
        product_id: "BK-LOW-001",
        name: "Limited Edition Poetry Book",
        category: "Physical Book",
        price: 29.99,
        stock_quantity: 8,
        ratings: {
            average: 4.9,
            count: 230
        },
        metadata: {
            created_at: new Date()
        }
    },
    {
        product_id: "BK-MULTI-001",
        name: "The Hobbit",
        category: "Physical Book",
        price: 19.99,
        author: "J.R.R. Tolkien",
        ratings: { average: 4.8, count: 8900 },
        format_note: "Physical Paperback"
    },
    {
        product_id: "EBOOK-MULTI-001", 
        name: "The Hobbit",
        category: "E-Book",
        price: 9.99,
        author: "J.R.R. Tolkien",
        ratings: { average: 4.7, count: 4500 },
        format_note: "Digital Download"
    },
    {
        product_id: "AUDIO-MULTI-001",
        name: "The Hobbit",
        category: "Audiobook",
        price: 14.99,
        author: "J.R.R. Tolkien",
        narrator: "Rob Inglis",
        ratings: { average: 4.9, count: 6700 },
        format_note: "Audio Streaming"
    },
    {
        product_id: "BK-MULTI-002",
        name: "Dune",
        category: "Physical Book",
        price: 24.99,
        author: "Frank Herbert",
        ratings: { average: 4.7, count: 12500 }
    },
    
    {
        product_id: "AUDIO-MULTI-002",
        name: "Dune",
        category: "Audiobook", 
        price: 19.99,
        author: "Frank Herbert",
        ratings: { average: 4.8, count: 8900 }
    }

]);

print("Successfully inserted " + db.products.countDocuments() + " total products");
print("New products added: Audiobook, E-Reader, and Reading Accessory");