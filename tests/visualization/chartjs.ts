import path from "path";
import {OUT_DIR} from "../../src/general/path";
import genChart from "../../src/utils/visualization/chartjs";
import {ChartConfiguration} from "chart.js";

const chartConfiguration: ChartConfiguration = {
  type: 'line',
  data: {
    labels: [2018, 2019, 2020, 2021],
    datasets: [
      {
        label: '疫情数据',
        data: [10, 15, -20, 15],
        tension: .5,
        borderColor: ['rgb(51, 204, 204)'],
        borderWidth: 1,
        xAxisID: 'xAxis1'
      }
    ]
  }
}

genChart({
  savePath: path.join(OUT_DIR, 'chartjs.png'),
  chartConfiguration,
})