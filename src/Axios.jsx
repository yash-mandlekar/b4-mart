import axios from "axios";
const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `https://b4-mart-api.onrender.com/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default Axios;
