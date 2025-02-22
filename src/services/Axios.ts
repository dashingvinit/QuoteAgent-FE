import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance with custom configuration
const Axios: AxiosInstance = axios.create({
  //baseURL: 'https://quiz-backend-zel6.onrender.com/api/v1/', // main server
  baseURL: 'http://localhost:2710/api/v1/', // local server
  timeout: 30000, // 30 seconds timeout, adjust as needed
});

// Configure retry logic
axiosRetry(Axios, {
  retries: 0,
  retryDelay: (retryCount: number) => retryCount * 1000,
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status !== undefined && error.response.status >= 500)
    );
  },
});

export default Axios;
