import {getQsbkText} from "../../src/services/qsbk/api/getQsbkText";

getQsbkText()
  .then(res => {
    console.log(res)
  })