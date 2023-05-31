// 发送邮件
import { type Props as PropsList } from '../reptile/list.js';
import { type Props as PropsPreSale } from '../reptile/preSale.js';
import dayjs from 'dayjs';
import ejs from 'ejs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { load } from 'cheerio';

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, './template.ejs');

const tem = fs.readFileSync(file, 'utf-8');

export const notice = async ({
  resultList,
  resultPreSale,
}: {
  resultList: PropsList[];
  resultPreSale: PropsPreSale[];
}) => {
  const values = {
    resultList: resultList.map((item) => {
      return {
        ...item,
        start: dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
        end: dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
      };
    }),
    resultPreSale: resultPreSale.map((item) => {
      return {
        ...item,
        time: dayjs(item.releaseDate).format('YYYY-MM-DD HH:mm:ss'),
      };
    }),
    currentTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  const html = ejs.render(tem, values);

  const { EMAIL_ACCOUNT, EMAIL_AUTHORIZATION_CODE, MAILBOX } = process.env;
  if (!EMAIL_ACCOUNT || !EMAIL_AUTHORIZATION_CODE || !MAILBOX) {
    console.log(process.env);
    console.log(process.env.secrets);
    console.log((process as any).secrets);

    throw new Error(`EMAIL_ACCOUNT或EMAIL_AUTHORIZATION_CODE或MAILBOX不存在！`);
  }
  const transporter = nodemailer.createTransport({
    service: 'QQ',
    host: 'smtp.qq.email',
    auth: {
      user: EMAIL_ACCOUNT,
      pass: EMAIL_AUTHORIZATION_CODE,
    },
  });

  const $ = load(html, null, false);
  const text = $.text();
  await transporter.sendMail({
    from: `"楼盘小助手 👻" <${EMAIL_ACCOUNT}>`,
    to: MAILBOX,
    subject: '楼盘变动通知',
    text,
    html,
  });
};
