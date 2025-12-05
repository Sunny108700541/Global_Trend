// Main application entry point
import express from "express";
import dotenv from "dotenv";
import productsRoute from "./routes/products.routes.js";
import { connectRedis } from "./utils/redis.js";
import { connectDB } from "./utils/db.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
await connectDB();

// connect Redis
await connectRedis();

app.get("/", (req, res) => {
    res.send("E-Commerce API with MongoDB & Redis Cache");
});

// routes
app.use("/products", productsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
