const domain = document.domain
let api_root = 0
const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
if (domain === 'localhost') {
  // api_root = 'http://api.dianmai361.com'
  api_root = 'https://api2.huataistock.com'
}else if(domain == 'h6.dianmai365.com'){
  api_root = '//api4.' + firstDomain
}else{
  api_root = '//api2.' + firstDomain
}
module.exports = {
  api: api_root,
  timeout: 100000
}
