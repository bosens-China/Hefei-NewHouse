import axios from 'axios';
import { getData } from './proxyPool';
import { proxyDb } from '../database';
import { extension } from './base';

proxyDb.read();

export const instance = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  async function (config) {
    if (!proxyDb.data) {
      proxyDb.data = await getData();
      proxyDb.write();
    }
    await extension(() => {});
    config.proxy = proxyDb.data;

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
    proxyDb.data = false;
    // 如果发生错误，直接包裹起来重新请求
    return await instance(config);
  },
);
