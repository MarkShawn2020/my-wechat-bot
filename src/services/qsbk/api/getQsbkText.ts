import {qsbkTextModel} from "../../../utils/db/conn";

export const getQsbkText = async (): Promise<string> => {
  const total = await qsbkTextModel.count().exec()
  const skip = Math.floor(Math.random() * total)
  const item = await qsbkTextModel
    .findOne({})
    .skip(skip)
    .exec()

  return item!.content
}
