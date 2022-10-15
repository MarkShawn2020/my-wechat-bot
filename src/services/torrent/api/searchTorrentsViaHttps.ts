/**
 * tls:
 *  - (work)
 *    - https://stackoverflow.com/questions/44629256/configure-https-agent-to-allow-only-tls1-2-for-outgoing-requests
 *  - (not work)
 *    - https://github.com/axios/axios/issues/2767
 *    - https://stackoverflow.com/questions/63296828/force-setting-tls-vresion-1-2-when-sending-out-a-request-from-node-js-to-docusig
 *
 */
import https from 'https'
import {HttpsProxyAgent} from "https-proxy-agent";

var options: https.RequestOptions = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
  },
  hostname: 'btdig.com',
  port: 443,
  path: '/search?order=0&q=%E5%8F%98%E5%BD%A2%E9%87%91%E5%88%9A',
  method: 'GET',
  secureProtocol: "TLSv1_2_method",
  agent: new HttpsProxyAgent({
    port: 7890,
    host: 'localhost'
  })
}

https.request(options, res => {
  let body = ''
  res.on('data', d => body += d)
  res.on('end', () => {
    console.log(body)
  })
}).on('error', err => {
  // This gets called if a connection cannot be established.
  console.warn(err)
}).end()