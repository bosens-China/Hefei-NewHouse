# new-house

借用 Github Actions 定时来爬取 [摇号公示 -- 合肥市房产市场信息平台](https://www.hfzfzlw.com/spf/Scheme/) 变更。

## 工作原理

通过 Github Actions 的免费服务器来定时运行 ci 任务，Github 的服务器在国外对国内网站有墙的限制，所以需要先找到可以使用的代理地址，这里我在 Github 上找到了一些免费的代理池，封装到了 [docker-compose.yml](./docker-compose.yml) 中。

- 通过 Ci ubuntu 系统安装依赖
- 运行 docker-compose
- 运行 start 任务
- 找到可以使用的 proxy
- 爬取资源，发送邮箱

## 使用方式

- Fork 项目
- 把下面环境变量填写到仓库中， Settings => Secrets and variables => Actions => New repository secret
- 修改 [mailbox.json](./packages/data/mailbox/mailbox.json) 文件，按照 [MailboxProps](./packages/data/mailbox/index.ts) 格式填写（注意数组形式保存 JSON）
- 推送代码等待定时运行

## 环境变量说明

注意，所有的环境变量都要通过字符串的形式传递，如果是要求对象等形式，需要使用 `JSON.stringify` 来进行字符串话。

| 名称                     | 类型     | 描述           |
| ------------------------ | -------- | -------------- |
| EMAIL_ACCOUNT            | `string` | 发送邮箱地址   |
| EMAIL_AUTHORIZATION_CODE | `string` | 发送邮箱授权码 |

<!-- **DOCKERHUB_USERNAME**

Docker 账号

**DOCKERHUB_TOKEN**

Docker 授权码 -->

## 待完成

- 对 Github 使用 proxy 失效问题处理；
- 对抛出错误，CI 流程没有异常关闭问题处理；

## 其他

### 更改定时时间

可以在 [node-project-ci.yml](./.github/workflows/node-project-ci.yml) 文件中 修改 cron 内容，注意北京时间跟 UTC 时间相差八小时

## 协议

MIT License
