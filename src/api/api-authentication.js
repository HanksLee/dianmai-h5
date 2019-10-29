import service from './service-client'
import config from './config-client'
const api = config.api

const requestName = {
  realAuth: '/v1_home/user/real-auth', // 实名认证
  realAuthInfo: '/v1_home/user/real-auth-info', // 实名认证信息
  customerDetail: '/v1_home/user/customer-pay-detail', // 实名认证信息
  cooperative: '/v1_home/cmscontent/cooperative', // 合作协议
  about_us:'/v1_home/cmscontent/about-us',
  tradingrule:'/v1_home/cmscontent/tradingrule',//交易规则
  registerrule:'/v1_home/cmscontent/registerrule',//注册合作协议
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
