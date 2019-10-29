import service from './service-client'
import config from './config-client'
import { getCookieUuid } from '@/utils/user'
const api = config.api
const requestName = {
  userWeb:'/v1/user/web',//注册参数
  login:'/v1/user/login',
  smscode:'/v1/code/smscode',
  valid:'/v1/code/valid',
  getBackPwd:'/v1/user/get-back-pwd',
  register:'/v1/user/register',
  logout:'/v1/user/logout',//退出登录
}
/**
 * 登录验证码
 */
const uuid = getCookieUuid()
export function getLoginCode() {
  return api + '/v1/code/captcha?uuid='+uuid+'&t=' + new Date().getTime()
}
export function commonRequest(name, data){
   return new Promise((resolve, reject) => {
    service.post(api + requestName[name], data)
      .then(function(res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
   })
}