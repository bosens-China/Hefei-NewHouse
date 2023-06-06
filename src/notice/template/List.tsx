import { type JSXInternal } from 'preact/src/jsx';
import { type ResultList } from './index';

interface Props {
  resultList: ResultList[];
  title?: JSXInternal.Element;
}

export const List = ({ resultList, title = <h2>本次新增摇号项目：{resultList.length}个</h2> }: Props) => {
  if (!resultList.length) {
    return <></>;
  }
  return (
    <>
      {title}
      <ul>
        {resultList.map((item) => {
          return (
            <li>
              <p>
                <a href={item.url}> 项目名称：{item.entryName} </a>
              </p>
              <p>
                区域：<span class="region">{item.region}</span>
              </p>
              <p>总数：{item.total}</p>
              <p>登记状态：{item.registrationStatus}</p>

              <details>
                <summary>展开其他信息</summary>
                <p>企业名称：{item.enterpriseName}</p>
                <p>
                  楼幢：
                  {item.building.map((li) => {
                    return <a href={li.url}>{li.name}</a>;
                  })}
                </p>
                <p>刚需供应数：{Math.ceil(item.total * 0.3)}</p>
                {['高新区', '经济区'].includes(item.region) ? (
                  <p>职住平衡供应数：{Math.ceil(item.total * 0.5)}</p>
                ) : null}
                <p>登记开始时间：{item.start}</p>
                <p>登记结束时间：{item.end}</p>
                <p>
                  联系电话：
                  {item.telephone.map((phone) => {
                    return <a href={`tel:+${phone}`}>{phone}</a>;
                  })}
                </p>
                <p>售楼部地址：{item.salesDepartmentAddress}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
};
