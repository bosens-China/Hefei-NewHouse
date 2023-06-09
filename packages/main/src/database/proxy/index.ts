import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type AxiosRequestConfig } from 'axios';

type CurrentData = AxiosRequestConfig['proxy'];
const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'proxy.json');

const defaultData: CurrentData = false;
const adapter = new JSONFileSync<CurrentData>(file);
export const proxyDb = new LowSync<CurrentData>(adapter, defaultData);
