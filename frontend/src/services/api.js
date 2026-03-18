import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        console.log("Unauthorized - please login again");

        //clear token
        localStorage.removeItem("token");
        api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        console.log("Unauthorized - please login again");

        // optional: clear token
        localStorage.removeItem("token");

        // optional: redirect to login later
        // window.location.href = "/login";
      }

      if (error.response.status === 403) {
        console.log("Forbidden - no access");
      }
    } else {
      console.log("Network error or server down");
    }

    return Promise.reject(error);
  }
);
      }

      if (error.response.status === 403) {
        console.log("Forbidden - no access");
      }
    } else {
      console.log("Network error or server down");
    }

    return Promise.reject(error);
  }
);

export default api;