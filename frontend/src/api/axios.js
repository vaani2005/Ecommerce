import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const blockedRefreshPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !blockedRefreshPaths.some((path) => originalRequest.url?.includes(path))
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Dispatch custom event to notify app of token invalidation
        window.dispatchEvent(new Event("tokenExpired"));

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    // Ensure error response has consistent format
    if (error.response) {
      // Backend error with response
      error.formattedError = {
        message: error.response.data?.message || error.message,
        fieldErrors: error.response.data?.errors || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      error.formattedError = {
        message: "No response from server. Please check your connection.",
        fieldErrors: {},
        status: 0,
      };
    } else {
      // Error in request setup
      error.formattedError = {
        message: error.message || "An unexpected error occurred",
        fieldErrors: {},
        status: 0,
      };
    }

    return Promise.reject(error);
  },
);

export default api;
