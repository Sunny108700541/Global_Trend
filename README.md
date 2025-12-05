# E-Commerce API with MongoDB & Redis

This project is an e-commerce API built for the **Global Trend – API Integration Internship Assignment**.

## 🚀 Features

- **Database**: MongoDB for persistent product storage
- **Caching**: Redis for performance optimization
- **RESTful Endpoints**:
  - GET `/products` - List all products
  - GET `/products/:id` - Get single product
- **Advanced Filtering**:
  - Category filtering
  - Text search
  - Price range filtering
- **Seeding**: Preloaded with 25+ sample products
- **Error Handling**: Network errors, timeouts, invalid IDs

---

## 📁 Project Structure

```
ecommerce-api/
│── src/
│   ├── app.js                    # Application entry point
│   ├── routes/
│   │    └── products.routes.js   # Product routes
│   ├── controllers/
│   │    └── products.controller.js
│   ├── services/
│   │    └── products.service.js  # Business logic with caching
│   ├── models/
│   │    └── product.model.js     # MongoDB schema
│   ├── data/
│   │    └── seed.data.js         # Seed products
│   ├── scripts/
│   │    └── seed.js              # Database seeding script
│   ├── utils/
│   │    ├── db.js                # MongoDB connection
│   │    ├── redis.js             # Redis connection
│── .env                          # Environment variables
│── package.json
│── README.md
```

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Sunny108700541/Global_Trend.git
cd ecommerce-api
```

### 2. Install Dependencies
```bash
npm install
```



### 4. Configure Environment Variables

Create/update `.env` file:

```env
# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Redis Cloud
REDIS_URL=redis://your-redis-host:port
REDIS_PASSWORD=your-redis-password

# Server Port
PORT=4000
```

### 5. Seed the Database

Populate the database with sample products:

```bash
npm run seed
```

You should see output like:
```
🌱 Starting database seeding...
✅ Connected to MongoDB
🗑️  Cleared X existing products
✅ Successfully inserted 25 products

📊 Products by Category:
   electronics: 7 products (avg price: $1142.85)
   jewelry: 5 products (avg price: $387.99)
   men's clothing: 6 products (avg price: $93.32)
   women's clothing: 7 products (avg price: $77.85)

🎉 Database seeding completed successfully!
```

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB: localhost
✅ Connected to Cloud Redis
🚀 Server running on http://localhost:4000
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:4000

##0. TO Get 2 product it means limited products
http://localhost:5000/products?limit=2
```

### 1. Get All Products
```http
GET /products
```

**Response:**
```json
{
  "count": 25,
  "products": [...]
}
```

### 2. Get Product by ID
```http
GET /products/:id
```

**Example:**
```bash
curl http://localhost:4000/products/507f1f77bcf86cd799439011
```

### 3. Filter by Category
```http
GET /products?category=electronics
```

**Available categories:**
- electronics
- men's clothing
- women's clothing
- jewelry

### 4. Search Products
```http
GET /products?search=iphone
```

Searches in product title and description.

### 5. Price Range Filter
```http
GET /products?minPrice=50&maxPrice=500
```

### 6. Combined Filters
```http
GET /products?category=electronics&minPrice=100&maxPrice=1000&search=phone
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Get all products
curl http://localhost:4000/products

# Get single product (replace ID)
curl http://localhost:4000/products/YOUR_PRODUCT_ID

# Filter by category
curl http://localhost:4000/products?category=electronics

# Search
curl http://localhost:4000/products?search=jacket

# Price range
curl http://localhost:4000/products?minPrice=50&maxPrice=200
```

### Using Browser
Simply open: `http://localhost:4000/products`

### Using Postman
1. Import endpoints
2. Test various filters and combinations

---

## 🎯 How It Works

### Cache-Aside Pattern

1. **First Request**: 
   - Checks Redis cache → Miss
   - Queries MongoDB
   - Stores result in Redis (10 min TTL)
   - Returns data

2. **Subsequent Requests**:
   - Checks Redis cache → Hit
   - Returns cached data
   - Much faster response

### Database Queries

The service layer uses MongoDB queries with indexes for optimal performance:
- Category index for fast filtering
- Text index for search functionality
- Compound queries for combined filters

---

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Redis** - Caching layer
- **Axios** - HTTP client (if needed)
- **Dotenv** - Environment configuration

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server in production mode |
| `npm run dev` | Start server in development mode |
| `npm run seed` | Seed database with sample products |

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error
```
**Solution:**
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify `MONGODB_URI` in `.env`
- For Atlas, check whitelist IP addresses

### Redis Connection Error
```
❌ Redis Error
```
**Solution:**
- Verify Redis credentials in `.env`
- Check Redis service is running
- For cloud Redis, verify URL and password

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:**
- Kill process on port 4000: `npx kill-port 4000`
- Or change `PORT` in `.env`

---

## 📄 License

ISC

---

## 👤 Author

Sunny - Global Trend Internship Assignment

---
