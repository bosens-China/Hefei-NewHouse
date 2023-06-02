import { config } from 'dotenv';
import { getListResults } from './reptile/list/index.js';
import { getPreSale } from './reptile/preSale.js';
import { NUMBER_OF_COLUMNS, NUMBER_OF_PRE_SALE_COLUMNS } from './constant.js';
import { db } from './database/index.js';
import { notice } from './notice/index.js';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import 'dayjs/locale/zh-cn.js';

config();
config({ path: '.env.local' });

dayjs.extend(isSameOrBefore);
dayjs.locale('zh-cn');

const loadingList = async () => {
  const { values, total } = await getListResults();
  const currentTotal = db.data.list;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_COLUMNS) + 1;
  }
  for (let index = 2; index <= page; index++) {
    const result = await getListResults(index);
    values.push(...result.values);
  }
  db.data.list = total;
  if (currentTotal) {
    return values.slice(0, total - currentTotal);
  }
  return values.filter((f) => {
    return f.registrationStatus !== '登记结束';
  });
};

const loadingPreSale = async () => {
  const { values, total } = await getPreSale();
  const currentTotal = db.data.preSale;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_PRE_SALE_COLUMNS) + 1;
  }

  for (let index = 2; index <= page; index++) {
    const result = await getPreSale(index);
    values.push(...result.values);
  }
  db.data.preSale = total;

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
  db.read();
  console.time('爬取预售结束');
  const resultPreSale = (await loadingPreSale()) ?? [];
  console.timeEnd('爬取预售结束');
  console.time(`爬取列表结束`);
  const resultList = (await loadingList()) ?? [];
  console.timeEnd('爬取列表结束');
  if (!resultList.length && !resultPreSale.length) {
    console.log(`列表未更新，跳过本次爬取`);
    return;
  }

  db.write();
  console.time(`发送通知`);
  await notice({
    resultList,
    resultPreSale,
  });
  console.timeEnd('发送通知');
  process.exit(0);
};

console.log(`当前时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
App().catch((e) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(e);
    return;
  }
  // 生产环境抛出错误，让ci失败，到时候仔细排查问题
  throw e;
});
