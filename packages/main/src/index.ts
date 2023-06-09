import { config } from 'dotenv';
import { notice } from './notice';
import { loadingList } from './loading/list';
import { loadingPreSale } from './loading/preSale';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/zh-cn';

config();
config({ path: '.env.local' });

dayjs.extend(isSameOrBefore);
dayjs.locale('zh-cn');

const App = async () => {
  console.time('爬取预售结束');
  const resultPreSale = (await loadingPreSale()) ?? [];
  console.timeEnd('爬取预售结束');
  console.time(`爬取列表结束`);
  const { current: resultList, residue: residueList } = (await loadingList()) ?? [];
  console.timeEnd('爬取列表结束');
  console.time(`发送通知`);
  await notice({
    resultList,
    resultPreSale,
    residueList,
  });
  console.timeEnd('发送通知');

  process.exit(0);
};

console.log(`当前时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
App().catch((e) => {
  throw e;
});
