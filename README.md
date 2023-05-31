# new-house

借用 Github Actions 定时来爬取 [摇号公示 -- 合肥市房产市场信息平台](https://www.hfzfzlw.com/spf/Scheme/) 变更

## 环境变量说明

| 名称                     | 描述                                    |
| ------------------------ | --------------------------------------- |
| EMAIL_ACCOUNT            | 发送邮箱地址                            |
| EMAIL_AUTHORIZATION_CODE | 发送邮箱授权码                          |
| MAILBOX                  | 推送到的邮箱地址，可以使用 `,` 连接多个 |

## 其他

### 更改定时时间

可以在 .github\workflows\node-project-ci.yml 文件中 修改 cron 内容，注意北京时间跟 UTC 时间相差八小时

## 协议

MIT License
