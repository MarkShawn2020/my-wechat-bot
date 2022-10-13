import {fetchDalle, FetchDalleFromKeys} from "../../src/services/text2imgs/api/text2imgs";
import fs from "fs";
import path from "path";
import {OUT_DIR} from "../../src/utils/path";
import {program, Option} from "commander";

program
  .addOption(new Option('-v, --version <url>', 'api-version').choices(FetchDalleFromKeys))
  .parse()

const options = program.opts()

fetchDalle({
  key: "Today is a good day",
  from: options.version
}).then(res => {
  res.images.forEach((blob, index) => {
    const imgsDir = path.join(OUT_DIR, res.name)
    if (!fs.existsSync(imgsDir)) {
      fs.mkdirSync(imgsDir)
    }
    const fp = path.join(imgsDir, `${index+1}.jpg`)

    fs.writeFile(fp, blob, 'base64', (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`dumped into file://${fp}`)
      }
    })
  })
})