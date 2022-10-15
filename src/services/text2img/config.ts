export const FetchDalleFromKeys = ["old", "new"] as const
export type FetchDallyFromKeyType = typeof FetchDalleFromKeys[number]

export const FetchDalleFromMap: Record<FetchDallyFromKeyType, string> = {
  old: "https://bf.dallemini.ai/generate",
  new: "https://backend.craiyon.com/generate"
}