import {getQsbkText} from "../../src/services/qsbk/api/getText";

getQsbkText()
  .then(res => {
    console.log(res)
  })