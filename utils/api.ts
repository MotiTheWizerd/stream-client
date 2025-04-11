import axios from "axios";
// Remove direct store import that's causing the error
// import { store } from '../store';
// Remove logout import since we're not using Redux dispatch directly
// import { logout } from "../features/auth/userSlice";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage with multiple possible keys
    let token = localStorage.getItem("token"); // This is where your app is storing the token

    // Log token for debugging
    console.log(
      "API Interceptor - Token from localStorage:",
      token ? "Found" : "Not found"
    );

    // If token is not found in localStorage but is available as a component prop
    // the component-specific interceptor will handle it

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "API Interceptor - Setting Authorization header with token from localStorage"
      );
    } else {
      console.log("API Interceptor - No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response, // Return successful responses as-is
  (error) => {
    console.log(
      "API Error Response:",
      error.response?.status,
      error.response?.data
    );

    // Check if error is due to an expired token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if the error is specifically about an expired token
      const isTokenExpired =
        error.response.data?.error === "Access token is invalid or expired" ||
        error.response.data?.error === "Access token is missing or invalid";

      if (isTokenExpired) {
        console.log("Session expired - logging out user");

        // Clear token from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Show a user-friendly notification
        if (typeof window !== "undefined") {
          alert("Your session has expired. Please log in again.");
          // Redirect to login page
          window.location.href = "/login";
        }
      }
    }

    // Return the error for further processing
    return Promise.reject(error);
  }
);

export default api;
