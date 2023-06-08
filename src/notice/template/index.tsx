import { type Props as PropsList } from '../../reptile/list/list';
import { type Props as PropsDetails } from '../../reptile/list/listDetails';
import { type Values } from '../../reptile/preSale/base';
import { List } from './List';
import { PreSale } from './PreSale';
import { render } from 'preact-render-to-string';
import { load } from 'cheerio';
import style from './style.css';

export type ResultPreSale = Values;
export type ResultList = PropsList & PropsDetails;

export interface Props {
  resultPreSale: Map<string, ResultPreSale>;
  resultList: ResultList[];
  residueList: ResultList[];
  currentTime: string;
}

const App = (props: Props) => {
  return (
    <>
      <PreSale resultPreSale={props.resultPreSale}></PreSale>
      <List resultList={props.resultList}></List>
      <List resultList={props.residueList} title={<h2>其他正在摇号项目（{props.residueList.length}个）：</h2>}></List>
      <p>本次爬取时间：{props.currentTime}</p>
      <style>{style}</style>
    </>
  );
};

export const getTemplate = (props: Props) => {
  const code = render(<App {...props}></App>);
  const $ = load(code, null, false);
  $('style').remove();
  const text = $.text();
  return {
    html: code,
    text,
  };
};
