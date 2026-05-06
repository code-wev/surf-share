import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
  timeout: 10_000,
  withCredentials: true, // Crucial for sending the httpOnly refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401, token might be expired. Try to refresh.
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the failed request WAS the refresh request
      // or if it was a login attempt
      if (originalRequest.url === "/auth/refresh-token" || originalRequest.url === "/auth/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { data } = await apiClient.post("/auth/refresh-token");
        const newAccessToken = data.data.accessToken;

        // Update the default header for future requests
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Also update the failed request and retry it
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        // Since we're not inside a React context here, we can't easily update localStorage
        // But we rely on the `auth.tsx` context picking up the newly set default header,
        // or we could manually update localStorage here as a fallback:
        localStorage.setItem("surf-share-auth-token", newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        localStorage.removeItem("surf-share-auth-session");
        localStorage.removeItem("surf-share-auth-token");
        delete apiClient.defaults.headers.common["Authorization"];
        
        // Only redirect to login if we are in the browser
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

