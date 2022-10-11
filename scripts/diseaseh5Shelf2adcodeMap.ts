import data from './diseaseh5Shelf.json'
import fs from "fs";
import path from "path";
import {SYSTEM_CONFIG_DIR} from "../src/utils/path";

const adcodeMap: Record<string, string> = {}

data.data.diseaseh5Shelf.areaTree[0].children.forEach(province => {
  const provinceName = province.name
  adcodeMap[provinceName] = province.adcode
  province.children.forEach(city => {
    const cityName = city.name
    const cityFullName = provinceName + cityName
    adcodeMap[cityFullName] = city.adcode
  })
})

const fp = path.join(SYSTEM_CONFIG_DIR, 'adcodeMap.json')
fs.writeFileSync(fp, JSON.stringify(adcodeMap, null, 2))
console.log(`dumped into file://${fp}`)
