import axios from "axios";


const API = axios.create({
 baseURL: "https://apnacollegeolx-backend.onrender.com",
  withCredentials: true
});



// Add token automatically
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("acolx_user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default API;






