const apiUrl = import.meta.env.MODE === "development" 
? "http://localhost:5000/api/uploads" 
: "/uploads";
export const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/" 
    : "/api";

export default apiUrl;