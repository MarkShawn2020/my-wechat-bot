import path from "path";
import {CACHE_DIR} from "../../utils/path";

// todo: localCityNCOVDataList
export const XGYQ_DAILY_LIST_URL = 'https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list'
export const XGYQ_MODULES_URL = 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list'
export const XGYQ_STATUS_FP = path.join(CACHE_DIR, 'xgyq/diseaseh5Shelf/res.json')
export const XGYQ_STATUS_VALID_MS = 1000 * 60 * 60 // 1 h
