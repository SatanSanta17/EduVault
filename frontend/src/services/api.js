import axios from 'axios';

// Adjust to your localhost path in XAMPP/LAMP
// Default: http://localhost/eduvault/backend/api (port 80)
// If XAMPP uses port 8080, set REACT_APP_API_BASE=http://localhost:8080/eduvault/backend/api
// Or modify this line directly: export const API_BASE = 'http://localhost:8080/eduvault/backend/api';
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/eduvault/backend/api';

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,  // Change to true for session support
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for better error handling
api.interceptors.request.use(
    config => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error messages
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
            console.error('Network Error: Make sure Apache is running in XAMPP and the API URL is correct:', API_BASE);
            error.message = 'Cannot connect to server. Please ensure Apache is running in XAMPP.';
        } else if (error.response) {
            // Ensure error response data is properly parsed
            if (error.response.data && typeof error.response.data === 'string') {
                try {
                    error.response.data = JSON.parse(error.response.data);
                } catch (e) {
                    // If parsing fails, create a structured error object
                    error.response.data = { error: error.response.data || 'An error occurred' };
                }
            }
            // Log the error details for debugging
            console.error(`API Error (${error.response.status}):`, error.response.data);
        }
        return Promise.reject(error);
    }
);

export function buildDownloadUrl(id) {
  return `${API_BASE}/download.php?id=${id}`;
}



