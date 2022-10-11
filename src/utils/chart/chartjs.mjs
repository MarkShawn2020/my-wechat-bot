// Install libs with: npm i chartjs-node-canvas chart.js
// Docs https://www.npmjs.com/package/chartjs-node-canvas
// Config documentation https://www.chartjs.org/docs/latest/axes/
import fs from 'fs'
import {ChartJSNodeCanvas} from "chartjs-node-canvas";

const width = 400; //px
const height = 400; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, backgroundColour});

const configuration = {
  type: 'line',   // for line chart
  data: {
    labels: [2018, 2019, 2020, 2021],
    datasets: [{
      label: "Sample 1",
      data: [10, 15, -20, 15],
      fill: false,
      borderColor: ['rgb(51, 204, 204)'],
      borderWidth: 1,
      xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
    },
      {
        label: "Sample 2",
        data: [10, 30, 20, 10],
        fill: false,
        borderColor: ['rgb(255, 102, 255)'],
        borderWidth: 1,
        xAxisID: 'xAxis1'
      },
    ],

  },
  options: {
    scales: {
      y: {
        suggestedMin: 0,
      }
    }
  }
}

export async function genChart(props) {
  const type = props.type ?? "dump"
  const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
  if (type === "url") return dataUrl

  const base64Image = dataUrl
  const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
  if (type === "b64") return base64Data

  const fp = 'out.png'
  fs.writeFile("out.png", base64Data, 'base64', function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`dumped into file://${fp}`)
    }
  });
  return fp
}

export default genChart

