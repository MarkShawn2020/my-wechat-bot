import axios from "axios";

export const FetchDalleFromKeys = ["old", "new"] as const
export type FetchDallyFromKeyType = typeof FetchDalleFromKeys[number]
export const FetchDalleFromMap: Record<FetchDallyFromKeyType, string> = {
  old: "https://bf.dallemini.ai/generate",
  new: "https://backend.craiyon.com/generate"
}

export interface IFetchDalleRes {
  version: string
  images: string[]
  name: string
}

export interface IFetchDalleProps {
  key: string
  name?: string
  from?: FetchDallyFromKeyType
}

/**
 * fetch("https://backend.craiyon.com/generate", {
 *   "headers": {
 *     "accept": "application/json",
 *     "accept-language": "zh-CN,zh;q=0.9",
 *     "cache-control": "no-cache",
 *     "content-type": "application/json",
 *     "pragma": "no-cache",
 *     "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
 *     "sec-ch-ua-mobile": "?0",
 *     "sec-ch-ua-platform": "\"macOS\"",
 *     "sec-fetch-dest": "empty",
 *     "sec-fetch-mode": "cors",
 *     "sec-fetch-site": "same-site"
 *   },
 *   "referrerPolicy": "same-origin",
 *   "body": "{\"prompt\":\"I want to play basketball\"}",
 *   "method": "POST"
 * });
 *
 * @param {IFetchDalleProps} props
 * @returns {Promise<IFetchDalleRes>}
 */
export const fetchDalle = async (props: IFetchDalleProps): Promise<IFetchDalleRes> => {
  const name = props.name ?? props.key.replace(/\s+/g, '-').toLowerCase()
  // 新的api有`too much traffic`限制
  const fromUrl = FetchDalleFromMap[props.from ?? "old"]
  console.log(`fetching Dally: [${props.key}] --> [${name}]`)
  const res = await axios.post(
    fromUrl,
    {
      prompt: props.key
    }, {
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      }
    }
  )
  return {name, ...res.data}
}