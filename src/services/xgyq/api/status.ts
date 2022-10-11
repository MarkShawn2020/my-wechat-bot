import fs from "fs";
import axios from "axios"

import {IXgyqRes} from "../ds/diseaseh5Shelf";
import {dumpXgyqAreaItem} from "../utils";
import {XGYQ_STATUS_FP, XGYQ_STATUS_VALID_MS, XGYQ_MODULES_URL} from "../config";
import {ensurePlace, OK} from "./general";


let xgyqData_: IXgyqRes | undefined = undefined

/**
 * init xgyq data from local
 */
if (fs.existsSync(XGYQ_STATUS_FP) && (+new Date() - +fs.statSync(XGYQ_STATUS_FP).mtime < XGYQ_STATUS_VALID_MS)) {
  xgyqData_ = JSON.parse(fs.readFileSync(XGYQ_STATUS_FP, {encoding: "utf-8"}))
}

export const fetchXgyqStatus = async (): Promise<IXgyqRes> => {
  if (!xgyqData_) {
    const res = await axios.get(`${XGYQ_MODULES_URL}?modules=diseaseh5Shelf`)
    xgyqData_ = res.data as IXgyqRes
    fs.writeFile(XGYQ_STATUS_FP, JSON.stringify(xgyqData_, null, 2), (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`dumped xgyq data into file://${XGYQ_STATUS_FP}`)
      }
    })
  }
  return xgyqData_
}


export const checkXgyqStatus = async (props: { key: string }): Promise<string> => {
  const place = ensurePlace(props.key)
  if (place.status !== OK) return place.msg

  const data = (await fetchXgyqStatus()).data.diseaseh5Shelf.areaTree[0].children
  // console.log(data)

  const placeName = place.msg
  for (let province of data) {
    if (province.name.includes(placeName)) {
      return [`${placeName}：`, ...dumpXgyqAreaItem(province)].join('\n')
    }
    for (let city of province.children) {
      const fullCityName = province.name + city.name
      if (fullCityName.includes(placeName)) {
        return [`${fullCityName}：`, ...dumpXgyqAreaItem(city)].join('\n')
      }
    }
  }

  return `请确认待查询省份/省份城市是否正确！`
}