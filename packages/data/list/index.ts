import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface ListBuilding {
  url: string;
  name: string;
  permit: string;
}

export interface DetailsProps {
  // 联系电话
  telephone: string[];
  // 售楼部地址
  salesDepartmentAddress: string;
  building: ListBuilding[];
}

export interface ListProps {
  id: string;
  url: string;
  entryName: string;
  // building: string[];
  enterpriseName: string;
  region: string;
  startTime: number;
  endTime: number;
  total: number;
  registrationStatus: string;
  start: string;
  end: string;
}

export type List = ListProps & DetailsProps;

// 数据库结构
export interface ListData {
  total?: number;
  // 新增值
  newValueAdded?: List[];
  // 上一次值
  lastValue?: List[];
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'list.json');

const adapter = new JSONFileSync<ListData>(file);
export const listDb = new LowSync<ListData>(adapter, {});
