import { Supply } from './Supply';
import { type Props } from './index';

export const PreSale = ({ resultPreSale }: Pick<Props, 'resultPreSale'>) => {
  return !resultPreSale.length ? (
    <></>
  ) : (
    <>
      <h2>本次新增入网楼栋：{resultPreSale.length}个</h2>
      <ul>
        {resultPreSale.map(({ entryName: name, ...value }) => {
          const { buildingAll, buildingNumber } = value;
          const total = buildingNumber.reduce((x, key) => {
            return x + buildingAll[key].numberOfResidences;
          }, 0);
          return (
            <li>
              <p>
                <a href={value.detailsUrl}>项目名称：{name}</a>
              </p>
              <p>区域：{value.region}</p>
              <p>
                楼幢：
                {buildingNumber.map((item) => {
                  const obj = buildingAll[item];
                  return (
                    <>
                      <a href={obj.url} style={{ color: '#000' }}>
                        {item}
                      </a>
                      <span class="mr-12">
                        地上层数：{obj.numberOfFloorsUpstairs}，地下层数：
                        {obj.numberOfUndergroundFloors}
                      </span>
                    </>
                  );
                })}
              </p>
              <p>总数：{total}</p>
              <p>项目地址：{value.projectAddress}</p>
              <p>发放日期：{value.time[0]}</p>
              <details>
                <summary>展开其他信息</summary>
                {value.developer && <p>开发商：{value.developer}</p>}
                {value.propertyManagementCompany && <p>物业公司：{value.propertyManagementCompany}</p>}
                {value.mainSet && <p>主力套型：{value.mainSet}</p>}
                {value.greeningRate && !value.greeningRate.includes('0%') && <p>绿化率：{value.greeningRate}</p>}
                {value.floorAreaRatio && !value.floorAreaRatio.includes('0%') && <p>容积率：{value.floorAreaRatio}</p>}
                <Supply total={total} region={value.region}></Supply>
                <p>
                  许可面积(㎡)：
                  {value.permittedArea.map((item) => {
                    return <span>{item}(㎡)</span>;
                  })}
                </p>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
};
