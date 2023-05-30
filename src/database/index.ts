import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

interface Data {
  list?: number;
  preSale?: number;
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'db.json');

const defaultData: Data = {};
const adapter = new JSONFileSync<Data>(file);
export const db = new LowSync<Data>(adapter, defaultData);
