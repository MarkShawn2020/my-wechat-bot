import axios from "axios-https-proxy-fix";
import {HttpProxyAgent, HttpsProxyAgent} from "hpagent";

axios.interceptors.request.use(function (config) {

  config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
  }

  config.proxy = false

  config.httpAgent = new HttpProxyAgent({
    proxy: 'http://localhost:7890'
  })

  config.httpsAgent = new HttpsProxyAgent({
    proxy: 'http://localhost:7890'
  })

  // config.proxy = {
  //   host: 'localhost',
  //   port: 7890
  // }

  return config;
});

export const http = axios
export default http
