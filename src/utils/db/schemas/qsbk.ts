import {Schema} from "mongoose";

export const qsbkTextSchema = new Schema(
  {
    _id: String,
    content: {
      type: String, required: true
    }, // String is shorthand for {type: String}
  },
  {
    collection: "text"
  });


export const qsbkSingleImageSchema = new Schema(
  {
    _id: String,
    content: String,
    format: String,
    origin_url: String
  },
  {
    collection: "image"
  }
)