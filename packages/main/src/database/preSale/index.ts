import { LowSync } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type Props } from '../../notice/template';
import { JSONFileSync } from 'lowdb/node';

interface CurrentData {
  current: Props['resultPreSale'];
  total: number;
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'preSale.json');

const defaultData: CurrentData = {
  current: [],
  total: 0,
};
const adapter = new JSONFileSync<CurrentData>(file);
export const preSaleDb = new LowSync<CurrentData>(adapter, defaultData);
