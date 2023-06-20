import { List } from './List';
import { PreSale } from './PreSale';
import { render } from 'preact-render-to-string';
import { load } from 'cheerio';
import style from './style.css';
import { List as ListData } from '@new-house/data/list';
import { PreSaleValues } from '@new-house/data/preSale';
import { MailboxProps } from '@new-house/data/mailbox';
import { Remind } from './Remind';

export interface Props {
  resultPreSale: PreSaleValues[];
  resultList: ListData[];
  residueList: ListData[];
  currentTime: string;
  remind: Pick<MailboxProps, 'deadline' | 'trialDeadline'>;
}

const App = (props: Props) => {
  return (
    <>
      <PreSale resultPreSale={props.resultPreSale}></PreSale>
      <List resultList={props.resultList}></List>
      <List resultList={props.residueList} title={<h2>其他正在摇号项目（{props.residueList.length}个）：</h2>}></List>
      <Remind remind={props.remind}></Remind>
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
