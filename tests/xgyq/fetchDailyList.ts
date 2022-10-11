import {fetchDailyListByPlace} from "../../src/services/xgyq/api/trend";
import fs from "fs";
import path from "path";
import {OUT_DIR} from "../../src/utils/path";

const key = '北京朝阳'
fetchDailyListByPlace({key})
  .then(data => {
    if (Buffer.isBuffer(data)) {
      const fp = path.join(OUT_DIR, `dailyList_${key}.png`)
      fs.writeFile(fp, data, (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log(`dumped into file://${fp}`)
        }
      })
    } else {
      console.log(data)
    }
  })