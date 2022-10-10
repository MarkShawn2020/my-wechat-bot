import {IXgyqRes} from "./ds";
import path from "path";
import {CACHE_DIR} from "../general/path";

// todo: localCityNCOVDataList
export const XGYQ_URL = 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=diseaseh5Shelf'
export const XGYQ_DATA_FP = path.join(CACHE_DIR, 'xgyq/data.json')
export const XGYQ_DATA_VALID_MS = 1000 * 60 * 60 // 1 h
