import { type Props } from './index';

export const PreSale = ({ resultPreSale }: Pick<Props, 'resultPreSale'>) => {
  return !resultPreSale.size ? (
    <></>
  ) : (
    <>
      <h2>本次新增入网楼栋：{resultPreSale.size}个</h2>
      <ul>
        {Array.from(resultPreSale).map(([name, value]) => {
          return (
            <li>
              <p>
                <a href={value.detailsUrl}>项目名称：{name}</a>
              </p>
              <p>区域：{value.region}</p>
              <p>
                楼幢号：
                {value.buildingNumber.map((item, index) => {
                  return <a href={value.url[index]}> {item} </a>;
                })}
              </p>
              <p>发放日期：{value.time[0]}</p>
              <p>项目地址：{value.projectAddress}</p>
              <details>
                <summary>展开其他信息</summary>
                <p>
                  许可面积(㎡)：
                  {value.permittedArea.map((item) => {
                    return <span class="mr-6">{item}(㎡)</span>;
                  })}
                </p>
                <p>开发商：{value.developer}</p>
                <p>物业公司：{value.propertyManagementCompany}</p>
                <p>主力套型：{value.mainSet}</p>
                <p>绿化率：{value.greeningRate}</p>
                <p>容积率：{value.floorAreaRatio}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
};
