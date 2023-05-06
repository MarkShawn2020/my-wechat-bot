import path from "path";
import {LOGS_DIR} from "./path";

const winston = require('winston');

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    // service: 'user-service'
  },
  transports: [
    new winston.transports.Console(),
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({filename: path.join(LOGS_DIR, 'errors.log'), level: 'error'}),
    new winston.transports.File({filename: path.join(LOGS_DIR, 'combined.log')}),
  ],
});
