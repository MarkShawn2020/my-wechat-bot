/**
 * ref:
 * - 有问题：https://github.com/wechaty/puppet-padlocal/wiki/Getting-Started-with-TypeScript-Javascript
 * - https://github.com/padlocal/wechaty-puppet-padlocal-demo/blob/master/main.ts
 */

import dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {Contact, Message, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {FULL_BOT_NAME} from "./base";
import {handleSubscribes} from "./handlers";

dotenv.config()

const bot = WechatyBuilder.build({
  name: FULL_BOT_NAME,
  puppet: new PuppetPadlocal({})
})


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