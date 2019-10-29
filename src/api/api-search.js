import service from './service-client'
import config from './config-client'
const api = config.api

const requestName = {
  hksearch: '/v1_home/stock/hksearch', // 港股列表
  etfproduct: '/v1_home/stock/etfproduct', // 获取ETF列表
  stockSearch: '/v1_home/stock/search', // 正常搜索
  searchlog: '/v1_home/stock/searchlog', // 搜索历史
  searchall: '/v1_home/stock/searchall', // 搜索历史
  dellogSearchall: '/v1_home/stock/dellog', // 清除历史
  addsearchlog: '/v1_home/stock/addsearchlog', // 添加历史
  addmystock: '/v1_home/mystock/add', // 自添加选
  delmystock: '/v1_home/mystock/del', // 自添删除
  mystockList: '/v1_home/mystock/list', // 自添列表
}
// 统一的请求方法
export function commonRequest (name, data) {
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
