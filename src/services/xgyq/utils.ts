import {IXgyqAreaItem} from "./ds/diseaseh5Shelf";

export const dumpXgyqAreaItem = (item: IXgyqAreaItem): string[] => {
  return [
    `· 更新时间：${item.total.mtime}`,
    `· 总确认：${item.total.confirm}`,
    `· 总死亡：${item.total.dead}`,
    `· 总治愈：${item.total.heal}`,
    `· 新增确认：${item.today.confirm}`,
    `· 新增无症状：${item.today.wzz_add}`,
  ]
}