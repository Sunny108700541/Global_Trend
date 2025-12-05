// Redis cache clearing utility
import { redis } from "../utils/redis.js";
import { connectRedis } from "../utils/redis.js";

const clearCache = async () => {
    try {
        await connectRedis();

        // Clear all product-related cache keys
        const keys = await redis.keys("products_*");
        const allProductsKey = await redis.keys("all_products");

        const allKeys = [...keys, ...allProductsKey];

        if (allKeys.length > 0) {
            await redis.del(allKeys);
            console.log(`✅ Cleared ${allKeys.length} cache keys`);
        } else {
            console.log("ℹ️  No cache keys to clear");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error clearing cache:", error.message);
        process.exit(1);
    }
};

clearCache();
