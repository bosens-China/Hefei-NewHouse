import { getListResults, consolidationResultList } from '../reptile/list';
import { NUMBER_OF_COLUMNS } from '../constant';
import { listStatus } from '../utils/base';
import { listDb, type List } from '@new-house/data/list';
import _ from 'lodash-es';

// 加载列表
export const loadingList = async () => {
  listDb.read();
  const { values, total } = await getListResults();
  const { total: currentTotal, newValueAdded = [], lastValue = [] } = listDb.data;
  const lastAllData = [...newValueAdded, ...lastValue];
  const lastSetId = lastAllData.map((f) => f.id);

  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_COLUMNS) + 1;
  }
  for (let index = 2; index <= page; index++) {
    const result = await getListResults(index);
    values.push(...result.values);
  }

  // 过滤掉已经发送过的id
  const residue = values
    .filter((f) => !lastSetId.includes(f.id))
    .filter((f): f is List => f.registrationStatus !== '登记结束');

  const current = await Promise.all(
    residue.map(async (item) => {
      return await consolidationResultList(item);
    }),
  );
  // 保存本次数据
  listDb.data.total = total;
  listDb.data.lastValue = lastAllData
    .map((item) => {
      return {
        ...item,
        registrationStatus: listStatus(item),
      };
    })
    .filter((f): f is List => f.registrationStatus !== '登记结束');

  listDb.data.newValueAdded = current;

  listDb.write();

  return {
    residue: listDb.data.lastValue!,
    current,
  };
};
