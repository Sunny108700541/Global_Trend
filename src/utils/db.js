// MongoDB connection utility
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options are now default in Mongoose 6+
            // but included for clarity and backwards compatibility
        });

        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        // Don't exit process, allow app to continue
        // You can uncomment below to exit on connection failure
        // process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
});
