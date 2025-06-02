import axios from "axios";

const userUrl = import.meta.env.VITE_USER_URL;
const tabUrl = import.meta.env.VITE_TAB_URL;

export const AXIOS_USER = axios.create({
  baseURL: userUrl,
  withCredentials: true,
});
export const AXIOS_TAB = axios.create({
  baseURL: tabUrl,
  withCredentials: true,
});
