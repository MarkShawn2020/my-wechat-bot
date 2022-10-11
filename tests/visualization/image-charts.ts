import ImageCharts from "image-charts";
import fs from "fs";
import path from "path";
import {OUT_DIR} from "../../src/general/path";

const pie = new ImageCharts()
  .cht('line')
  .chd('a:2.5,5,8.3|3,2,1')
  .chs('512x512');

// ref: https://image-charts.com/chart?chd=a%3A2.5%2C5%2C8.3&chs=600x300&cht=p
console.log(`url: ${pie.toURL()}`)

pie.toBuffer()
  .then(data => {
    const fp = path.join(OUT_DIR, 'image-charts.png')
    fs.writeFile(fp, data, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`dumped into file://${fp}`)
      }
    })
  })