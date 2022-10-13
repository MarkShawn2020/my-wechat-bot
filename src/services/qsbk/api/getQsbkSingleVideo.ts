import {qsbkSingleImageModel, qsbkSingleVideoModel, qsbkTextModel} from "../../../utils/db/conn";
import it from "node:test";
import {qsbkSingleVideoSchema} from "../../../utils/db/schemas/qsbk";

export interface IGetSingleVideoRes {
  id: string // sample: 125610118
  content: string
  origin_url: string // sample: http://pic.qiushibaike.com/system/pictures/12561/125610118/origin/T1K5S2Y4Z3RDUKJJ.jpg
  fileName: string
}

export const getQsbkSingleVideo = async (): Promise<IGetSingleVideoRes> => {
  const total = await qsbkSingleVideoModel.countDocuments()
  const skip = Math.floor(Math.random() * total)
  const res = await qsbkSingleVideoModel
    .findOne()
    .skip(skip)
    // necessary, ref: https://stackoverflow.com/a/59475644
    .lean()
    .exec() as unknown as IGetSingleVideoRes
  const fileName = `${res.id}_${res.origin_url.slice(res.origin_url.lastIndexOf('/') + 1)}`
  const item = {...res, fileName}
  console.log(item)
  return item
}