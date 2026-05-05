import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});
