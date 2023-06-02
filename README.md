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
- 等待定时运行

## 环境变量说明

**EMAIL_ACCOUNT**

发送邮箱地址

**EMAIL_AUTHORIZATION_CODE**

发送邮箱授权码

**MAILBOX**

字符串数组对象形式传递，详细参数如下

mailbox
type: `string`
发送的邮箱地址

monitoringArea
type: `Array<string>`
包含的区域，如果存在此参数不会使用 exclusionZone 参数

exclusionZone
type: `Array<string>`
排除的区域

**DOCKERHUB_USERNAME**

Docker 账号

**DOCKERHUB_TOKEN**

Docker 授权码

## 其他

### 更改定时时间

可以在 [node-project-ci.yml](./.github/workflows/node-project-ci.yml) 文件中 修改 cron 内容，注意北京时间跟 UTC 时间相差八小时

## 协议

MIT License
