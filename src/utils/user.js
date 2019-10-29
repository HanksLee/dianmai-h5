import Cookies from 'js-cookie'
/**
 *设置底部导航index
 */
// export function setUserCookieIndex(index) {
//   Cookies.set('index', index, { expires: 365 })
// }
/**
 * [设置uuid]
 */
export function getCookieUuid() {
  let uuid = Cookies.get('uuid')
  if (uuid) {
    return uuid
  } else {
    uuid = new Date().getTime() + '_' + Math.random(1000);
  }
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  Cookies.set('uuid', uuid, { expires: 365, path: '/', domain: firstDomain })
  return uuid
}

/**
 * [设置token]
 */
export function setUserCookie(token) {
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  const date = new Date()
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000)
  // store.commit('SET_LOGIN', token)
  Cookies.set('token', token, { expires: date, path: '/', domain: firstDomain })
}
/**
 * [清除token]
 */
export function clearUserCookie() {
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  Cookies.set('token', '', { path: '/', domain: firstDomain })
}

//保存默认第一个股票代码信息
export function setStockCodeCookie(query) {
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  Cookies.set('query', query, { expires: 365, path: '/', domain: firstDomain })
}



export function goToLogin(){
  clearUserCookie()
  this.push('/login')
}




