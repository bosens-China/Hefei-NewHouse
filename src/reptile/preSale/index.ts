import { getBase, type MergeValues, type PreSaleResult } from './base';
import { preSaleDetails } from './details';

export const getPreSale = async (page = 1) => {
  const { values, total } = await getBase(page);
  const arr = await Promise.all(
    values.map(async (item) => {
      return await preSaleDetails(item).then((res) => {
        return {
          ...item,
          ...res,
        };
      });
    }),
  );
  return {
    values: arr,
    total,
  };
};

// 作用是把重复名称转化为数组形式
export const mergeArrays = (arr: PreSaleResult[]) => {
  const values = arr.reduce<MergeValues>((o, item) => {
    const { entryName, buildingNumber, permittedArea, releaseDate, time } = item;
    if (!o.has(entryName)) {
      o.set(entryName, {
        ...item,
        // url: [],
        // licenseKey: [],
        buildingNumber: [],
        permittedArea: [],
        releaseDate: [],
        time: [],
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = o.get(entryName)!;
    // value.url.push(url);
    // value.licenseKey.push(licenseKey);
    value.buildingNumber.push(buildingNumber);
    value.permittedArea.push(permittedArea);
    value.releaseDate.push(releaseDate);
    value.time.push(time);
    return o;
  }, new Map());
  return values;
};
