import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { type Props as ListProps } from '../../reptile/list/list';
import { type Props as DetailsProps } from '../../reptile/list/listDetails';

export type List = ListProps & DetailsProps;

interface CurrentData {
  total: number;
  current: List[];
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'list.json');

const defaultData: CurrentData = {
  total: 0,
  current: [],
};
const adapter = new JSONFileSync<CurrentData>(file);
export const listDb = new LowSync<CurrentData>(adapter, defaultData);
