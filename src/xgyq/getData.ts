import fs from "fs";

import axios from "axios"
import {IXgyqRes} from "./ds";
import {dumpXgyqAreaItem} from "./utils";
import {XGYQ_DATA_FP, XGYQ_DATA_VALID_MS, XGYQ_URL} from "./config";


let xgyqData_: IXgyqRes | undefined = undefined

/**
 * init xgyq data from local
 */
if (fs.existsSync(XGYQ_DATA_FP) && (+new Date() - +fs.statSync(XGYQ_DATA_FP).mtime < XGYQ_DATA_VALID_MS)) {
  xgyqData_ = JSON.parse(fs.readFileSync(XGYQ_DATA_FP, {encoding: "utf-8"}))
}

export const fetchXgyq = async (): Promise<IXgyqRes> => {
  if (!xgyqData_) {
    const res = await axios.get(XGYQ_URL)
    xgyqData_ = res.data as IXgyqRes
    fs.writeFile(XGYQ_DATA_FP, JSON.stringify(xgyqData_, null, 2), (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`dumped xgyq data into file://${XGYQ_DATA_FP}`)
      }
    })
  }
  return xgyqData_
}


export const checkXgyqStatus = async (props: { key: string }): Promise<string> => {
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