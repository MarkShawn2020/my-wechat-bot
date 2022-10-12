import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import {USER_CONFIG_DIR} from "../utils/path";
import {ISubscribeFromKey, IWechatyConfig} from "./ds/config";
import {getSimplePinyin} from "../utils/pinyin";
import {logger} from "../utils/log";

export const wechatyConfig = yaml.load(fs.readFileSync(path.join(USER_CONFIG_DIR, 'wechaty.yaml'), 'utf-8')) as unknown as IWechatyConfig
export const BOT_NAME = wechatyConfig.name
export const FULL_BOT_NAME = `${BOT_NAME}V${wechatyConfig.version}`

export const {subscribes} = wechatyConfig.menu
export const subscribeMap = subscribes.reduce((result: Record<string, ISubscribeFromKey>, subscribe) => {
  subscribe.keys.forEach(key => {
    const item = {
      name: subscribe.name,
      groups: subscribe.domain?.groups ?? wechatyConfig.menu.domain.groups,
      contacts: subscribe.domain?.contacts ?? wechatyConfig.menu.domain.contacts,
    }
    result[key] = result[getSimplePinyin(key)] = item
  })
  return result
}, {})
export const availableServices = subscribes.map((subscribe, index) => `${index + 1}. ${subscribe.name_cn}`).join('\n')

export const REG_SUBSCRIBE = new RegExp(wechatyConfig.menu.regex)

logger.info(wechatyConfig)
console.log(wechatyConfig)