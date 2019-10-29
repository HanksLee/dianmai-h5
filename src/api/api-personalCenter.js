import service from './service-client'
import config from './config-client'
const api = config.api

const requestName = {
  userInfo: '/v1_home/user/user-info', // 个人信息
  realAuth: '/v1_home/user/real-auth', // 实名认证
  realAuthInfo: '/v1_home/user/real-auth-info', // 实名认证信息
  customerDetail: '/v1_home/user/customer-pay-detail', // 实名认证信息
  historyBanks: '/v1_home/user/history-out-banks', // 个人提现历史记录
  outmoney: '/v1_home/user/out-money', // 个人提现历史记录
  cashdes: '/v1_home/pay/cashdesk', // 充值获取收银台
  preorder: '/v1_home/pay/preorder', // 充值预支付
  smscode: '/v1/code/smscode', // 手机验证码
  bindcard: '/v1_home/pay/bindcard', // 充值绑定银行卡
  bindcardconfirm: '/v1_home/pay/bindcardconfirm', // 绑定银行卡短信验证
  inviterurl: '/v1_home/qrcode/inviterurl', // 我的二维码
  calprofit: '/v1_home/user/cal-profit', // 已赚取
  unbind: '/v1_home/pay/unbind', // 解除绑定银行卡
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
// 获取二维码
export function getQRCode  (val, scan_type) {
  return new Promise((resolve, reject) => {
    service.post(val, scan_type)
      .then(function (res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
  })
}
// 快捷方式短信确认
export function requestPayBindPay(sms_code, res_url) {
  // return service.post('/v1_home/pay/pay', {token, sms_code})
  let urlArr = res_url.split('/')
  let baseURL = ''
  let url = ''
  for (let i = 0; i < urlArr.length; i++) {
    if (i < 3) {
      baseURL += urlArr[i] + '/'
    } else {
      url += '/' + urlArr[i]
    }
  }
  return new Promise((resolve, reject) => {
    service.post(url, {
      sms_code
    }, {
      baseURL
    }).then(function (res) {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject(res.data)
      }
    })
  })
}
