import {qsbkSingleImageModel, qsbkTextModel} from "../../../utils/db/conn";
import it from "node:test";

export interface IGetSingleImageRes {
  id: string // sample: 125610118
  content: string
  origin_url: string // sample: http://pic.qiushibaike.com/system/pictures/12561/125610118/origin/T1K5S2Y4Z3RDUKJJ.jpg
  imageName: string
}

export const getQsbkSingleImage = async (): Promise<IGetSingleImageRes> => {
  const total = await qsbkSingleImageModel.countDocuments({format: "image"})
  const skip = Math.floor(Math.random() * total)
  const res = await qsbkSingleImageModel
    .findOne({"format": "image"})
    .skip(skip)
    // necessary, ref: https://stackoverflow.com/a/59475644
    .lean()
    .exec() as unknown as IGetSingleImageRes
  const imageName = `${res.id}_${res.origin_url.slice(res.origin_url.lastIndexOf('/') + 1)}`
  const item = {...res, imageName}
  console.log(item)
  return item
}