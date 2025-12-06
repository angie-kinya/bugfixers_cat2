# Project Overview
This lab introduces MongoDB's Document Data Model through a hands-on implementation of "Read & Tech Haven" - a modern bookstore selling physical books, e-books, audiobooks, electronics, and accessories.

## Applied Scenario

### Business Problem
Read & Tech Haven is a modern bookstore facing challenges with:

1. **Flexible Product Catalog**: Selling physical books, e-books, audiobooks, electronics, and accessories - each with different attributes
2. **Inventory Management**: Different rules for physical vs digital products
3. **Personalized Recommendations**: Suggesting bundles and cross-sells
4. **Format Analysis**: Understanding which titles perform best in which formats

### Why Document Data Model Solves This
Traditional relational databases struggle with:
- Different schemas for each product type
- Frequently changing product attributes
- Nested data (specifications, reviews, metadata)

MongoDB's Document Model allows:
- Flexible schema for each product type
- Embedded documents for specifications
- Easy addition of new product categories
- Complex queries across heterogeneous data

## Setup Instructions and Lab Components

### 1. **Docker Setup & Installation** 
- MongoDB with Mongo-Express web interface
- Pre-configured authentication and networking

### 2. **Applied Scenario: Read & Tech Haven Bookstore**
- Real-world problem: Mixed product catalog with varying attributes
- Document model advantages for flexible schemas
- Complex business queries demonstrating MongoDB capabilities

### 3. **CRUD Operations**
- Create, Read, Update, Delete operations
- Sample data insertion and manipulation

### 4. **Complex Query Analysis**
- 8 advanced queries with business applications:
  1. Cross-category search
  2. Price analysis by category
  3. Smart inventory management
  4. Customer bundle recommendations
  5. Format conversion analysis
  6. Author/publisher performance
  7. Aggregation pipeline analytics
  8. Full-text search implementation

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Installation
```bash
# Clone repository
git clone <repository-url>
cd bugfixers_cat2

# Start MongoDB container
docker-compose up -d

# Access MongoDB shell
docker exec -it bugfixers_cat2 mongosh -u admin -p password123

# Insert complete product catalog
docker exec -i bugfixers_cat2 mongosh -u admin -p password123 < sample_data/insert-products.js