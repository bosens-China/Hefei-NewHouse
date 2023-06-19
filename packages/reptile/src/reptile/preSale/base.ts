// 预售
import { instance } from '../../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../../constant';
import dayjs from 'dayjs';
import { getTotal } from '../../utils/reptile';
import { type PreSaleProps } from '@new-house/data/preSale';

const analysis = (html: string): PreSaleProps[] => {
  const $ = load(html);
  const arr: PreSaleProps[] = [];

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
