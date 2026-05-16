import axios from "axios";

const baseURL = import.meta.env.MODE === "development"
  ? 'http://localhost:8080/api'
  : "https://routinex-v2.onrender.com/api";

const getStoredToken = () => localStorage.getItem("jwt");
const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem("jwt", token);
  }
};

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || originalRequest._retry || status !== 401) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post("/refresh-token");
      const newToken = refreshResponse.data?.token;
      if (newToken) {
        setStoredToken(newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
      }
      onRefreshed(newToken);
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      onRefreshed(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
