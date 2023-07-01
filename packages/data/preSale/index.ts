import { LowSync } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { JSONFileSync } from 'lowdb/node';

export interface RecodeProps {
  id: string;
  iptstamp: string;
}

export interface PreSaleBuilding {
  url: string;
  // 名称
  name: string;
  // 许可证
  license: string;
  // 楼上层数
  numberOfFloorsUpstairs: string;
  // 地下层数
  numberOfUndergroundFloors: string;
  // 住宅数量
  numberOfResidences: number;
  // 商业数量
  commercialQuantity: number;
  // 办公数量
  numberOfOffices: number;
  // 其他数量
  otherQuantities: number;
}

export interface PreSaleProps extends RecodeProps {
  // url: string;
  // 许可证
  licenseKey: string;
  // 项目名称
  entryName: string;
  // 楼栋号
  buildingNumber: string;
  // 许可证面积
  permittedArea: string;
  // 发放日期
  releaseDate: number;
  time: string;
  // 物业类型
  type: string;
}

export interface preSaleDetailsProps {
  // 开发商
  developer: string;
  // 物业公司;
  propertyManagementCompany: string;
  // 占地面积
  floorArea: string;
  // 主力套型
  mainSet: string;
  // 绿化率
  greeningRate: string;
  // 容积率
  floorAreaRatio: string;
  // 换手次数
  numberOfHandChanges: string;
  // 换手率
  turnoverRate: string;
  // 所属区域
  region: string;
  // 项目地址
  projectAddress: string;
  // 详情地址
  detailsUrl: string;
  // 许可证信息
  licenseKeyAll: Record<string, PreSaleBuilding>;
}

export type PreSaleResult = PreSaleProps & preSaleDetailsProps;

type Arr = 'buildingNumber' | 'licenseKey' | 'permittedArea' | 'releaseDate' | 'time';

export type PreSaleValues = Omit<PreSaleResult, Arr> & {
  [K in keyof Pick<PreSaleResult, Arr>]: Array<PreSaleResult[K]>;
};

// 数据库结构
export interface PreSaleData {
  total?: number;
  // 新增值
  newValueAdded?: PreSaleValues[];
  // 上一次值
  lastValue?: PreSaleValues[];
}

const currentDirname = dirname(fileURLToPath(import.meta.url));
const file = join(currentDirname, 'preSale.json');

const adapter = new JSONFileSync<PreSaleData>(file);
export const preSaleDb = new LowSync<PreSaleData>(adapter, {});
