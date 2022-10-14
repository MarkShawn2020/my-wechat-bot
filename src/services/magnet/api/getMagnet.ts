import cheerio from 'cheerio'
// import {http} from "../../../utils/http";
import {HttpsProxyAgent} from "https-proxy-agent";
// import * as https from "https";
import axios from "axios";
import {readFileSync, writeFileSync} from "fs";
import path from "path";
import {OUT_DIR} from "../../../utils/path";
import {AxiosError, AxiosResponse} from "axios-https-proxy-fix";


export interface IGetMagnetProps {
  key: string
}


const proxy = {
  host: 'localhost',
  port: 7890,
}

/**
 *
 * @param {IGetMagnetProps} props
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMagnet = async (props: IGetMagnetProps) => {
  // const url = `https://btdig.com/search?order=0&q=${encodeURI(props.key)}`
  const url = 'https://btdig.com/search?order=0&q=%E5%8F%98%E5%BD%A2%E9%87%91%E5%88%9A'
  console.log({
    url,
    env: {
      http_proxy: process.env.http_proxy,
      https_proxy: process.env.https_proxy,
    }
  })

  const res = await axios.get(url, {
    headers: {
      'authority': 'btdig.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'dnt': '1',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      'User-Agent': "curl/7.84.0",
      'Proxy-Connection': 'Keep-Alive',
    },
    // httpAgent: new HttpsProxyAgent({
    //   host: '127.0.0.1',
    //   port: 7890,
    //   rejectUnauthorized: false
    // }),
    httpsAgent: new HttpsProxyAgent({
      protocol: 'socks5',
      host: 'localhost',
      port: 7890,
      cert: readFileSync('/Users/mark/opt/anaconda3/ssl/cacert.pem', 'binary'),
    }),
    proxy: false
    // proxy: {
    //   port: 7890,
    //   host: 'localhost',
    //   protocol: 'https',
    // }

  })
  // const $ = cheerio.load(res.data)
  // const firstResult = $('.one_result').first()
  // const name = firstResult.css('.torrent_name').text()
  return res
}

getMagnet({key: '变形金刚'})
  .catch((e: AxiosError) => {
    console.warn(JSON.stringify(e, null, 2))
    const fp = path.join(OUT_DIR, 'magnet.error.html')
    writeFileSync(fp, e.response?.data)
    console.log(`dumped error-html into file://${fp}`)
  })