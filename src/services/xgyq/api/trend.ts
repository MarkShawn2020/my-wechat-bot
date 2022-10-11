// ref: https://github.com/wechaty/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/ding-dong-bot.ts

import axios from "axios";

import {XGYQ_DAILY_LIST_URL} from "../config";
import {ensurePlace, OK} from "./general";
import adcordMap from '../../../../config/system/adcodeMap.json'
import genChart from "../../../utils/visualization/chartjs";
import {CHART_COLORS} from "../../../utils/colors";
import {BOT_NAME} from "../../../wechaty/config";

export interface fetchDailyListProps {
  adcode: string // 210000: 辽宁, 211300: 辽宁朝阳
  limit: number // 30
}

export interface IDailyListItem {
  adcode: string//"211300"
  city: string//"朝阳市"
  confirm: number//7
  confirm_add: string//"0"
  date: string//"09.11"
  dead: number// 1
  heal: number// 6
  is_show_wzz_add: number// 1
  suspect: number// 0
  today_confirm_add: number// 0
  today_wzz_add: number// 0
  y: string// "2022"
  yes_confirm_add: number// 0
  yes_wzz_add: number// 0
}

export interface IDailyListRes {
  info: string
  ret: number
  data: IDailyListItem[]
}

/**
 * example:
 *  url: https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?adCode=211300&limit=30
 * @param {fetchDailyListProps} props
 * @returns {Promise<AxiosResponse<any>>}
 */
export const fetchDailyListByAdcode = async (props: fetchDailyListProps): Promise<IDailyListRes> => {
  const {adcode, limit} = props
  const url = `${XGYQ_DAILY_LIST_URL}?adCode=${adcode}&limit=${limit}`
  console.log(`fetching: ${url}`)
  const res = await axios.get(url)
  return res.data
}

export interface fetchDailyListByPlaceProps {
  key: string
}

/**
 * @param {fetchDailyListByPlaceProps} props
 * @returns {Promise<string | Buffer>}
 */
export const fetchDailyListByPlace = async (props: fetchDailyListByPlaceProps): Promise<string | Buffer> => {
  const place = ensurePlace(props.key)
  if (place.status !== OK)
    return place.msg

  // @ts-ignore
  const adcode = adcordMap[place.msg]
  const res = await fetchDailyListByAdcode({adcode, limit: 30})
  const buffer = await genChart({
      chartConfiguration: {
        type: "line",
        options: {
          plugins: {
            title: {
              display: true,
              text: `新冠疫情趋势 - ${place.msg} - ${new Date().toLocaleString()}`,
            },
            subtitle: {
              display: true,
              text: `from ${BOT_NAME}`,
              position: 'bottom',
              align: "end",
              font: {
                size: 12,
                style: "italic",
                weight: '400',
              }
            }
          }
        },
        data: {
          labels: res.data.map(item => item.date),
          datasets: [
            // configuration interpolation ref: https://github.com/chartjs/Chart.js/blob/master/docs/samples/line/interpolation.md
            {
              label: '新增确诊',
              data: res.data.map(item => item.today_confirm_add),
              borderColor: CHART_COLORS.red,// 'red',
              // cubicInterpolationMode: 'monotone',
              tension: .4,
            },
            {
              label: '新增无症状',
              data: res.data.map(item => item.today_wzz_add),
              borderColor: CHART_COLORS.blue,
              // cubicInterpolationMode: 'monotone',
              tension: .4,
            }
          ]
        }
      }
    }
  )
  return buffer
}