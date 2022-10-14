import {HttpsProxyAgent} from "https-proxy-agent";

const proxyAgent = new HttpsProxyAgent('http://localhost:7890');

const fetch = require('node-fetch');


fetch("https://btdig.com/search?order=0&q=%E5%8F%98%E5%BD%A2%E9%87%91%E5%88%9A", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "Referer": "https://btdig.com/search?q=%E5%A5%BD%E7%8E%A9",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET",
  // "agent": proxyAgent,
}).then((res: any) => {
  console.log(res)
  return res.text()
})