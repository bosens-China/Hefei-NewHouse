// 预售
import { instance } from '../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../constant';
import dayjs from 'dayjs';
import { getTotal } from '../utils/reptile';

export interface Props {
  url: string;
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
}

const analysis = (html: string): Props[] => {
  const $ = load(html);
  const arr: Props[] = [];
  $('tr:not(.table_bg)').each((_i, el) => {
    const obj = {} as unknown as Props;
    $(el)
      .find('td')
      .each((index, item) => {
        const a = $(item).find('a');
        const value = $(item).text().trim();
        switch (index) {
          case 0:
            obj.url = `${BASE_URL}${a.attr('href') ?? ''}`;
            obj.licenseKey = a.text().trim();
            return;
          case 1:
            obj.entryName = value;
            return;
          case 2:
            obj.buildingNumber = value;
            return;
          case 3:
            obj.permittedArea = value;
            return;
          case 4:
            obj.releaseDate = dayjs(value).valueOf();
            obj.time = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        }
      });
    arr.push(obj);
  });
  return arr;
};

export type Values = {
  [K in keyof Omit<Props, 'entryName'>]: Array<Props[K]>;
};
export type MergeValues = Map<string, Values>;

// 作用是把重复名称转化为数组形式
export const mergeArrays = (arr: Props[]) => {
  const values = arr.reduce<MergeValues>((o, item) => {
    const { entryName, url, licenseKey, buildingNumber, permittedArea, releaseDate } = item;
    if (!o.has(entryName)) {
      o.set(entryName, {
        url: [],
        licenseKey: [],
        buildingNumber: [],
        permittedArea: [],
        releaseDate: [],
        time: [],
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = o.get(entryName)!;
    value.url.push(url);
    value.licenseKey.push(licenseKey);
    value.buildingNumber.push(buildingNumber);
    value.permittedArea.push(permittedArea);
    value.releaseDate.push(releaseDate);
    return o;
  }, new Map());
  return values;
};

export const getPreSale = async (page = 1) => {
  const { data: html } = await instance.get<string>(
    `${BASE_URL}/spf/Permit?p=${page}&item=&use=%E4%BD%8F%E5%AE%85&permitno=`,
  );
  const arr = analysis(html);
  const total = getTotal(html);
  return {
    values: arr,
    total,
  };
};
