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
          const { licenseKeyAll, licenseKey } = value;
          const total = licenseKey.reduce((x, key) => {
            return x + licenseKeyAll[key].numberOfResidences;
          }, 0);
          return (
            <li>
              <p>
                <a href={value.detailsUrl}>项目名称：{name}</a>
              </p>
              <p>区域：{value.region}</p>
              <>
                <p style={{ marginBottom: '8px' }}>楼幢：</p>
                <ul style={{ paddingTop: 0, paddingBottom: 0 }}>
                  {licenseKey.map((item) => {
                    const obj = licenseKeyAll[item];
                    return (
                      <li>
                        <a href={obj.url} style={{ color: '#000', textDecoration: 'revert' }}>
                          {item}
                        </a>
                        <span class="mr-12">
                          地上层数：{obj.numberOfFloorsUpstairs}，地下层数：
                          {obj.numberOfUndergroundFloors}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
              <p>总数：{total}</p>
              <p>项目地址：{value.projectAddress}</p>

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
                <p>发放日期：{value.time[0]}</p>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
};
