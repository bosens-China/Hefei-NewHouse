import { getListResults, consolidationResultList } from '../reptile/list';
import { NUMBER_OF_COLUMNS } from '../constant';
import { type List } from '../database/list';
import { listStatus } from '../utils/base';
import { listDb } from '../database';
import _ from 'lodash-es';

// 加载列表
export const loadingList = async () => {
  listDb.read();
  const { values, total } = await getListResults();
  const currentTotal = listDb.data?.total ?? 0;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_COLUMNS) + 1;
  }
  for (let index = 2; index <= page; index++) {
    const result = await getListResults(index);
    values.push(...result.values);
  }
  // 剩余的还没结束的楼盘
  const residue = (_.isArray(listDb.data.current) ? listDb.data.current : [])
    .map((item) => {
      return {
        ...item,
        registrationStatus: listStatus(item),
      };
    })
    .filter((f): f is List => f.registrationStatus !== '登记结束');

  const variableValue = currentTotal
    ? values.slice(0, total - currentTotal)
    : values.filter((f) => f.registrationStatus !== '登记结束');

  const current = await Promise.all(
    variableValue.map(async (item) => {
      return await consolidationResultList(item);
    }),
  );
  // 保存本次数据
  listDb.data = {
    total,
    current: {
      ...current,
      ...residue,
    },
  };

  listDb.write();

  return {
    residue,
    current,
  };
};
