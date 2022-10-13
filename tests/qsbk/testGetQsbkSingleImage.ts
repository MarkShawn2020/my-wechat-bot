import {getQsbkText} from "../../src/services/qsbk/api/getQsbkText";
import {getQsbkSingleImage} from "../../src/services/qsbk/api/getQsbkSingleImage";
import fs from "fs";
import path from "path";
import {OUT_DIR} from "../../src/utils/path";
import axios from "axios";

getQsbkSingleImage()
  .then(async (res) => {
    console.log({res})
    const fp = path.join(OUT_DIR, res.imageName)
    const imgRes = await axios.get(res.origin_url, {responseType: "arraybuffer"})
    fs.writeFileSync(fp, imgRes.data)
    console.log(`dumped into file://${fp}`)
  })