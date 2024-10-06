const apiUrl = import.meta.env.MODE === "development" 
? "http://localhost:5000/api/uploads" 
: "/uploads";
export const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/auth" 
    : "/api";

export default apiUrl;