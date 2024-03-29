import {
  BOT_NAME,
  botCtx,
  BotStatus,
  FULL_BOT_NAME,
  REG_SUBSCRIBE,
  subscribeKeyInfoMap,
  subscribes,
  VALID_TRIGGERS
} from "./base";
import {getQsbkSingleImage} from "../services/qsbk/api/getQsbkSingleImage";
import {FileBox} from "file-box";
import {Contact, Message, Room} from "wechaty";
import {logger} from "../utils/log";
import {getSimplePinyin} from "../utils/pinyin";
import {fetchDailyListByPlace} from "../services/xgyq/api/trend";
import {fetchDalle} from "../services/text2img/api/text2imgs";
import yaml from "js-yaml";
import {checkXgyqStatus} from "../services/xgyq/api/status";
import {getQsbkText} from "../services/qsbk/api/getQsbkText";
import {getQsbkSingleVideo} from "../services/qsbk/api/getQsbkSingleVideo";
import {ToReply} from "./ds/general";
import {searchTorrentsViaAxios} from "../services/torrent/api/searchTorrentsViaAxios";
import {setClipboard} from "../services/clipboard/api/setClipboard";
import {Status} from "../utils/general";


export const handleCallHelp = async (toReply: ToReply, toInput: string) => {
  const key = getSimplePinyin(toInput)
  const IS_VALID = VALID_TRIGGERS.includes(key)
  console.log({toInput, key, IS_VALID})
  if (!IS_VALID) {
    await toReply.say(
      [
        `== ${FULL_BOT_NAME} ==`,
        '❤️目前可用服务：',
        subscribes.map((subscribe) =>
          `· ${subscribe.name_zh} (${subscribe.keys.map(getSimplePinyin).join(' | ')})`).join('\n'),
        '⭐️请求调用：【服务名 + 可选参数】',
        '⭐️请求帮助：【help 服务名】',
      ].join('\n')
    )
    return
  }

  await toReply.say(yaml.dump(subscribeKeyInfoMap[key].config, {indent: 4}))
}

export const handleGetXgyqStatus = async (toReply: ToReply, toInput: string) => {
  await toReply.say(await checkXgyqStatus({key: toInput}))
}

export const handleGetXgyqTrend = async (toReply: ToReply, toInput: string) => {
  let data = await fetchDailyListByPlace({key: toInput})
  await toReply.say(Buffer.isBuffer(data) ? FileBox.fromBuffer(data, `${toInput}.png`) : data)
}

export const handleGetQsbkText = async (toReply: ToReply) => {
  await toReply.say(await getQsbkText())
}

export const handleGetQsbkSingleImage = async (toReply: ToReply) => {
  const item = await getQsbkSingleImage()
  await toReply.say(FileBox.fromUrl(item.origin_url, {name: item.fileName}))
  await toReply.say(item.content)
}

export const handleGetQsbkSingleVideo = async (toReply: ToReply) => {
  const item = await getQsbkSingleVideo()
  await toReply.say(FileBox.fromUrl(item.origin_url, {name: item.fileName}))
  await toReply.say(item.content)
}

export const handleGetQsbk = async (toReply: ToReply) => {
  const qsbkHandlers = [
    handleGetQsbkText,
    handleGetQsbkSingleImage,
    handleGetQsbkSingleVideo
  ]
  const seq = Math.floor(Math.random() * qsbkHandlers.length)
  const selectedHandler = qsbkHandlers[seq]
  await selectedHandler(toReply)
}

export const handleText2Img = async (toReply: ToReply, toInput?: string) => {
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
}

export const handleSearchTorrents = async (toReply: ToReply, toInput?: string) => {
  if (!toInput) {
    await toReply.say(`搜种子服务需要一个参数，例如：搜种子 隐入尘烟`)
    return
  }
  const torrentResult = await searchTorrentsViaAxios({key: toInput})
  logger.info({torrentResult})
  if (torrentResult.status === Status.OK) {
    const ubuntuPasteResult = await setClipboard({content: yaml.dump(torrentResult, {indent: 4}), format: 'yaml'})
    if (ubuntuPasteResult.status === Status.OK) {
      await toReply.say([
        `「${torrentResult.input}」的搜索结果：`,
        ubuntuPasteResult.url
      ].join('\n'))
      return
    }
  }
  await toReply.say(`查种子服务异常！`)
}

export const handleCtrlOff = async (toReply: ToReply) => {
  botCtx.status = BotStatus.OFF
  botCtx.stoppedTime = new Date()
  const botRunningHours: number = (+botCtx.stoppedTime - +botCtx.startedTime) / 1000 / 60 / 60
  await toReply.say(`已停止${BOT_NAME}，本次服务合计：${botRunningHours.toFixed(2)}小时，祝您生活愉快~`)
}

export const handleSubscribes = async (msg: Message): Promise<void> => {
  logger.info(msg.toString())
  const text = msg.text()
  const room = msg.room()
  const talker = msg.talker()

  if (REG_SUBSCRIBE.test(text)) {
    const matched = text.match(REG_SUBSCRIBE)
    const trigger = getSimplePinyin(matched![1]) // 触发词
    const toInput = matched![2] // 输入
    if (!trigger) return;

    logger.info({...msg.payload, trigger, toInput})
    if (VALID_TRIGGERS.includes(trigger)) {

      // todo: @ in room
      let toReply: Room | Contact | undefined = undefined
      if (room && subscribeKeyInfoMap[trigger].groups.filter(x => room.payload!.topic.includes(x)))
        toReply = room
      else if (subscribeKeyInfoMap[trigger].contacts.includes(talker.payload!.name))
        toReply = talker
      if (!toReply) return;

      switch (subscribeKeyInfoMap[trigger].name) {
        case 'CALL_HELP':
          return handleCallHelp(toReply, toInput)

        case 'GET_XGYQ_STATUS':
          return handleGetXgyqStatus(toReply, toInput)

        case 'GET_XGYQ_TREND':
          return handleGetXgyqTrend(toReply, toInput)

        case 'GET_QSBK_TEXT':
          return handleGetQsbkText(toReply)

        case 'GET_QSBK_SINGLE_IMAGE':
          return handleGetQsbkSingleImage(toReply)

        case 'GET_QSBK_VIDEO':
          return handleGetQsbkSingleVideo(toReply)

        case 'GET_QSBK':
          return handleGetQsbk(toReply)

        case `GEN_DALLE_IMAGES`:
          return handleText2Img(toReply, toInput)

        case `SEARCH_TORRENTS`:
          return handleSearchTorrents(toReply, toInput)

        case `CTRL_OFF`:
          return handleCtrlOff(toReply)

        default:
          logger.error(`UNEXPECTED!`)
      }
    }
  }
}
