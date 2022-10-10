import {checkXgyqStatus, fetchXgyq} from "./xgyq/getData";

const main = async () => {
  console.log(await checkXgyqStatus({key: "江苏"}))
  console.log(await checkXgyqStatus({key: "江苏南京"}))
  console.log(await checkXgyqStatus({key: "江苏南京溧水"}))
  console.log(await checkXgyqStatus({key: "南京"}))
  console.log(await checkXgyqStatus({key: "中国"}))
  console.log(await checkXgyqStatus({key: "美国"}))
}

main()