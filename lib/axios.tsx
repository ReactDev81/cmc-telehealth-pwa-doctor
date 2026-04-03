import axios from "axios";
import { getAuthToken } from "./authToken";

declare global {
    interface Window {
        APP_CONFIG: {
            API_BASE_URL: string;
        };
    }
}

const getBaseURL = () => {
    if (typeof window !== "undefined" && window.APP_CONFIG) {
        return window.APP_CONFIG.API_BASE_URL;
    }

    // fallback (important for SSR / safety)
    return "https://telehealthwebapplive.cmcludhiana.in/api/v2";
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