// 列表
import { instance } from '../utils/request.js';
import { load } from 'cheerio';
import { BASE_URL } from '../constant.js';
import dayjs from 'dayjs';

export interface Props {
  url: string;
  entryName: string;
  building: string[];
  enterpriseName: string;
  region: string;
  startTime: number;
  endTime: number;
  total: number;
  registrationStatus: string;
}

const analysis = (html: string): Props[] => {
  const $ = load(html);
  const arr: Props[] = [];
  $('tr:not(.table_bg)').each((i, el) => {
    const obj = { building: [] } as unknown as Props;
    $(el)
      .find('td')
      .each((index, item) => {
        const a = $(item).find('a');
        const value = $(item).text().trim();
        switch (index) {
          case 0:
            obj.url = `${BASE_URL}${a.attr('href') ?? ''}`;
            obj.entryName = a.text().trim();
            return;
          case 1:
            obj.building = value.split(',');
            return;
          case 2:
            obj.enterpriseName = value;
            return;
          case 3:
            obj.region = value;
            return;
          case 4:
            // eslint-disable-next-line no-case-declarations
            const [start, end] = value.split('至').map((f) => dayjs(f.trim()).valueOf()) as [number, number];
            obj.startTime = start;
            obj.endTime = end;
            return;
          case 5:
            obj.total = +value;
            return;
          case 6:
            obj.registrationStatus = value;
        }
      });
    arr.push(obj);
  });
  return arr;
};

const getTotal = (html: string) => {
  const $ = load(html);
  const total = $('.green-black em').text();
  return Number(total.trim());
};

export const getList = async (page = 1) => {
  const { data: html } = await instance.get<string>(`${BASE_URL}/spf/Scheme?p=${page}&xmmc=&qy=&djzt=`);
  const arr = analysis(html);
  return {
    values: arr,
    total: getTotal(html),
  };
};
