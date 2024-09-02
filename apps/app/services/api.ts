import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/v1"
      : process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to include the token in the headers and verify the token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    const router = useRouter();
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      router.push("/signin"); // Redirect to the Sign In page
    }
    return Promise.reject(error);
  }
);

export { api };
