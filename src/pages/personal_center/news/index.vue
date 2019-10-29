<template>
<div class="pages-personal-center">
  <Header title="消息中心" :goreturn="true"></Header>
    <div class="news-box">
      <ul>
        <li v-for="(item,index) in list" :key="index">
          <div v-if="item.msg_type == '1'">
           <span>风控自动{{textFn()}}通知<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
           <i v-if="item.status == '0'">新</i>
           <p v-if="item.msg_type == '1'">由于您的风险值(可用资金:{{Number(Number(item.real_wallet) - Number(item.lock_money)).toFixed(2)}},冻结资金:{{item.lock_money}},盈亏:{{item.profit_money}})低于平台设定的{{Number(item.line)*100}}%，根据平台风控规则，系统将自动为您做{{textFn()}}处理——订单有：<b style="color:#ffe131;">{{item.msg}}</b>。</p>
          </div>
          <div v-if="item.msg_type == '0'">
             <span>风控{{textFn()}}预警通知<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
             <i v-if="item.status == '0'">新</i>
             <p>由于您的风险值(可用资金:{{Number(Number(item.real_wallet) - Number(item.lock_money)).toFixed(2)}},冻结资金:{{item.lock_money}},盈亏:{{item.profit_money}})低于平台设定的{{Number(item.line)*100}}%，请及时追加可用资金；根据平台风控规则，达到爆仓线时将会强平所有持仓。</p>
          </div>
          <div v-if="item.msg_type == '2'">
             <span>递延费不够扣除自动{{textFn()}}<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
             <i v-if="item.status == '0'">新</i>
             <p>由于您的可用余额不足以抵扣递延费(订单名称：<b style="color:#ffe131;">{{item.msg}}</b>,订单号：<b style="color:#ffe131;">{{item.order_id}}</b>),根据平台风控规则，系统将自动为您做{{textFn()}}处理</p>
          </div>
          <div v-if="item.msg_type == '3'">
             <span>到达止盈线自动{{textFn()}}<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
             <i v-if="item.status == '0'">新</i>
             <p>由于您的单子(订单名称：<b style="color:#ffe131;">{{item.msg}}</b>,订单号：<b style="color:#ffe131;">{{item.order_id}}</b>)达到了所设置的止盈线({{item.line_money}})，根据平台风控规则，系统将自动为您做止盈{{textFn()}}处理({{item.profit_money}})</p>
          </div>
          <div v-if="item.msg_type == '4'">
             <span>到达止损线自动{{textFn()}}<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
             <i v-if="item.status == '0'">新</i>
             <p>由于您的单子(订单名称：<b style="color:#ffe131;">{{item.msg}}</b>,订单号：<b style="color:#ffe131;">{{item.order_id}}</b>)达到了所设置的止损线({{item.line_money}})，根据平台风控规则，系统将自动为您做止损{{textFn()}}处理({{item.profit_money}})</p>
          </div>
          <div v-if="item.msg_type == '5'">
             <span>递延到期自动{{textFn()}}<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
             <i v-if="item.status == '0'">新</i>
             <p>由于您的订单(订单名称：<b style="color:#ffe131;">{{item.msg}}</b>,订单号：<b style="color:#ffe131;">{{item.order_id}}</b>)自动递延时间已到期，根据平台风控规则，系统将自动为您做{{textFn()}}处理</p>
          </div>
          <div v-if="item.msg_type == '6'">
            <span>除权除息<em style="float:right;margin-top:0.06rem;font-size:0.14rem;">{{item.create_time}}</em></span>
            <i v-if="item.status == '0'">新</i>
            <p>{{item.msg}}</p>
          </div>
        </li>
      </ul>
    </div>
</div>
</template>
<script>
  import Header from '@/components/Header'
  import {commonRequest} from '@/api/api-strategy'
    export default {
      name: "index",
      components: {
        Header
      },
      data() {
        return{
         list:[]
        }
      },
      mounted(){
       this.getalertmsg()
      },
      methods:{
        getalertmsg(){
          commonRequest('alertmsg').then(res=>{
            if(res.code == '200'){
              this.list = res.data.data
            }
          })
        }
      }
    }
</script>
<style scoped lang="scss">
.news-box{
  ul{
    padding:0.1rem 0.3rem;
  }
  li{
    color:rgba(240,240,240,1);
    padding:0.24rem 0.6rem;
    margin-bottom:0.2rem;
    background:#181820;
    border-radius:6px;
    span{
      font-size:0.28rem;
      padding-right:0.1rem;
    }
    i{
      padding:0.05rem 0.1rem;
      background:#FF1E3C;
      font-size:0.12rem;
      border-radius:4px;
    }
    p{
      padding:0.1rem 0;
      text-indent:0.4rem;
      font-size:0.18rem;
      color:#969696;
      line-height:0.4rem;
    }
  }
}

</style>
