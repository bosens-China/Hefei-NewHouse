import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 所有区域
export const allRegion = [
  '蜀山区',
  '庐阳区',
  '包河区',
  '瑶海区',
  '高新区',
  '经济区',
  '新站区',
  '政务区',
  '滨湖区',
] as const;
export type RegionType = (typeof allRegion)[number];

export interface MailboxProps {
  mailbox: string;
  // 包含
  monitoringArea?: RegionType[];
  // 排除
  exclusionZone?: RegionType[];
  // 备注
  remarks?: string;
  // 截止日期
  deadline?: string;
  // 试用截止日期
  trialDeadline?: string;
  // 是否超级用户
  _superuser?: boolean;
  // 禁用全部摇号列表展示
  disableAllListDisplays?: boolean;
}

export type MailboxData = Array<MailboxProps>;

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'mailbox.json');

const defaultData: MailboxData = [];
const adapter = new JSONFileSync<MailboxData>(file);
export const mailboxDb = new LowSync<MailboxData>(adapter, defaultData);
