import axios from 'axios';

const ENV = process.env.NODE_ENV;

const api = axios.create({
  baseURL:
    ENV && ENV === 'production'
      ? 'http://167.99.235.241:3333'
      : 'http://192.168.0.2:3333',
});

export default api;
