import Schema, { type Rules } from 'async-validator';
import _ from 'lodash-es';
import { type Props as ListProps } from '../reptile/list/list';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const extension = async <T extends (...rest: any[]) => any>(fn: T, time?: number): Promise<ReturnType<T>> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, time ?? randomNumber(4000, 10000));
  });
};

export const stringToObject = <T>(value?: string) => {
  if (!_.isString(value)) {
    return undefined;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

export const verificationObject = async (obj: Record<string, any>, descriptor: Rules) => {
  // eslint-disable-next-line new-cap
  const validator = new Schema(descriptor);
  return await validator
    .validate(obj)
    .then(() => {
      return true;
    })
    .catch(async (e) => {
      const { errors } = e;
      const message = _.get(errors, '[0].message');
      return await Promise.reject(message ? new Error(message) : e);
    });
};

export const listStatus = ({ startTime, endTime }: Pick<ListProps, 'startTime' | 'endTime'>) => {
  if (dayjs().isBetween(startTime, endTime, 's', '[)')) {
    return '正在登记';
  }
  if (dayjs().isBefore(startTime, 's')) {
    return '暂未开始';
  }
  return '登记结束';
};