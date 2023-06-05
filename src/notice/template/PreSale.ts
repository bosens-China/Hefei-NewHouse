import { type Props } from './index';
import { html } from './utils';

export const PreSale = ({ resultPreSale }: Pick<Props, 'resultPreSale'>) => {
  return !resultPreSale.size
    ? ''
    : html`
        <div>
          <h2>本次新增入网楼栋：${resultPreSale.size}个</h2>
          <ul>
            ${Array.from(resultPreSale).map(([name, value]) => {
              return html`
                <li>
                  <p>项目名称：${name}</p>
                  <p>
                    楼幢号：${value.buildingNumber.map((item, index) => {
                      return html`<a href="${value.url[index]}"> ${item} </a>`;
                    })}
                  </p>
                  <!-- <p>
                    许可面积(㎡)：${value.permittedArea.map((item) => {
                    return html`<span class="mr-6">${item}</span>`;
                  })}
                  </p>
                  <p>发放日期：${value.time[0]}</p> -->
                </li>
              `;
            })}
          </ul>
        </div>
      `;
};
