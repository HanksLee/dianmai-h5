// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
// import  mui from './mui/js/mui.min.js'
// Vue.prototype.mui = mui
import { Tab, Tabs,Row, Col, Stepper, Dialog, Icon, Toast, Field, Notify, Loading, Collapse, CollapseItem, Popup, RadioGroup, Radio,PullRefresh,NoticeBar,Checkbox, CheckboxGroup} from 'vant'
Vue.use(Tab).use(Tabs).use(Row).use(Col).use(Stepper).use(Dialog).use(Icon).use(Toast).use(Field).use(Notify).use(Loading).use(infiniteScroll).use(Collapse).use(CollapseItem).use(Popup).use(RadioGroup).use(Radio).use(PullRefresh).use(NoticeBar).use(Checkbox).use(CheckboxGroup);
Vue.config.productionTip = false
Vue.prototype.$message = function(message){
  Notify({
    message:message,
    background: 'rgba(0,0,0,0.9)',
    color: '#FFE131'
  });
}
Vue.prototype.$messageSuccess = function(message){
  Toast.success({
    message:message,
  });
}
Vue.prototype.$messageFail = function(message){
  Toast.fail({
    message:message
  });
}
Vue.prototype.textFn = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'ruthinks.com'){
    return '终止合约'
  }else{
    return '平仓'
  }
};
//平仓按钮，aca按钮显示为终止合约
Vue.prototype.textX = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'acarpsgroup.com'){
    return '终止合约'
  }else{
    return '平仓'
  }
};
Vue.prototype.domainFn = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'dingmaohongsheng.com'){
    return true
  }else{
    return false
  }
};
Vue.prototype.textFn1 = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'liangrong-fund.com'){
    return {
      text1:'融资买涨',
      text2:'融券买跌'
    }
  }else{
    return {
      text1:'多头合约',
      text2:'空头合约'
    }
  }
};
Vue.prototype.textFn2 = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'liangrong-fund.com'){
    return '交易'
  }else{
    return '策略'
  }
};
Vue.prototype.textFn3 = function(){
  const domain = document.domain
  let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  if(firstDomain == 'liangrong-fund.com'){
    return '交易'
  }else if(firstDomain == 'boloniasia.com'){
    return '订单'
  }else{
    return '策略'
  }
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

let setSize = () => {
  if (document.documentElement.clientWidth > 750) {
    document.documentElement.style.fontSize = '100px';
  } else {
    document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 750) + 'px';
  }
}
setSize()
window.addEventListener('resize', setSize, false)
