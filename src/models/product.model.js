// Product model schema
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            index: true, // Index for faster category filtering
            lowercase: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        rating: {
            rate: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
            count: {
                type: Number,
                min: 0,
                default: 0,
            },
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Index for text search on title and description
productSchema.index({ title: "text", description: "text" });

// Virtual for formatted price
productSchema.virtual("formattedPrice").get(function () {
    return `$${this.price.toFixed(2)}`;
});

// Method to check if product is available
productSchema.methods.isAvailable = function () {
    return this.inStock && this.price > 0;
};

const Product = mongoose.model("Product", productSchema);

export default Product;
