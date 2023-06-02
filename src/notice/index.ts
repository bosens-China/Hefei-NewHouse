/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { stringToObject, verificationObject } from '../utils/base.js';

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, './template.ejs');

const tem = fs.readFileSync(file, 'utf-8');

// 所有区域
const allRegion = ['蜀山区', '庐阳区', '包河区', '瑶海区', '高新区', '经济区', '新站区', '政务区', '滨湖区'];

interface Mailbox {
  mailbox: string;
  // 包含
  monitoringArea?: string[];
  // 排除
  exclusionZone?: string[];
}

export const notice = async ({
  resultList,
  resultPreSale,
}: {
  resultList: PropsList[];
  resultPreSale: PropsPreSale[];
}) => {
  const { EMAIL_ACCOUNT, EMAIL_AUTHORIZATION_CODE, MAILBOX } = process.env;

  // 验证
  await verificationObject(
    {
      EMAIL_ACCOUNT,
      EMAIL_AUTHORIZATION_CODE,
      MAILBOX,
    },
    {
      EMAIL_ACCOUNT: {
        type: 'string',
        required: true,
      },
      EMAIL_AUTHORIZATION_CODE: {
        type: 'string',
        required: true,
      },
      MAILBOX: [
        {
          type: 'string',
          required: true,
        },
      ],
    },
  );

  const allMailboxs = stringToObject<Mailbox[]>(MAILBOX)!;

  for (const { mailbox, monitoringArea, exclusionZone } of allMailboxs) {
    // monitoringArea, exclusionZone 相当于白名单和黑名单，以白名单为主如果都存在
    // 验证后续参数正确性
    await verificationObject(
      {
        mailbox,
        monitoringArea,
        exclusionZone,
      },
      {
        mailbox: [
          {
            type: 'string',
            required: true,
          },
        ],
        monitoringArea: {
          type: 'array',
          asyncValidator(rule, value: string[] | undefined, callback) {
            if (!value) {
              callback();
              return;
            }
            const result = value.find((f) => !allRegion.includes(f));
            if (result) {
              callback(new Error(`monitoringArea 传递值错误，${result} 不符合 ${allRegion.join(',')}值之一`));
              return;
            }
            callback();
          },
        },
        exclusionZone: {
          type: 'array',
          asyncValidator(rule, value: string[] | undefined, callback) {
            if (!value) {
              callback();
              return;
            }
            const result = value.find((f) => !allRegion.includes(f));
            if (result) {
              callback(new Error(`exclusionZone 传递值错误，${result} 不符合 ${allRegion.join(',')}值之一`));
              return;
            }
            callback();
          },
        },
      },
    );

    const values = {
      resultPreSale: resultPreSale.map((item) => {
        return {
          ...item,
          time: dayjs(item.releaseDate).format('YYYY-MM-DD HH:mm:ss'),
        };
      }),
      currentTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      resultList: resultList
        .filter((f) => {
          if (monitoringArea?.length) {
            return monitoringArea.includes(f.region);
          } else if (exclusionZone?.length) {
            return !exclusionZone.includes(f.region);
          } else {
            // 都不存在返回true
            return true;
          }
        })
        .map((item) => {
          return {
            ...item,
            start: dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end: dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
          };
        }),
    };

    const html = ejs.render(tem, values);

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
      from: `"楼盘小助手 👻" <${EMAIL_ACCOUNT!}>`,
      to: mailbox,
      subject: '楼盘变动通知',
      text,
      html,
    });
  }
};
