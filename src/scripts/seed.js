// Database seeding script
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import { seedProducts } from "../data/seed.data.js";
import { connectDB } from "../utils/db.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...");

        // Connect to database
        await connectDB();

        // Clear existing products (optional - comment out to keep existing data)
        const deletedCount = await Product.deleteMany({});
        console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing products`);

        // Insert seed data
        const products = await Product.insertMany(seedProducts);
        console.log(`✅ Successfully inserted ${products.length} products`);

        // Display summary by category
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        console.log("\n📊 Products by Category:");
        categories.forEach((cat) => {
            console.log(
                `   ${cat._id}: ${cat.count} products (avg price: $${cat.avgPrice.toFixed(2)})`
            );
        });

        console.log("\n🎉 Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
