// 列表
import { instance } from '../../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../../constant';
import dayjs from 'dayjs';
import { getTotal } from '../../utils/reptile';
import { ListProps } from '@new-house/data/list';

const analysis = (html: string): ListProps[] => {
  const $ = load(html);
  const arr: ListProps[] = [];
  $('tr:not(.table_bg)').each((_i, el) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const obj = {} as ListProps;

    $(el)
      .find('td')
      .each((index, item) => {
        const a = $(item).find('a');
        const value = $(item).text().trim();
        switch (index) {
          case 0:
            obj.id = $(item).find('span').text().trim();
            obj.url = `${BASE_URL}${a.attr('href') ?? ''}`;
            obj.entryName = a.text().trim();
            return;
          // case 1:
          //   obj.building = value.split(',');
          //   return;
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
            obj.start = dayjs(start).format('YYYY-MM-DD HH:mm:ss');
            obj.end = dayjs(end).format('YYYY-MM-DD HH:mm:ss');
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

export const getList = async (page = 1) => {
  const { data: html } = await instance.get<string>(`${BASE_URL}/spf/Scheme?p=${page}&xmmc=&qy=&djzt=`);
  const arr = analysis(html);
  const total = getTotal(html);

  return {
    values: arr,
    total,
  };
};
