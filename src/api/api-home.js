import service from './service-client'
import config from './config-client'
const api = config.api

const requestName = {
  navList:'/v1_home/activenavigate/list',//导航列表
  hksearch: '/v1_home/stock/hksearch', // 港股列表
  etfproduct: '/v1_home/stock/etfproduct', // 获取ETF列表
  stibproduct: '/v1_home/stock/stibproduct', // 获取科创板列表
  hot: '/v1_home/stockplate/hot', // 热门行业热门概念
  type: '/v1_home/stockplate/type', // 热门行业热门概念
  hottype: '/v1_home/stockplate/hottype', // 热门行业热门概念
  list:'/v1_home/content/list',//获取滚动公告
  detail:'v1_home/content/detail',//公告详情
  future:'/v1_home/stock/future',//获取期货
  markettype:'/v1/systype/markettype',//期货分类tab
  indexbg:'/v1_home/user/indexbg',//获取页面title
  cfdproduct: '/v1_home/stock/cfdproduct' // 获取cfd
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
