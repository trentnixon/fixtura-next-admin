import axios, { AxiosError } from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_APP_API_BASE_URL, // Base URL for your CMS
  timeout: 60000, // Timeout in milliseconds (60 seconds) - increased for slow API responses
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error); // Forward the error
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    /* console.log(
      `[Response] ${response.status} ${response.config.url}`,
      response.data
    ); */
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
      // Handle timeout errors specifically
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error(
          `[Request Timeout] ${error.config?.method?.toUpperCase()} ${
            error.config?.url
          }`,
          {
            timeout: error.config?.timeout,
            message: error.message,
          }
        );
      } else {
        console.error("[Request Error] No response received", error.request);
      }
    } else {
      console.error("[Axios Error] Configuration issue", error.message);
    }

    // Throw a standardized error object
    return Promise.reject({
      message: error.message,
      code: error.code,
      status: error.response?.status || null,
      data: error.response?.data || null,
      isNetworkError: !error.response && !!error.request,
    });
  }
);

export default axiosInstance;
