// ref: https://mongoosejs.com/docs/connections.html
import * as mongoose from "mongoose";
import dotenv from "dotenv";
import {qsbkTextSchema} from "./schemas/qsbkText";

dotenv.config()

const conn = mongoose.createConnection(process.env.MONGODB_URI!)
conn.once('open', () => {
  console.log('database opened')
})
  .once('close', () => {
    console.log('database closed')
  })


export const qsbkTextModel = conn.model('text', qsbkTextSchema)
export default conn
