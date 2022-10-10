import path from "path";
import fs from "fs";

import axios from "axios"

import {CACHE_DIR} from "../general/path";
import {IXgyqAreaItem, IXgyqRes} from "./ds";


// todo: localCityNCOVDataList
export const XGYQ_URL = 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=diseaseh5Shelf'

export const XGYQ_DATA_FP = path.join(CACHE_DIR, 'xgyq/data.json')
export const XGYQ_DATA_VALID_MS = 1000 * 60 * 60 // 1 h

let XGYQ_DATA: IXgyqRes | undefined = undefined

/**
 * init xgyq data from local
 */
if (fs.existsSync(XGYQ_DATA_FP) && (+new Date() - +fs.statSync(XGYQ_DATA_FP).mtime < XGYQ_DATA_VALID_MS)) {
  XGYQ_DATA = JSON.parse(fs.readFileSync(XGYQ_DATA_FP, {encoding: "utf-8"}))
}

export const fetchXgyq = async (): Promise<IXgyqRes> => {
  if (!XGYQ_DATA) {
    const res = await axios.get(XGYQ_URL)
    XGYQ_DATA = res.data as IXgyqRes
    fs.writeFile(XGYQ_DATA_FP, JSON.stringify(XGYQ_DATA, null, 2), (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`dumped xgyq data into file://${XGYQ_DATA_FP}`)
      }
    })
  }
  return XGYQ_DATA
}

export interface fetchXgyqByProvinceCityProps {
  key: string
}

const dumpXgyqAreaItem = (item: IXgyqAreaItem): string[] => {
  return [
    `· 更新时间：${item.total.mtime}`,
    `· 总确认：${item.total.confirm}`,
    `· 总死亡：${item.total.dead}`,
    `· 总治愈：${item.total.heal}`,
    `· 新增：${item.today.wzz_add}`,
    `· 新确认：${item.today.confirm}`
  ]
}

export const checkXgyqStatus = async (props: fetchXgyqByProvinceCityProps): Promise<string> => {
  const key = props.key.replace(/[\s-+省市区直辖]/, '').toLowerCase()

  const data = (await fetchXgyq()).data.diseaseh5Shelf.areaTree[0].children
  // console.log(data)

  // todo: china
  if (['中国', '我国', '我们伟大的国', 'china', 'our great china'].includes(key)) {
    return `中国统计正在进行中`
  }

  for (let province of data) {
    if (province.name.includes(key)) {
      return [`省份：${key}`, ...dumpXgyqAreaItem(province)].join('\n')
    }
    for (let city of province.children) {
      if ((province.name + city.name).includes(key)) {
        return [`城市：${key}`, ...dumpXgyqAreaItem(city)].join('\n')
      }
    }
  }

  return `请确认待查询省份/省份城市是否正确！`
}