import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err.response?.data?.error ||
      (err.code === "ECONNABORTED" ? "Request timed out" : "Network error — is the backend running?");
    return Promise.reject(new Error(msg));
  }
);

export const pincodeApi = {
  
  getPincodes: (params = {}) => api.get("/pincodes", { params }),

  
  getPincode: (pin) => api.get(`/pincode/${pin}`),

  
  searchByArea: (q) => api.get("/search/area", { params: { q } }),

 
  getZones: () => api.get("/zones"),

  
  getStats: () => api.get("/stats"),

  
  health: () => api.get("/health"),
};
