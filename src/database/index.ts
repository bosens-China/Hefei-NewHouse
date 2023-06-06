import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type Proxy } from '../utils/proxyPool';
import { type Props as ListProps } from '../reptile/list/list';
import { type Props as DetailsProps } from '../reptile/list/listDetails';

export type List = ListProps & DetailsProps;

interface Data {
  list?: Array<List | null>;
  preSale?: number;
  proxy?: Proxy;
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'db.json');

const defaultData: Data = {};
const adapter = new JSONFileSync<Data>(file);
export const db = new LowSync<Data>(adapter, defaultData);
