import { config } from 'dotenv';
import { getList } from './reptile/list.js';
import { getPreSale } from './reptile/preSale.js';
import { NUMBER_OF_COLUMNS, NUMBER_OF_PRE_SALE_COLUMNS } from './constant.js';
import { db } from './database/index.js';
import { extension } from './utils/base.js';
import { notice } from './notice/index.js';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import 'dayjs/locale/zh-cn.js';

config();
config({ path: '.env.local' });

dayjs.extend(isSameOrBefore);
dayjs.locale('zh-cn');

const loadingList = async () => {
  db.read();
  const { values, total } = await extension(async () => await getList());
  const currentTotal = db.data.list;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_COLUMNS) + 1;
  }
  for (let index = 2; index <= page; index++) {
    const result = await extension(async () => await getList(index));
    values.push(...result.values);
  }
  db.data.list = total;
  db.write();
  if (currentTotal) {
    return values.slice(0, total - currentTotal);
  }

  return values.filter((f) => {
    return f.registrationStatus !== '登记结束';
  });
};

const loadingPreSale = async () => {
  db.read();
  const { values, total } = await extension(async () => await getPreSale());
  const currentTotal = db.data.preSale;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_PRE_SALE_COLUMNS) + 1;
  }

  for (let index = 2; index <= page; index++) {
    const result = await extension(async () => await getPreSale(index));
    values.push(...result.values);
  }
  db.data.preSale = total;
  db.write();
  if (currentTotal) {
    return values.slice(0, total - currentTotal);
  }
  const current = dayjs();
  // 只返回今天和之后的
  return values.filter((f) => {
    return dayjs(current).isSameOrBefore(dayjs(f.releaseDate), 'D');
  });
};

const App = async () => {
  console.time('开始爬取预售');
  const resultPreSale = (await loadingPreSale()) ?? [];
  console.timeEnd('开始爬取预售');
  console.time(`开始爬取列表`);
  const resultList = (await loadingList()) ?? [];
  console.timeEnd('开始爬取列表');
  if (!resultList.length && !resultPreSale.length) {
    console.log(`列表未更新，跳过本次爬取`);
    return;
  }
  console.time(`发送通知`);
  await notice({
    resultList,
    resultPreSale,
  });
  console.timeEnd('发送通知');
  process.exit(0);
};

console.log(`当前时间 : ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
App().catch((e) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(e instanceof Error ? e.message : e);
    return;
  }
  console.error(e);
});
