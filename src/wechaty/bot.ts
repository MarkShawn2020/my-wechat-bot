/**
 * ref:
 * - 有问题：https://github.com/wechaty/puppet-padlocal/wiki/Getting-Started-with-TypeScript-Javascript
 * - https://github.com/padlocal/wechaty-puppet-padlocal-demo/blob/master/main.ts
 */

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import {Contact, Message, Room, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";

import {logger} from "../utils/log";
import {checkXgyqStatus} from "../services/xgyq/api/status";
import {getSimplePinyin} from "../utils/pinyin";
import {fetchDailyListByPlace} from "../services/xgyq/api/trend";
import {FileBox} from "file-box";
import {getQsbkText} from "../services/qsbk/api/getQsbkText";
import {availableServices, FULL_BOT_NAME, REG_SUBSCRIBE, subscribeMap, subscribes, VALID_TRIGGERS} from "./base";
import {fetchDalle} from "../services/text2imgs/api/text2imgs";
import {getQsbkSingleImage} from "../services/qsbk/api/getQsbkSingleImage";

dotenv.config()

const bot = WechatyBuilder.build({
  name: FULL_BOT_NAME,
  puppet: new PuppetPadlocal({})
})

const handleSubscribes = async (msg: Message): Promise<undefined> => {
  logger.info(msg.toString())
  const text = msg.text()
  const room = msg.room()
  const talker = msg.talker()

  logger.info({text})
  if (REG_SUBSCRIBE.test(text)) {
    const matched = text.match(REG_SUBSCRIBE)
    const trigger = getSimplePinyin(matched![1]) // 触发词
    const toInput = matched![2] // 输入
    if (!trigger) return;

    logger.info({...msg.payload, trigger, toInput})
    // 匹配上
    if (VALID_TRIGGERS.includes(trigger)) {

      // todo: @ in room
      let toReply: Room | Contact | undefined = undefined
      if (room && subscribeMap[trigger].groups.filter(x => room.payload!.topic.includes(x))) {
        toReply = room
      } else if (subscribeMap[trigger].contacts.includes(talker.payload!.name)) {
        toReply = talker
      }
      if (!toReply) return;

      switch (subscribeMap[trigger].name) {
        case 'CALL_MENU':
          await toReply.say(
            [
              `== ${FULL_BOT_NAME} ==`,
              '\n',
              '❤️目前可用服务：',
              availableServices,
              '\n',
              '⭐️请求调用：【服务名（或其拼音） 可选参数】',
              '例如：cc | 川川 | 查疫情 北京朝阳 | cyq 北京朝阳',
              '\n',
              '⭐️请求帮助：【请求帮助（qqbz、help） 服务名（或其拼音、序号）】',
              '例如：help 3 | qqbz 3 | qqbz cyq | qqbz 查疫情 | 请求帮助 查疫情'
            ].join('\n')
          )
          return

        case 'CALL_HELP':
          console.log({toInput})
          if (!toInput) {
            await toReply.say(`请求帮助时必须指定服务名称或者序号`)
            return
          }
          const matchedNum = toInput.match(/\d+/)
          let targetSubscribe = undefined
          if (matchedNum) {
            const subscribeSeq = parseInt(matchedNum[0])
            if (subscribeSeq <= 0 || subscribeSeq > subscribes.length) {
              await toReply.say(`仅支持 1 - ${subscribes.length} 个服务选项`)
              return
            }
            targetSubscribe = subscribes[subscribeSeq - 1]
          } else {
            const matchedSubscribes = subscribes.filter(subscribe => subscribe.name_zh.includes(toInput) || getSimplePinyin(subscribe.name_zh).includes(toInput))
            if (matchedSubscribes.length !== 1) {
              await toReply.say(`${FULL_BOT_NAME}\n仅支持以下服务：\n${availableServices}`)
              return
            }
            targetSubscribe = matchedSubscribes[0]
          }
          await toReply.say(JSON.stringify(targetSubscribe, null, 2))
          return

        case 'GET_XGYQ_STATUS':
          await toReply.say(await checkXgyqStatus({key: toInput}))
          return

        case 'GET_XGYQ_TREND':
          let data = await fetchDailyListByPlace({key: toInput})
          await toReply.say(Buffer.isBuffer(data) ? FileBox.fromBuffer(data, `${toInput}.png`) : data)
          return

        case 'GET_QSBK_TEXT':
          await toReply.say(await getQsbkText())
          return

        case 'GET_QSBK_SINGLE_IMAGE':
          const item = await getQsbkSingleImage()
          await toReply.say(item.content)
          await toReply.say(FileBox.fromUrl(item.origin_url, item.imageName))
          return

        case `GEN_DALLE_IMAGES`:
          if (!toInput) {
            await toReply.say('AI画图服务输入文本不能为空')
            return
          }
          if (!/^[0-9a-zA-Z\s'.,:-]+$/.test(toInput)) {
            await toReply.say('AI画图服务输入文本只支持英文')
            return
          }
          await toReply.say(`AI画图任务【${toInput}】已启动，结果大约需要一分钟……`)
          const res = await fetchDalle({key: toInput})
          const seq = Math.floor(Math.random() * 9)
          const imgBase64 = res.images[seq]
          const fn = `${res.name}_${seq + 1}.jpg`
          await toReply.say(`AI画图任务【${toInput}】完成：`)
          await toReply.say(FileBox.fromBase64(imgBase64, fn))
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