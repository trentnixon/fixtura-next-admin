import axios, { AxiosError } from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_APP_API_BASE_URL, // Base URL for your CMS
  timeout: 5000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    const apiKey = process.env.APP_API_KEY; // Fetch the API key from .env
    if (apiKey) {
      config.headers["Authorization"] = `Bearer ${apiKey}`;
    }
    /*     console.log(
      `[Request] ${config.method?.toUpperCase()} ${config.url}`,
      config
    ); */
    return config;
  },
  error => {
    console.error("[Request Error]", error);
    return Promise.reject(error); // Forward the error
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log(
      `[Response] ${response.status} ${response.config.url}`,
      response.data
    );
    return response; // Forward successful responses
  },
  (error: AxiosError) => {
    // Enhanced Error Logging
    if (error.response) {
      console.error(
        `[Response Error] ${error.response.status} ${error.response.config.url}`,
        {
          data: error.response.data,
          headers: error.response.headers,
        }
      );
    } else if (error.request) {
      console.error("[Request Error] No response received", error.request);
    } else {
      console.error("[Axios Error] Configuration issue", error.message);
    }

    // Throw a standardized error
    return Promise.reject({
      message: error.message,
      ...(error.response && {
        status: error.response.status,
        data: error.response.data,
      }),
    });
  }
);

export default axiosInstance;
