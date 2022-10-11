import puppeteer from "puppeteer";

/**
 * Generate chart image screenshot
 * @param {object} options billboard.js generation option object
 * @param {string} fp screenshot image full path with file name
 */
export default async function screenshot(options = {}, fp = "chart.png") {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // load billboard.js assets from CDN
  await page.addStyleTag({url: "https://cdn.jsdelivr.net/npm/billboard.js/dist/theme/datalab.min.css"});
  await page.addScriptTag({url: "https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.pkgd.min.js"});

  await page.evaluate(options => {
    // @ts-ignore
    bb.generate(options);
  }, options);

  const content = await page.$(".bb");

  // https://pptr.dev/#?product=Puppeteer&show=api-pagescreenshotoptions
  await content!.screenshot({
    path: fp,
    omitBackground: true
  });
  console.log(`dumped into file://${fp}`)

  await page.close();
  await browser.close();
}


import path from "path";
import {OUT_DIR} from "../../src/general/path";

screenshot({
  data: {
    columns: [
      ["data1", 300, 350, 300, 0, 0, 0],
      ["data2", 130, 100, 140, 200, 150, 50]
    ],
    types: {
      data1: "area-step",
      data2: "area-spline"
    }
  },

  // IMPORTANT:
  // Specify 'transition.duration=0' to avoid partial rendering
  // caused by the transition(animation).
  transition: {
    duration: 0
  }
}, path.join(OUT_DIR, "./chart01.png"));

screenshot({

  data: {
    columns: [
      ["data1", 300, 350, 300, 0, 0, 0],
      ["data2", 130, 100, 140, 200, 150, 50]
    ],
    types: {
      data1: "bar",
      data2: "area"
    }
  },
  transition: {
    duration: 0
  }
}, path.join(OUT_DIR, "./chart02.png"));