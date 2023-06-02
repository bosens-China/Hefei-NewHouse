// 预售
import { instance } from '../utils/request.js';
import { load } from 'cheerio';
import { BASE_URL } from '../constant.js';
import dayjs from 'dayjs';
import { getTotal } from '../utils/reptile.js';

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
}

const analysis = (html: string): Props[] => {
  const $ = load(html);
  const arr: Props[] = [];
  $('tr:not(.table_bg)').each((i, el) => {
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
        }
      });
    arr.push(obj);
  });
  return arr;
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
