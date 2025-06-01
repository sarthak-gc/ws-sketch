import axios from "axios";

const userUrl = import.meta.env.VITE_USER_URL;

export const AXIOS_USER = axios.create({
  baseURL: userUrl,
  withCredentials: true,
});
