import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type Proxy } from '../utils/proxyPool/index.js';

interface Data {
  list?: number;
  preSale?: number;
  proxy?: Proxy;
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'db.json');

const defaultData: Data = {};
const adapter = new JSONFileSync<Data>(file);
export const db = new LowSync<Data>(adapter, defaultData);
