import axios from "axios";
import { getAuthToken } from "./authToken";

const FALLBACK_API = "https://telehealthwebapplive.cmcludhiana.in/api/v2";

const getBaseURL = () => {
    try {
        if (typeof window !== "undefined" && window.APP_CONFIG) {
            return window.APP_CONFIG.API_BASE_URL;
        }
    } catch (e) { }

    return process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API;
};

const api = axios.create({
    baseURL: FALLBACK_API, // 🔥 IMPORTANT: default fallback
    timeout: 30000,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config: any) => {
    // dynamically override baseURL at runtime
    config.baseURL = getBaseURL();

    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;