# 南川微信机器人服务

## intro

本项目提供基于微信平台的机器人服务，目前已实现：

- [x] 新冠疫情数据查询
- [ ] ……

## environment token

综合考虑，基于`wechaty`框架，使用`padlocal`协议，你需要自己申请一个token，然后仿照`.env.sample`写在`.env`里。

## pre-run (Ubuntu as an example)

1. install `yarn`

```shell
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y
```

2. init project

```shell
yarn
```

3. install `ts-node`

```shell
# install node with the latest version (>=12 necessary)
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs

# install npm
sudo apt install npm

# install ts-node
npm i -g ts-node
```

### run

```shell
ts-node src/wechaty/bot.ts
```

## service: 新冠疫情查询

- 数据源：https://news.qq.com/zt2020/page/feiyan.htm#/area?adcode=530600
- 数据主要接口：https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=diseaseh5Shelf
