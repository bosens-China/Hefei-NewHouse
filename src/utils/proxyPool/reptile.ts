import { load } from 'cheerio';

export const getTotal = (html: string) => {
  const $ = load(html);
  const total = $('.green-black em').text();
  return Number(total.trim());
};
