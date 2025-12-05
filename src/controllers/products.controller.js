// Products controller
import {
    fetchProducts,
    fetchProductById,
    filterProducts
} from "../services/products.service.js";

export const listProducts = async (req, res) => {
    try {
        let products;

        // If there are query parameters, use filterProducts
        if (Object.keys(req.query).length > 0) {
            products = await filterProducts(req.query);
        } else {
            // Otherwise fetch all products
            products = await fetchProducts();
        }

        res.json({
            count: products.length,
            products,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await fetchProductById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(404).json({ error: "Product not found" });
    }
};
