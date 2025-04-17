import axios from "axios";

const BASE_URL = "http://localhost:8000";
const getToken = () => localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getStudentProfile = async () => {
  const response = await api.get("/api/auth/profile/");
  console.log(response);
  return response.data;
};
