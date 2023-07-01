import { getPreSale, mergeArrays, consolidationResultPreSale } from '../reptile/preSale';
import { NUMBER_OF_PRE_SALE_COLUMNS } from '../constant';
import dayjs from 'dayjs';
import { preSaleDb } from '@new-house/data/preSale';

// 加载预售
export const loadingPreSale = async () => {
  preSaleDb.read();
  const { values, total } = await getPreSale();
  const { total: currentTotal = 0, newValueAdded = [], lastValue = [] } = preSaleDb.data;
  const lastAllData = [...newValueAdded, ...lastValue];
  const lastSetId = lastAllData.map((f) => f.id);

  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_PRE_SALE_COLUMNS) + 1;
  }

  for (let index = 2; index <= page; index++) {
    const result = await getPreSale(index);
    values.push(...result.values);
  }

  // 只返回今天和之后的
  const result = mergeArrays(
    await Promise.all(
      values
        // 过滤掉已经发送的id
        .filter((f) => !lastSetId.includes(f.id))
        .filter((f) => {
          return dayjs().isSameOrBefore(dayjs(f.releaseDate), 'D');
        })
        .map(async (item) => {
          return await consolidationResultPreSale(item);
        }),
    ),
  );
  preSaleDb.data.total = total;
  preSaleDb.data.lastValue = lastAllData.filter((f) => {
    return f.releaseDate.some((f) => dayjs().isSameOrBefore(dayjs(f), 'D'));
  });
  preSaleDb.data.newValueAdded = result;
  preSaleDb.write();

  return result;
};
