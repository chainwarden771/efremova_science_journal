import axios from 'axios';
import { AUTH_REQUIRED } from '../../shared/consts/statusMessages';

// ======================
// Инициализация
// ======================

export const SERVER_URL = 'http://localhost:3000';

export const POST_SOURCE_URL = `${SERVER_URL}/file_storage/posts`;

export const appInstance = axios.create({
  baseURL: `${SERVER_URL}/api/`,
  timeout: 10000,
  withCredentials: true,
});

// ======================
// Request interceptor
// ======================

appInstance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ======================
// Response interceptor
// ======================

appInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event(AUTH_REQUIRED));
    }

    return Promise.reject(error);
  },
);
