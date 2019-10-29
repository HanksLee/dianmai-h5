import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
Vue.use(Router)
let judgeLogin = (to, from, next) => {
  let token = Cookies.get('token') || null
  if(token||to.path === '/hzxy'){
    next()
  }else{
    next('/login')
    let loginRoute = {path: '/login', query: {backRoute: encodeURIComponent(to.fullPath)}}
    next(loginRoute)
  }
}
const router = new Router({
  routes: [
     //登录
     {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login/index'], resolve)
    },//注册
    {
     path: '/register',
     name: 'register',
     component: resolve => require(['@/pages/register/index'], resolve)
   },//重置密码
   {
    path: '/resetPassword',
    name: 'resetPassword',
    component: resolve => require(['@/pages/resetPassword/index'], resolve)
  },
    //股票策略
    {
      path: '/strategy',
      name: 'strategy',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/strategy/index'], resolve)
    },
    //点差策略
    {
      path: '/strategy1',
      name: 'strategy1',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/strategy1/index'], resolve)
    },
    //订单详情
    {
      path: '/orderDetails',
      name: 'orderDetails',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/orderDetails/index'], resolve)
    },
    // 行情
    {
      path: '/',
      name: 'home',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/home/index'], resolve)
    },
    // 热门三级列表
    {
      path: '/shares_type',
      name: 'sharesType',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/sharesType/index'], resolve)
    },
    // 热门股票
    {
      path: '/host_shares',
      name: 'hostShaares',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/host_shares/index'], resolve)
    },
    // 自选股
    {
      path: '/optional_stock',
      name: 'optionalStock',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/optional_stock/index'], resolve)
    },
    // 搜索
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['@/pages/search/index'], resolve)
    },
    // 个人中心
    {
      path: '/personal_center',
      name: 'personal_center',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center'], resolve)
    },
    // 实名认证
    {
      path: '/authentication',
      name: 'authentication',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/authentication'], resolve)
    },
    // 审核过程
    {
      path: '/findings_audit',
      name: 'findingsoAudit',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/findings_audit'], resolve)
    },
    // 资金明细
    {
      path: '/capital_details',
      name: 'capitalDetails',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/capital_details'], resolve)
    },
    // 关于我们
    {
      path: '/about_us',
      name: 'aboutUs',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/about_us'], resolve)
    },
    // 帮助中心
    {
      path: '/common_problem',
      name: 'commonProblem',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/common_problem'], resolve)
    },
    // 合作协议
    {
      path: '/hzxy',
      name: 'hzxy',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/hzxy'], resolve)
    },
    // 我的推广
    {
      path: '/my_promotion',
      name: 'my_promotion',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/my_promotion'], resolve)
    },
    // 提现
    {
      path: '/cash_withdrawal',
      name: 'CashWithdrawal',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/cash_withdrawal'], resolve)
    },
    // 充值
    {
      path: '/recharge',
      name: 'Recharge',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/recharge'], resolve)
    },
    // 扫码跳转
    {
      path: '/tiaozhuan',
      name: 'tiaozhuan',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/tiaozhuan'], resolve)
    },
    // 新web
    {
      path: '/newweb',
      name: 'newweb',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/newweb'], resolve)
    },
    // 测试调相机
    {
      path: '/ceshi',
      name: 'ceshi',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/ceshi'], resolve)
    },
    // 消息列表
    {
      path: '/news',
      name: 'news',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/personal_center/news'], resolve)
    },
    // 公告列表
    {
      path: '/notice',
      name: 'notice',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/notice'], resolve)
    },
    // 新股
    {
      path: '/attack_new_stock',
      name: 'AttackNewStock',
      beforeEnter: judgeLogin,
      component: resolve => require(['@/pages/attack_new_stock'], resolve)
    }
  ],
  //路由跳转返回顶部
  // scrollBehavior:(to,from,savedPositio) =>{
  //   console.log(savedPositio)
  //   return {x:0,y:0}
  // },
})
//全局路由守卫
// router.beforeEach((to,form,next)=>{
//   console.log(to)
//   next()
// })
export default router
