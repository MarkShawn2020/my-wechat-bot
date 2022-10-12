import {Schema} from "mongoose";

export const qsbkTextSchema = new Schema(
  {
    content: {
      type: String, required: true
    }, // String is shorthand for {type: String}
    _id: String,
  },
  {
    collection: "text"
  });
