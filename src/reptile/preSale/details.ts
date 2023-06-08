// 获取详情信息
import { instance } from '../../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../../constant';

function nscaler(a: string) {
  let b = '';
  const ar = String(a).split('');
  ar.forEach((e) => {
    switch (e) {
      case '0':
        b += '0';
        break;
      case '1':
        b += '2';
        break;
      case '2':
        b += '5';
        break;
      case '3':
        b += '8';
        break;
      case '4':
        b += '6';
        break;
      case '5':
        b += '1';
        break;
      case '6':
        b += '3';
        break;
      case '7':
        b += '4';
        break;
      case '8':
        b += '9';
        break;
      case '9':
        b += '7';
        break;
    }
  });

  return b;
}

function SetObjNum(n: number) {
  let a = '';
  for (let i = 0; i < n; i++) {
    a += `${Math.floor(Math.random() * 10)}`;
  }
  return a;
}

export interface RecodeProps {
  id: string;
  iptstamp: string;
}

function recode({ id, iptstamp }: RecodeProps) {
  let n = nscaler(id);
  const c = SetObjNum(String(id).length);
  const d = SetObjNum(String(id).length);
  n = `${parseInt(n) + parseInt(d)}`;
  let b = iptstamp;
  b = nscaler(b.toString());
  return c + '-' + n + '-' + d + '-' + b;
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
}
let developer: string;
let propertyManagementCompany: string;
let floorArea: string;
let mainSet: string;
let greeningRate: string;
let floorAreaRatio: string;
let numberOfHandChanges: string;
let turnoverRate: string;
let region: string;
let projectAddress: string;

const analysis = (html: string, detailsUrl: string): preSaleDetailsProps => {
  const $ = load(html, null, false);
  $('.lbox dd').each((i, el) => {
    // 只要文本节点
    const value = $(el.children.filter((f) => f.nodeType === 3))
      .text()
      .trim();
    switch (i) {
      case 0:
        developer = value;
        break;
      case 1:
        propertyManagementCompany = value;
        break;
      case 2:
        floorArea = value;
        break;
      case 3:
        mainSet = value;
        break;
      case 4:
        greeningRate = value;
        break;
      case 5:
        floorAreaRatio = value;
        break;
      case 6:
        numberOfHandChanges = value;
        break;
      case 7:
        turnoverRate = value;
        break;
      case 8:
        region = value;
        break;
      case 9:
        projectAddress = value;
        break;
    }
  });
  return {
    developer,
    propertyManagementCompany,
    floorArea,
    mainSet,
    greeningRate,
    floorAreaRatio,
    numberOfHandChanges,
    turnoverRate,
    region,
    projectAddress,
    detailsUrl,
  };
};

export const preSaleDetails = async (props: RecodeProps) => {
  const href = `${BASE_URL}/spf/item/${recode(props)}`;
  const { data: html } = await instance.get<string>(href);
  return analysis(html, href);
};