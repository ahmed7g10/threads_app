const apiUrl = import.meta.env.VITE_API_URL;
export const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/auth" 
    : "/api";

export default apiUrl;