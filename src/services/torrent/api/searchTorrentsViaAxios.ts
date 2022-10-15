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
import {setClipboard, Status} from "../../clipboard/setClipboard";
import yaml from "js-yaml";


export interface IGetMagnetProps {
  key: string
}

export interface IGetMagnetItem {
  title: string
  count: string // int
  size: string // float
  age: string // datetime
  magnet: string // magnet url
}

export interface IGetMagnetRes {
  status: Status
  input: string
  source: string
  result: IGetMagnetItem[]
}

/**
 *
 * @param {IGetMagnetProps} props
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchTorrentsViaAxios = async (props: IGetMagnetProps): Promise<IGetMagnetRes> => {
  const targetUrl = `https://btdig.com/search?order=0&q=${encodeURI(props.key)}`

  let httpsAgent;
  /**
   * todo: why hk server needs vpn also otherwise 429
   */
  httpsAgent = TunnelAgent.httpsOverHttp({
    maxVersion: "TLSv1.2",
    minVersion: "TLSv1.2",
    proxy: {
      host: 'localhost',
      port: 7890
    }
  })

  const res = await http.get(targetUrl, {
    httpsAgent,
    proxy: false
  })
  const $ = load(res.data)
  const items = Array.from($('.one_result')).map((item) => ({
    title: $('.torrent_name', item).text(),
    count: $('.torrent_files', item).text(),
    size: $('.torrent_size', item).text(),
    age: $('.torrent_age', item).text(),
    magnet: $('.torrent_magnet a', item).attr('href')!,
  }))
  const result = {
    status: Status.OK,
    input: props.key,
    source: targetUrl,
    result: items,
  }
  console.log(result)
  return result
}

