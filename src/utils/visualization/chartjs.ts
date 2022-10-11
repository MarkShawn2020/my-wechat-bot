// Install libs with: npm i chartjs-node-canvas chart.js
// Docs https://www.npmjs.com/package/chartjs-node-canvas
// Config documentation https://www.chartjs.org/docs/latest/axes/
import fs from 'fs'
import {ChartJSNodeCanvas, ChartJSNodeCanvasOptions} from "chartjs-node-canvas";
import type {ChartConfiguration} from "chart.js";
import yaml from "js-yaml";
import path from "path";
import {SYSTEM_CONFIG_DIR} from "../path";
import _ from "lodash";

export interface IChartjsConfig {
  canvasOptions: ChartJSNodeCanvasOptions
  chartConfiguration: ChartConfiguration
}

const defaultChartjsConfig = yaml.load(fs.readFileSync(path.join(SYSTEM_CONFIG_DIR, 'chartjs.default.yaml'), 'utf-8')) as unknown as IChartjsConfig


export interface genChartProps {
  savePath?: string
  canvasOptions?: ChartJSNodeCanvasOptions
  chartConfiguration: ChartConfiguration
}

export async function genChart(props: genChartProps): Promise<Buffer> {

  return new Promise((resolve, reject) => {
    const canvasOptions = _.assign({}, defaultChartjsConfig.canvasOptions, props.canvasOptions) as unknown as ChartJSNodeCanvasOptions
    console.log(canvasOptions)
    new ChartJSNodeCanvas(canvasOptions)
      .renderToBuffer(_.assign({}, defaultChartjsConfig.chartConfiguration, props.chartConfiguration) as unknown as ChartConfiguration)
      .then(data => {
        const {savePath} = props
        if (savePath) {
          fs.writeFile(savePath, data, 'base64', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log(`dumped into file://${savePath}`)
            }
          });
        }
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default genChart

