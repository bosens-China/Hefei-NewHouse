import axios from 'axios';
import { BASE_URL } from '../../constant.js';
import { getProxy1, getProxy2 } from './api.js';
import * as _ from 'lodash-es';
import { extension } from '../../utils/base.js';

export interface Proxy {
  host: string;
  port: number;
}

// 验证代理是否通过
const test = async (url: string, proxy: Proxy) => {
  const html = await axios.get<string>(url, {
    proxy,
    timeout: 10000,
  });
  if (!_.isString(html)) {
    throw new Error(`返回内容错误`);
  }
  return proxy;
};
// 并发验证
const concurrentVerification = async (arr: Proxy[]) => {
  const url = [
    `${BASE_URL}/spf/Scheme`,
    // `${BASE_URL}/spf/index`,
    // `${BASE_URL}/spf/Permit`,
    // `${BASE_URL}/spf/Bank`,
    `${BASE_URL}/spf/Project`,
  ];

  for (let position = 0; position <= arr.length; position += url.length) {
    const slice = arr.slice(position, position + url.length);
    try {
      const result = await Promise.any(
        url.map(async (item, index) => {
          return await test(item, slice[index]);
        }),
      );
      return result;
    } catch (e) {
      //
    }
    // 暂停等待
    await extension(() => {});
  }
};

const errorArr: Proxy[] = [];

export const getData = async (time?: number): Promise<Proxy> => {
  await extension(() => {}, time ?? 0);
  const arr = (await Promise.all([getProxy1(), getProxy2()])).flat(2);
  // 过滤掉重复的
  const filteringValue = _.uniqWith(arr, (arr1, arr2) => {
    if (_.isEqual(arr1, arr2)) {
      return true;
    }
    return !!errorArr.find((f) => _.isEqual(f, arr1) || _.isEqual(f, arr2));
  });
  console.time(`开始爬取代理地址`);
  const result = await concurrentVerification(filteringValue);
  console.timeEnd(`开始爬取代理地址`);
  if (result) {
    return result;
  }
  // 说明都没通过验证，继续等待1h后进行
  console.log(`爬取失败，等待1h后重试`);
  return await getData(1000 * 60 * 60);
};
