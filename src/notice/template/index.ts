import { type Props as PropsList } from '../../reptile/list/list';
import { type Props as PropsDetails } from '../../reptile/list/listDetails';
import { type Values } from '../../reptile/preSale';
import { List } from './List';
import { PreSale } from './PreSale';
import { html } from './utils';
import { load } from 'cheerio';

export type ResultPreSale = Values & { time: string[] };
export type ResultList = PropsList & {
  start: string;
  end: string;
} & PropsDetails;

export interface Props {
  resultPreSale: Map<string, ResultPreSale>;
  resultList: ResultList[];
  currentTime: string;
}

export const getTemplate = (props: Props) => {
  const code = html`<div>
    <${PreSale} resultPreSale=${props.resultPreSale} />
    <${List} resultList=${props.resultList} />
    <p>本次爬取时间：${props.currentTime}</p>

    <style>
      a {
        color: #4d85ff;
        margin-right: 6px;
      }
    </style>
  </div>` as string;
  const $ = load(code, null, false);
  const text = $.text();
  return {
    html: code,
    text,
  };
};
