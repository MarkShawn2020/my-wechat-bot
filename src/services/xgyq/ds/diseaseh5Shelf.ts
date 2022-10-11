import {ProvinceCity} from "./general";

/**
 * example:
 *         "province": "内蒙古",
 *         "city": "呼和浩特",
 *         "adcode": "150100",
 *         "date": "2022/10/10",
 *         "isUpdated": true,
 *         "local_confirm_add": 87,
 *         "mediumRiskAreaNum": 17,
 *         "mtime": "2022-10-10 14:46:53",
 *         "local_wzz_add": "499",
 *         "highRiskAreaNum": 393,
 *         "isSpecialCity": false
 */
export interface IXgyqLocalCityNCOVItem extends ProvinceCity {
  adcode: string;
  date: string;
  isUpdated: boolean;
  local_confirm_add: number;
  mediumRiskAreaNum: number;
  mtime: string;
  local_wzz_add: string;
  highRiskAreaNum: number;
  isSpecialCity: boolean;
}

/**
 * sample:
 * {
 *     "mtime": "2022-10-10 14:46:59",
 *     "adcode": "",
 *     "dead": 0,
 *     "heal": 0,
 *     "wzz": 0,
 *     "provinceLocalConfirm": 0,
 *     "highRiskAreaNum": 0,
 *     "showHeal": true,
 *     "continueDayZeroLocalConfirm": 0,
 *     "nowConfirm": 6867283,
 *     "mediumRiskAreaNum": 0,
 *     "confirm": 6867283,
 *     "showRate": false,
 *     "continueDayZeroLocalConfirmAdd": 0
 * },
 */
export interface IXgyqAreaItemTotal {
  mtime: string
  adcode: string
  dead: number
  heal: number
  wzz: number
  provinceLocalConfirm: number
  highRiskAreaNum: number
  showHeal: boolean
  continueDayZeroLocalConfirm: number
  nowConfirm: number
  mediumRiskAreaNum: number
  confirm: number
  showRate: boolean
  continueDayZeroLocalConfirmAdd: number
}

export interface IXgyqAreaItemToday {
  "confirm": number,
  "isUpdated": boolean

  "wzz_add": string,
  "local_confirm_add": number,
  "confirmCuts": number
}

export interface IXgyqAreaItem {
  name: string
  today: IXgyqAreaItemToday
  total: IXgyqAreaItemTotal
  children: IXgyqAreaItem[]
}

/**
 * sample:
 *                 {
 *                   "total": {},
 *                   "name": "地区待确认",
 *                   "adcode": "",
 *                   "date": "2022/10/10",
 *                   "today": {
 *                     "confirmCuts": 0,
 *                     "isUpdated": true,
 *                     "wzz_add": "",
 *                     "local_confirm_add": 44549,
 *                     "confirm": 44549
 *                   }
 *                 }
 */
export interface IXgyqAreaCity extends IXgyqAreaItem {
  adcode: string
  date: string
}

/**
 * todo: 省份的today多几项
 */
export interface IXgyqAreaProvince extends IXgyqAreaItem {
  date: string
  children: IXgyqAreaCity[]
}

export interface IXgyqChinaAdd {
  "confirm": number//91023,
  "dead": number//154,
  "heal": number// 823,
  "importedCase": number// 123,
  "localConfirm": number// 574,
  "localConfirmH5": number// 373,
  "noInfect": number// 1672,
  "noInfectH5": number// 1566,
  "nowConfirm": number// 90046,
  "nowSevere": number// 35,
  "suspect": number// 0,
}

export interface IXgyqChinaTotal extends IXgyqChinaAdd {
  "confirmAdd": number// 45581,
  "deadAdd": number// 65,
  "highRiskAreaNum": number// 1281,
  "localConfirmAdd": number// 373,
  "localWzzAdd": number// 1566,
  "local_acc_confirm": number// 253575,
  "mRiskTime": string// "2022-10-10 13:52:08",
  "mediumRiskAreaNum": number// 898,
  "mtime": string// "2022-10-10 09:10:28",
  "nowLocalWzz": number// 11206,
  "showLocalConfirm": number// 1,
  "showlocalinfeciton": number// 1,
}

export interface IXgyqAreaChina {
  name: string
  today: {
    "confirm": number,
    "isUpdated": boolean
  }
  children: IXgyqAreaProvince[]
}


export interface IXgyqRes {
  ret: number
  info: string
  data: {
    diseaseh5Shelf: {
      showAddSwitch: object //todo
      areaTree: IXgyqAreaChina[]
      lastUpdateTime: string
      chinaTotal: IXgyqChinaTotal
      chinaAdd: IXgyqChinaAdd
    } // todo
    localCityNCOVDataList: IXgyqLocalCityNCOVItem[]
  }
}