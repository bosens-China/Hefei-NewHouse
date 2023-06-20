// 初始化
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/zh-cn';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { config } from 'dotenv';
import isBetween from 'dayjs/plugin/isBetween';

config();
config({ path: '.env.local' });

dayjs.locale('zh-cn');
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
