import { getPreSale, mergeArrays, consolidationResultPreSale } from '../reptile/preSale';
import { NUMBER_OF_PRE_SALE_COLUMNS } from '../constant';
import dayjs from 'dayjs';
import { preSaleDb } from '@new-house/data/preSale';
import _ from 'lodash-es';

// 加载预售
export const loadingPreSale = async () => {
  preSaleDb.read();
  const { values, total } = await getPreSale();
  const { total: currentTotal = 0, current } = preSaleDb.data;
  let page = 1;
  if (currentTotal) {
    page = Math.ceil((total - currentTotal) / NUMBER_OF_PRE_SALE_COLUMNS) + 1;
  }

  for (let index = 2; index <= page; index++) {
    const result = await getPreSale(index);
    values.push(...result.values);
  }

  // 只返回今天和之后的
  const filteringValue = mergeArrays(
    await Promise.all(
      (currentTotal ? values.slice(0, total - currentTotal) : values)
        .filter((f) => {
          return dayjs().isSameOrBefore(dayjs(f.releaseDate), 'D');
        })
        .map(async (item) => {
          return await consolidationResultPreSale(item);
        }),
    ),
  );
  const realResults = _.uniqBy([...filteringValue, ...current], (item) => {
    return `${item.entryName}${item.buildingNumber.join(',')}`;
  });

  preSaleDb.data.total = total;
  preSaleDb.data.current = realResults;
  preSaleDb.write();
  return currentTotal !== total ? realResults : [];
};
