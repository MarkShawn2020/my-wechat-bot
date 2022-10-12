**# 南川微信机器人服务

## intro

本项目提供基于微信平台的机器人服务，目前已实现：

- [x] 新冠疫情数据查询
- [ ] ……

## environment token

综合考虑，基于`wechaty`框架，使用`padlocal`协议，你需要自己申请一个token，然后仿照`.env.sample`写在`.env`里。

## pre-run (Ubuntu as an example)

### 1. install `yarn`

```shell
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y
```

### 2. install packages for `canvas`

```shell
# otherwise can't `yarn`
# ref: https://stackoverflow.com/a/64567740/9422455
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# otherwise can't draw Chinese
# ref: https://gist.github.com/wohugb/120f59d024e74532b639
sudo apt-get install language-pack-gnome-zh-hans fonts-wqy-microhei
```

### 3. init project

```shell
yarn
```

### 4. install `ts-node`

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

## service: 讲个笑话

- free-api.com
  - desc
    - 这是一个提供众多api的网站（包括笑话），需要token
  - ref
    - home: https://www.free-api.com/
- 讲个笑话API 
  - desc
    - 直接调用api，就能返回纯文字结果（含`\n`），但有点小小低俗
  - ref
    - doc: https://api.lklblog.cn/index/ss?id=1
    - api: https://api.lklblog.cn/api/qwxh.php

## nodejs生成图表框架选型

- chart.js
  - install: `yarn add chart.js chartjs-node-canvas` 
  - pros
  - ref
    - doc: https://www.chartjs.org/docs/latest/charts/line.html
    - how to smooth via `tension`: https://www.appsloveworld.com/chart-js-how-to-make-sharp-lines-to-smooth-curved-lines
- image-charts [x]
  - install: `yarn add image-charts`
  - pros
    - 接口非常简练，较为友好
    - 有较为详细的文档与playground
  - cons
    - 不支持曲线图（不可接受）
  - ref
    - repo: https://github.com/image-charts/javascript
    - doc: https://documentation.image-charts.com/line-charts/
    - playground: https://editor.image-charts.com/
- puppet [x]
  - install: `yarn add puppeteer`
  - pros
    - 基于chromium非常强大
    - 自带了曲线
    - 图像生成效果好、优美
  - cons
    - 需要不断启动与关闭chromium，或者主动维护，以及程序代码不够干净（不可接受）
    - 需要额外安装chromium（~200Mb)
  - ref
    - doc: https://pptr.dev/
    -** 