/* eslint-disable @typescript-eslint/no-non-null-assertion */
// 发送邮件

import dayjs from 'dayjs';
import { type Props as TemplateProps, getTemplate } from './template';
import nodemailer from 'nodemailer';
import { allRegion, RegionType } from '@new-house/data/mailbox';
import { verificationObject } from '../utils/base';
import { mailboxDb } from '@new-house/data/mailbox';

export const notice = async ({
  resultList,
  residueList,
  resultPreSale,
}: Pick<TemplateProps, 'resultList' | 'residueList' | 'resultPreSale'>) => {
  const { EMAIL_ACCOUNT, EMAIL_AUTHORIZATION_CODE } = process.env;
  mailboxDb.read();
  const MAILBOX = mailboxDb.data || [];
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
          type: 'array',
          required: true,
        },
      ],
    },
  );

  const allMailboxs = MAILBOX;
  const sentEmails: string[] = [];
  for (const { mailbox, monitoringArea, exclusionZone, deadline, trialDeadline, _superuser } of allMailboxs) {
    // 开发环境下，只测试有 _superuser标识的用户
    if (!process.env.GITHUB_TOKEN && !_superuser) {
      continue;
    }
    // 试用过了或者订阅时间过了，跳过
    if (trialDeadline && !deadline && dayjs().isSameOrAfter(dayjs(trialDeadline), 'm')) {
      continue;
    }
    if (deadline && dayjs().isSameOrAfter(dayjs(deadline), 'm')) {
      continue;
    }
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
          asyncValidator(_rule, value: RegionType[] | undefined, callback) {
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
          asyncValidator(_rule, value: RegionType[] | undefined, callback) {
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

    const values: TemplateProps = {
      residueList,
      resultPreSale,
      currentTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      resultList: resultList.filter((f) => {
        if (monitoringArea?.length) {
          return monitoringArea.includes(f.region as RegionType);
        } else if (exclusionZone?.length) {
          return !exclusionZone.includes(f.region as RegionType);
        } else {
          // 都不存在返回true
          return true;
        }
      }),
      remind: {
        deadline,
        trialDeadline,
      },
    };

    // 说明被过滤了
    if (!values.resultList.length && !values.resultPreSale.length) {
      continue;
    }

    const { html, text } = getTemplate(values);
    const transporter = nodemailer.createTransport({
      service: 'QQ',
      host: 'smtp.qq.email',
      auth: {
        user: EMAIL_ACCOUNT,
        pass: EMAIL_AUTHORIZATION_CODE,
      },
    });

    await transporter.sendMail({
      from: `"楼盘小助手 👻" <${EMAIL_ACCOUNT!}>`,
      to: mailbox,
      subject: '楼盘变动通知',
      text,
      html,
    });
    sentEmails.push(EMAIL_ACCOUNT!);
  }
  console.log(`发送邮箱数量：${sentEmails.length}`);
};
