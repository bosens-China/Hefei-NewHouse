import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type AxiosRequestConfig } from 'axios';

export type ProxyData = AxiosRequestConfig['proxy'];
const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'proxy.json');

const defaultData: ProxyData = false;
const adapter = new JSONFileSync<ProxyData>(file);
export const proxyDb = new LowSync<ProxyData>(adapter, defaultData);
