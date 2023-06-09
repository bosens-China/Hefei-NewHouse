import axios, { type AxiosProxyConfig } from 'axios';

export const getProxy1 = async (): Promise<AxiosProxyConfig[]> => {
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
    throw new Error(`Proxy1 发生错误`);
  }
};

export const getProxy2 = async (): Promise<AxiosProxyConfig[]> => {
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
    throw new Error(`Proxy2 发生错误`);
  }
};
