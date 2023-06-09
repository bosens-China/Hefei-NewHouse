import { type ResultPreSale } from '@/notice/template';
import { getBase, type PreSaleResult, type Props } from './base';
import { preSaleDetails } from './details';

export const getPreSale = async (page = 1) => {
  const { values, total } = await getBase(page);

  return {
    values,
    total,
  };
};

// 添加详情
export const consolidationResultPreSale = async (item: Props) => {
  return await preSaleDetails(item).then((res) => {
    return {
      ...item,
      ...res,
    };
  });
};

// 作用是把重复名称转化为数组形式
export const mergeArrays = (arr: PreSaleResult[]): ResultPreSale[] => {
  const values = arr.reduce<ResultPreSale[]>((arr, item) => {
    const { entryName, buildingNumber, permittedArea, releaseDate, time } = item;
    let value: ResultPreSale = {
      ...item,
      // url: [],
      // licenseKey: [],
      buildingNumber: [],
      permittedArea: [],
      releaseDate: [],
      time: [],
    };
    const result = arr.find((f) => f.entryName === entryName);
    if (!result) {
      arr.push(value);
    } else {
      value = result;
    }
    value.buildingNumber.push(buildingNumber);
    value.permittedArea.push(permittedArea);
    value.releaseDate.push(releaseDate);
    value.time.push(time);
    return arr;
  }, []);
  return values;
};
