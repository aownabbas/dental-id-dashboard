import axios from 'axios';

let headers = {};

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers,
});
client.interceptors.request.use(
  async (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = 'Bearer ' + token;
      config.headers.Accept = 'application/json';
      config.headers.ContentType = 'multipart/form-data';
      return config;
    } else {
      config.headers.Accept = 'application/json';
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default client;
