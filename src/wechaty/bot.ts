/**
 * ref:
 * - 有问题：https://github.com/wechaty/puppet-padlocal/wiki/Getting-Started-with-TypeScript-Javascript
 * - https://github.com/padlocal/wechaty-puppet-padlocal-demo/blob/master/main.ts
 */
// bot.ts

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {Contact, Message, Room, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import fs from "fs";
import path from "path";
import yaml from 'js-yaml'


import {PROJECT_DIR} from "../general/path";
import {ISubscribeFromKey, IWechatyConfig} from "./wechatyConfig.ds";
import {checkXgyqStatus} from "../services/xgyq/getData";
import {getSimplePinyin} from "./utils";
import {logger} from "../general/log";


dotenv.config()

const wechatyConfig = yaml.load(fs.readFileSync(path.join(PROJECT_DIR, 'config-wechaty.yaml'), 'utf-8')) as unknown as IWechatyConfig
const {menu} = wechatyConfig
const {subscribes} = menu
const defaultDomain = menu.domain
const defaultContacts = defaultDomain.contacts
const defaultGroups = defaultDomain.groups

const subscribeMap = subscribes.reduce((result: Record<string, ISubscribeFromKey>, subscribe) => {
  subscribe.keys.forEach(key => {
    const item = {
      name: subscribe.name,
      groups: subscribe.domain?.groups ?? defaultGroups,
      contacts: subscribe.domain?.contacts ?? defaultContacts,
    }
    result[key] = result[getSimplePinyin(key)] = item
  })
  return result
}, {})

const REG_SUBSCRIBE = new RegExp(menu.regex)
logger.info(wechatyConfig)
console.log(wechatyConfig)


// if not add this, would have TLS connection error
const puppet = new PuppetPadlocal({
//  using env default
})

const bot = WechatyBuilder.build({
  name: "TestBot",
  puppet
})

const handleSubscribes = async (msg: Message): Promise<undefined> => {
  const text = msg.text()
  const room = msg.room()
  const talker = msg.talker()

  if (REG_SUBSCRIBE.test(text)) {
    const matched = text.match(REG_SUBSCRIBE)
    const trigger = matched![1].toLowerCase() // 触发词
    const toInput = matched![2] // 输入
    if (!trigger) return;

    logger.info({...msg.payload, trigger, toInput})
    // 匹配上
    if (Object.keys(subscribeMap).includes(trigger)) {

      // todo: @ in room
      let toReply: Room | Contact | undefined = undefined
      if (room && subscribeMap[trigger].groups.includes(room.payload!.topic)) {
        toReply = room
      } else if (subscribeMap[trigger].contacts.includes(talker.payload!.name)) {
        toReply = talker
      }
      if (!toReply) return;

      switch (subscribeMap[trigger].name) {
        case 'CALL_MENU':
          await toReply.say(JSON.stringify(subscribes, null, 2))
          return
        case 'CHECK_XGYQ':
          await toReply.say(await checkXgyqStatus({key: toInput}))
          return
        default:
          logger.error(`UNEXPECTED!`)
      }
    }
  }
}

bot
  .on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
      console.log(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    } else {
      console.log(`onScan: ${ScanStatus[status]}(${status})`);
    }
  })

  .on("login", (user: Contact) => {
    console.log(`${user} login`);
  })

  .on("logout", (user: Contact) => {
    console.log(`${user} logout`);
  })

  .on("message", async (message: Message) => {
    console.log(`on message: ${message.toString()}`);
    await handleSubscribes(message)
  })

  .start()

console.log("TestBot", "started");