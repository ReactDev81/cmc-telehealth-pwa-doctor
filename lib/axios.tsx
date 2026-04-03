import axios from "axios";
import { getAuthToken } from "./authToken";

const FALLBACK_API = "https://telehealthwebapplive.cmcludhiana.in/api/v2";

const getBaseURL = () => {
    // Browser
    if (typeof window !== "undefined") {
        return window?.APP_CONFIG?.API_BASE_URL || FALLBACK_API;
    }

    // Server / build
    return process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config: any) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;