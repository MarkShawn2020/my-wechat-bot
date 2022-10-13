// @ts-ignore
import simplePinyin from 'simple-pinyin';

export const getSimplePinyin = (key: string): string => {
  return Array.from(key)
    .map(s => {
      if (/[\u4e00-\u9fa5]/.test(s)) {
        s = simplePinyin(s)[0][0]
      }
      return s.toLowerCase()
    })
    .join('')
}

console.log(getSimplePinyin('ai画图'))
