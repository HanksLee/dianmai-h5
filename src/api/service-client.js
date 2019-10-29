import axios from 'axios'
import router from '@/router/index'
import qs from 'qs'
import Cookies from 'js-cookie'
import { getCookieUuid,clearUserCookie } from '@/utils/user'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data && response.data.code === 999){
    clearUserCookie()
    router.push('/login')
  }else{
    return {
      status: 200,
      data: response.data
    }
  }
}, function (error) {
  // 对响应错误做点什么
  let message = '服务器开小差了……'
  if (error.message === 'Network Error') {
    message = '网络异常……'
  } else if (error.message.indexOf('timeout') > -1) {
    message = '请求超时……'
  }
  //window.$message(message)
  return Promise.resolve({
    status: 500,
    message: message,
    data: null
  })
});
export default {
  async post(url,data){
    let uuid = getCookieUuid()
    let token = Cookies.get('token') || ''
    data = data || {}
    data.uuid = uuid
    data.token = token
    const conf = {
      method: 'post',
      url: url,
      data: qs.stringify(data),
      timeout: 100000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    };
    const res = await axios(conf)
      return res
  }
}
