import service from './service-client'
import config from './config-client'
const api = config.api

const requestName = {
  new_stock: '/v1_home/user/newstockcount', // 新股统计 type 1 新股列表 type 2
}
// 统一的请求方法
export function commonRequest(name, data) {
  return new Promise((resolve, reject) => {
    service.post(api + requestName[name], data)
      .then(function (res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
  })
}
