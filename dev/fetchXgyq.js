import fs from "fs";

fetch("https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf", {
}).then(r => r.json())
  .then(r => {
    console.log(r)
    fs.writeFileSync('xgyq.json', JSON.stringify(r, null, 2), {encoding: "utf-8"})
  })