import service from './service-client'
import config from './config-client'
const api = config.api
const requestName = {
  detail: '/v1_home/stock/detail', // 详细
  buyfee: '/v1_home/policy/buyfee',
  mylist: '/v1_home/policy/mylist',//持仓策略
  posdetail: '/v1_home/policy/posdetail',//策略详情
  buy: '/v1_home/policy/buy',//买入
  myhistory: '/v1_home/policy/myhistory',//结算策略
  hisdetail: '/v1_home/policy/hisdetail',//结算策略详情
  closeaotodelay: '/v1_home/orderpolicy/closeaotodelay',//关闭递延
  sell: '/v1_home/policy/sell',
  userMoney: '/v1_home/user/user-money',
  updatetpsl: '/v1_home/orderpolicy/updatetpsl',//调整止盈止损
  fiash: '/v1_home/quoteday/fiash',//分时图
  newFiash: '/v1_home/quoteday/newfiash', // 新的分时
  kline: '/v1_home/quoteday/kline',//k线图
  alertcount:'/v1_home/user/alertcount',//爆仓预警消息条数
  alertmsg:'/v1_home/user/alertmsg',//爆仓预警消息
  fundflow:'/v1_home/stock/fundflow',//资金流向
  trademsg:'/v1_home/stock/trademsg',//公告
  greathit:'/v1_home/stock/greathit',
  future:'/v1_home/stock/future',//获取期货
  price:'/v1_home/stock/price',//获取产品当前价
  list:'/v1_home/activenavigate/list',//获取刷新参数
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
