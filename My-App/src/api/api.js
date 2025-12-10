import axios from "axios";

export const api = axios.create({
  baseURL: "https://pdfmanager-yt5c.onrender.com",
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
});
