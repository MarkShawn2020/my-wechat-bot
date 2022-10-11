import adcordMap from '../../../../config/system/adcodeMap.json'


export const OK = "OK"
export type OK = typeof OK

export const ERROR = "ERROR"
export type ERROR = typeof ERROR

export interface Result {
  status: OK | ERROR
  msg: string
}

export const ensurePlace = (s: string): Result => {
  s = s.replace(/[\s-+省市区直辖]/, '').toLowerCase()
  if (!s) return {status: ERROR, msg: "输入不能为空"}
  const places = Object.keys(adcordMap)
  if (places.includes(s)) return {status: OK, msg: s}
  const potentialPlaces = places.filter(place => place.includes(s))
  if (potentialPlaces.length === 0) return {status: ERROR, msg: "输入省市不合法"}
  if (potentialPlaces.length > 1) return {status: ERROR, msg: `有多个城市匹配，请确认：${potentialPlaces.join(" | ")}`}
  return {status: OK, msg: potentialPlaces[0]}
}
