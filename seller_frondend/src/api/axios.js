import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Essential for sending and receiving HTTP-only cookies

});

export default api;