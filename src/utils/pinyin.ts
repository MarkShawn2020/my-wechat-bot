// @ts-ignore
import simplePinyin from 'simple-pinyin';

export const getSimplePinyin = (key: string): string => {
  return simplePinyin(key).map((s: string) => s[0].toLowerCase()).join('')
}