// API client utility
import axios from "axios";

export const api = axios.create({
    baseURL: "https://fakestoreapi.com",
    timeout: 5000
});

// global error handling
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (!err.response) {
            throw new Error("Network error or API unavailable");
        }
        if (err.code === "ECONNABORTED") {
            throw new Error("Request timeout");
        }
        throw new Error("API request failed");
    }
);
