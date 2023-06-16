import { type JSXInternal } from 'preact/src/jsx';
import { type ResultList } from './index';
import { Supply } from './Supply';

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
                <p>开发商：{item.enterpriseName}</p>
                <p>
                  楼幢：
                  {item.building.map((li) => {
                    return (
                      <a style={{ color: '#000' }} className="mr-12" href={li.url}>
                        {li.name}
                      </a>
                    );
                  })}
                </p>
                <Supply {...item}></Supply>
                <p>开始时间：{item.start}</p>
                <p>结束时间：{item.end}</p>
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