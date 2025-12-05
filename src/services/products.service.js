// Products service - Database version with Redis caching
import Product from "../models/product.model.js";
import { redis } from "../utils/redis.js";

const PRODUCT_CACHE_KEY = "all_products";
const EXPIRE_TIME = 600; // 10 minutes

export const fetchProducts = async () => {
    // Check Redis cache first
    const cachedData = await redis.get(PRODUCT_CACHE_KEY);
    if (cachedData) {
        console.log("⚡ Serving from Redis cache");
        return JSON.parse(cachedData);
    }

    // Fetch from MongoDB
    console.log("🗄️  Fetching from Database...");
    const products = await Product.find({});

    // Store in Redis for future requests
    await redis.setEx(PRODUCT_CACHE_KEY, EXPIRE_TIME, JSON.stringify(products));

    return products;
};

export const fetchProductById = async (id) => {
    const key = `product_${id}`;

    // Check Redis for single product
    const cachedProduct = await redis.get(key);
    if (cachedProduct) {
        console.log("⚡ Serving from Redis cache");
        return JSON.parse(cachedProduct);
    }

    // Fetch from MongoDB
    console.log("🗄️  Fetching from Database...");
    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    // Store in Redis
    await redis.setEx(key, EXPIRE_TIME, JSON.stringify(product));

    return product;
};

// Filtering logic with pagination support
export const filterProducts = async (query) => {
    let filter = {};

    // Category filter
    if (query.category) {
        filter.category = query.category.toLowerCase();
    }

    // Price range filters
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) {
            filter.price.$gte = parseFloat(query.minPrice);
        }
        if (query.maxPrice) {
            filter.price.$lte = parseFloat(query.maxPrice);
        }
    }

    // Text search on title and description
    if (query.search) {
        filter.$or = [
            { title: new RegExp(query.search, "i") },
            { description: new RegExp(query.search, "i") },
        ];
    }

    // Pagination parameters
    const limit = query.limit ? parseInt(query.limit) : null;
    const page = query.page ? parseInt(query.page) : 1;
    const skip = limit ? (page - 1) * limit : 0;

    console.log(`📄 Pagination: limit=${limit}, page=${page}, skip=${skip}`);

    // Create cache key based on filters
    const cacheKey = `products_${JSON.stringify(query)}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log("⚡ Serving filtered results from Redis cache");
        const cachedProducts = JSON.parse(cached);
        console.log(`   Returning ${cachedProducts.length} cached products`);
        return cachedProducts;
    }

    // Query database with filters and pagination
    console.log("🗄️  Fetching filtered products from Database...");
    let dbQuery = Product.find(filter).sort({ createdAt: -1 });

    // Apply pagination if limit is specified
    if (limit) {
        console.log(`   Applying limit: ${limit}, skip: ${skip}`);
        dbQuery = dbQuery.skip(skip).limit(limit);
    }

    const products = await dbQuery;
    console.log(`   Found ${products.length} products from database`);

    // Cache results
    await redis.setEx(cacheKey, EXPIRE_TIME, JSON.stringify(products));

    return products;
};

// New function to create a product
export const createProduct = async (productData) => {
    const product = new Product(productData);
    await product.save();

    // Invalidate cache
    await redis.del(PRODUCT_CACHE_KEY);

    return product;
};

// New function to update a product
export const updateProduct = async (id, updates) => {
    const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new Error("Product not found");
    }

    // Invalidate cache
    await redis.del(PRODUCT_CACHE_KEY);
    await redis.del(`product_${id}`);

    return product;
};

// New function to delete a product
export const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new Error("Product not found");
    }

    // Invalidate cache
    await redis.del(PRODUCT_CACHE_KEY);
    await redis.del(`product_${id}`);

    return product;
};
