import axios from 'axios';
import { getData } from './proxyPool/index.js';
import { db } from '../database/index.js';

export const instance = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  async function (config) {
    if (!db.data.proxy) {
      db.data.proxy = await getData();
    }

    config.proxy = db.data.proxy;

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
    const { config } = error;
    db.data.proxy = await getData();
    // 如果发生错误，直接包裹起来重新请求
    return await instance(config);
  },
);
