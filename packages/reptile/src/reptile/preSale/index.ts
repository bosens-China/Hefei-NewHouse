import { PreSaleResult, PreSaleProps, PreSaleValues } from '@new-house/data/preSale';
import { getBase } from './base';
import { preSaleDetails } from './details';
import _ from 'lodash-es';

export const getPreSale = async (page = 1) => {
  const result = await getBase(page);
  return result;
};

// 添加详情
export const consolidationResultPreSale = async (item: PreSaleProps) => {
  return await preSaleDetails(item).then((res) => {
    return {
      ...item,
      ...res,
    };
  });
};
// 作用是把重复名称转化为数组形式
export const mergeArrays = (arr: PreSaleResult[]): PreSaleValues[] => {
  const values = arr.reduce<PreSaleValues[]>((arr, item) => {
    const { entryName, permittedArea, releaseDate, time, licenseKey, buildingNumber } = item;
    let value: PreSaleValues = {
      ...item,
      // url: [],
      buildingNumber: [],
      licenseKey: [],
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
    value.licenseKey.push(licenseKey);
    value.permittedArea.push(permittedArea);
    value.releaseDate.push(releaseDate);
    value.time.push(time);
    value.buildingNumber.push(buildingNumber);
    // 修改一下楼幢名称，因为详情页面返回的是不全的
    value.licenseKeyAll[licenseKey].name = item.buildingNumber;
    return arr;
  }, []);
  // 过滤一下不是本次的楼幢
  values.map((f) => {
    f.licenseKeyAll = _.pick(f.licenseKeyAll, f.licenseKey);
  });
  return values;
};
