import path from "path";
import {OUT_DIR} from "../../src/utils/path";
import {writeFileSync} from "fs";
import {searchTorrentsViaAxios} from "../../src/services/torrent/api/searchTorrentsViaAxios";
import {AxiosError} from "axios";

searchTorrentsViaAxios({key: '变形金刚'})
  .catch((e: AxiosError) => {
    console.warn(e)
    // console.warn(JSON.stringify(e, null, 2))
    const fp = path.join(OUT_DIR, 'magnet.error.html')
    if (e.response?.data) {
      writeFileSync(fp, e.response?.data as unknown as string)
      console.log(`dumped error-html into file://${fp}`)
    }
  })
  .then((res) => {
    console.log(res)
  })