import axios, { type AxiosProxyConfig } from 'axios';
import { BASE_URL } from '../../constant';
import { getProxy1, getProxy2 } from './api';
import _ from 'lodash-es';
import { extension } from '../../utils/base';
import { getTotal } from '../../utils/reptile';

// 验证代理是否通过
const test = async (url: string, proxy: AxiosProxyConfig) => {
  const { data: html } = await axios.get<string>(url, {
    proxy,
    timeout: 10000,
  });
  if (!_.isString(html) || !getTotal(html)) {
    throw new Error(`返回内容错误:\n${JSON.stringify(html)}`);
  }

  return proxy;
};

const errorArr: AxiosProxyConfig[] = [];
let j = 0;

// 并发验证给定参数是否能通过测试
const concurrentVerification = async (arr: AxiosProxyConfig[]) => {
  const url = [
    `${BASE_URL}/spf/Scheme`,
    `${BASE_URL}/spf/Permit`,
    `${BASE_URL}/spf/Bank`,
    `${BASE_URL}/spf/Project`,
    `${BASE_URL}/spf/Company/3`,
    `${BASE_URL}/spf/Company/4`,
  ];

  for (let position = 0; position <= arr.length; position += url.length) {
    const str = `爬取代理地址第${++j}轮`;
    console.time(str);
    const slice = arr.slice(position, position + url.length);
    try {
      const result = await Promise.any(
        slice.map(async (item, index) => {
          // 给一个递进的过程，防止一瞬间同时请求
          return await extension(async () => await test(url[index], item), (index + 1) * 200);
        }),
      );
      return result;
    } catch (e) {
      errorArr.push(...slice);
      //
    } finally {
      console.timeEnd(str);
      // 暂停等待
      await extension(() => {});
    }
  }
  return undefined;
};

export const getData = async (time?: number): Promise<AxiosProxyConfig> => {
  await extension(() => {}, time ?? 0);
  const arr = (await Promise.all([getProxy1(), getProxy2()])).flat(2);
  // 过滤掉重复的
  const filteringValue = _.uniqWith(arr, (arr1, arr2) => {
    if (_.isEqual(arr1, arr2)) {
      return true;
    }
    return !!errorArr.find((f) => _.isEqual(f, arr1) || _.isEqual(f, arr2));
  });

  if (!filteringValue.length) {
    throw new Error(`爬取运行错误，当前爬取列表数量为0`);
  }

  const result = await concurrentVerification(filteringValue);

  if (result) {
    return result;
  }
  // 说明都没通过验证，继续等待1h后进行
  console.log(`爬取失败，等待1h后重试`);
  errorArr.length = 0;
  return await getData(1000 * 60 * 60);
};
