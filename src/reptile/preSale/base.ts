// 预售
import { instance } from '../../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../../constant';
import dayjs from 'dayjs';
import { getTotal } from '../../utils/reptile';
import { type preSaleDetailsProps, type RecodeProps } from './details';

export interface Props extends RecodeProps {
  // url: string;
  // 许可证
  // licenseKey: string;
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

export type PreSaleResult = Props & preSaleDetailsProps;

type Arr = 'buildingNumber' | 'permittedArea' | 'releaseDate' | 'time';

export type Values = Omit<PreSaleResult, Arr> & {
  [K in keyof Pick<PreSaleResult, Arr>]: Array<PreSaleResult[K]>;
};
export type MergeValues = Map<string, Values>;

const analysis = (html: string): Props[] => {
  const $ = load(html);
  const arr: Props[] = [];

  // let url: string;
  // let licenseKey: string;
  let entryName: string;
  let buildingNumber: string;
  let permittedArea: string;
  let releaseDate: number;
  let time: string;
  let type: string;
  let id: string;
  const iptstamp = $('#iptstamp').val() as string;

  $('tr:not(.table_bg)').each((_i, el) => {
    $(el)
      .find('td')
      .each((index, item) => {
        const a = $(item).find('a');
        const value = $(item).text().trim();
        switch (index) {
          case 0:
            // url = `${BASE_URL}${a.attr('href') ?? ''}`;
            // licenseKey = a.text().trim();
            break;
          case 1:
            id = a.attr('id') ?? '';
            entryName = value;
            break;
          case 2:
            buildingNumber = value;
            break;
          case 3:
            permittedArea = value;
            break;
          case 4:
            releaseDate = dayjs(value).valueOf();
            time = dayjs(value).format('YYYY-MM-DD');
            break;
          case 5:
            type = value;
            break;
        }
      });
    arr.push({
      // url,
      // licenseKey,
      entryName,
      buildingNumber,
      permittedArea,
      releaseDate,
      time,
      type,
      id,
      iptstamp,
    });
  });
  return arr;
};

export const getBase = async (page = 1) => {
  const { data: html } = await instance.get<string>(`${BASE_URL}/spf/Permit?p=${page}&item=&use=0&permitno=`);
  const arr = analysis(html).filter((f) => f.type === '住宅');
  const total = getTotal(html);
  return {
    values: arr,
    total,
  };
};
