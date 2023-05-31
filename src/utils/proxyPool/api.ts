import axios from 'axios';
import { type Proxy } from './index.js';

export const getProxy1 = async (): Promise<Proxy[]> => {
  type Root = Root2[];

  interface Root2 {
    anonymous: string;
    check_count: number;
    fail_count: number;
    https: boolean;
    last_status: boolean;
    last_time: string;
    proxy: string;
    region: string;
    source: string;
  }
  try {
    const { data } = await axios.get<Root>(`http://localhost:5010/all/`);
    return data.map((item) => {
      const [host, port] = item.proxy.split(':') as [string, string];
      return {
        host,
        port: +port,
      };
    });
  } catch {
    console.error(`Proxy1 发生错误`);
    return [];
  }
};

export const getProxy2 = async (): Promise<Proxy[]> => {
  type Root = Array<[string, number, number]>;
  try {
    const { data } = await axios.get<Root>(`http://localhost:8000/?country=%E5%9B%BD%E5%86%85&protocol=0`);
    return data.map(([host, port]) => {
      return {
        host,
        port,
      };
    });
  } catch {
    console.error(`Proxy2 发生错误`);
    return [];
  }
};
