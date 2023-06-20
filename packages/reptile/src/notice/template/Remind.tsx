import { type Props } from './index';
import dayjs from 'dayjs';

const getRemainder = (time?: string) => {
  if (!time) {
    return 0;
  }
  // 过期时间
  const reminderDistance = dayjs().add(3, 'D');
  // 计算剩余分钟
  const remaining = reminderDistance.diff(dayjs(time));
  // 计算剩余天数
  const remainingDays = Math.ceil(remaining / (24 * 60));
  // 三天内提醒
  return remainingDays > 3 ? 0 : remainingDays;
};

export const Remind = ({ remind: { deadline, trialDeadline } }: Pick<Props, 'remind'>) => {
  const term = getRemainder(deadline);
  const termTrial = getRemainder(trialDeadline);

  if (termTrial > 0) {
    return <p style={{ color: '#ff4d4f' }}>试用即将过期，还剩{termTrial}天</p>;
  }
  if (term > 0) {
    return <p style={{ color: '#ff4d4f' }}>订阅即将过期，还剩{term}天</p>;
  }

  return <></>;
};
