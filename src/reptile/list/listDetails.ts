// 列表详情
import { instance } from '../../utils/request';
import { load } from 'cheerio';
import { BASE_URL } from '../../constant';

export interface Building {
  url: string;
  name: string;
  permit: string;
}

export interface Props {
  // 联系电话
  telephone: string[];
  // 售楼部地址
  salesDepartmentAddress: string;
  building: Building[];
}

const analysis = (html: string): Props => {
  const $ = load(html);
  const obj = { building: [] } as unknown as Props;
  $('.lbox dd').each((index, el) => {
    // 是文本节点
    const value = $(el.children.filter((f) => f.nodeType === 3))
      .text()
      .trim();

    switch (index) {
      case 5:
        obj.telephone = value.split(/[^\d-]/);
        break;
      case 6:
        obj.salesDepartmentAddress = value;
    }
  });
  // 解析楼幢
  $('.beihui a').each((_i, el) => {
    const url = `${BASE_URL}${$(el).attr('href') ?? ''}`;
    const span = $(el).find('span').text().trim();
    const [, permit, name] = span.match(/预售许可证号：(.+?)楼幢：(.+?)$/) ?? [];
    obj.building.push({
      url,
      permit,
      name,
    });
  });
  return obj;
};

export const getListDetails = async (url: string) => {
  const { data: html } = await instance.get<string>(url);
  const result = analysis(html);

  return result;
};
