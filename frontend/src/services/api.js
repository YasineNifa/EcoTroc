import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Your Django backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
