/**
 * use `url.parse('http://localhost:7890')`
 * use tunnel proxy: https://github.com/koichik/node-tunnel#example
 * tls:
 *  - (not work):
 *    - https://github.com/axios/axios/issues/2767
 */

import {load} from 'cheerio' // ref: https://stackoverflow.com/a/72316589/9422455
// @ts-ignore
import TunnelAgent from 'tunnel-agent'
import http from "../../../utils/http";
import https from "https";
import {HttpsProxyAgent} from "https-proxy-agent";


export interface IGetMagnetProps {
  key: string
}

export interface IGetMagnetRes {
  title: string
  count: string // int
  size: string // float
  age: string // datetime
  magnet: string // magnet url
}


/**
 *
 * @param {IGetMagnetProps} props
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchTorrentsViaAxios = async (props: IGetMagnetProps): Promise<IGetMagnetRes> => {
  const targetUrl = `https://btdig.com/search?order=0&q=${encodeURI(props.key)}`

  let httpsAgent;
  if (process.platform === 'darwin') {
    httpsAgent = TunnelAgent.httpsOverHttp({
      maxVersion: "TLSv1.2",
      minVersion: "TLSv1.2",
      proxy: {
        host: 'localhost',
        port: 7890
      }
    })
  } else {
    //  hong kong server, doesn't need vpn
    httpsAgent = new HttpsProxyAgent({
      secureProtocol: 'TLSv1_2_method'
    })
  }

  const res = await http.get(targetUrl, {
    httpsAgent,
    proxy: false
  })
  // console.log(res.data)
  const $ = load(res.data)
  const firstResult = $('.one_result').first()
  const title = $('.torrent_name', firstResult).text()
  const count = $('.torrent_files', firstResult).text()
  const size = $('.torrent_size', firstResult).text()
  const age = $('.torrent_age', firstResult).text()
  const magnet = $('.torrent_magnet a', firstResult).attr('href')!

  const item = {
    title,
    count,
    size,
    age,
    magnet
  }
  console.log(item)
  return item
}

