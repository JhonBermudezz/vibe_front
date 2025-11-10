import axios from "axios";

const { VITE_API_BASE_URL } = import.meta.env;

if (!VITE_API_BASE_URL) {
    throw new Error(
        "VITE_API_BASE_URL no está definido. Configura la variable en tu archivo .env."
    );
}

const apiClient = axios.create({
    baseURL: VITE_API_BASE_URL,
});

export { VITE_API_BASE_URL as API_BASE_URL };
export default apiClient;
