import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const apiUrl = import.meta.env.VITE_API_URL;

const Axios: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 1200000,
});

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
