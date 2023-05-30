import axios from 'axios';

export const instance = axios.create();

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  async function (error) {
    return await Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    return await Promise.reject(error);
  },
);
