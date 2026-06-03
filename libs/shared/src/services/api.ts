import axios from 'axios';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Inject headers or log outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    // Inject a mock auth token (representing industry token injection pattern)
    config.headers.Authorization = 'Bearer mock-auth-token-xyz-987';
    
    console.log(`[API Request] ${config.method?.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., Auth failures)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} <- ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.message);
    
    // Globally handle standard HTTP status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized access! Re-routing to login could be triggered here.');
          break;
        case 404:
          console.warn('Endpoint not found!');
          break;
        case 500:
          console.error('Server side database/internal error!');
          break;
      }
    }
    return Promise.reject(error);
  }
);
