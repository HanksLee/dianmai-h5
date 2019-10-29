<template>
  <div class="pages-con">
    <div class="header">
      <Header title="订单详情"></Header>
      <a class="fh" href="javascript:history.go(-1)"><img src="static/img/fh.png" alt=""></a>
    </div>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <div class="orderDetails">
     <div class="orderDetails1">
       <van-row v-if="detail.stock_type == '1'">
         <strong>交易品种</strong>
         <span style="color:rgb(255, 225, 49);">指数.</span>
       </van-row>
       <van-row v-if="detail.stock_type == '2'">
         <strong>交易品种</strong>
         <span style="color:rgb(255, 225, 49);">指数</span>
       </van-row>
        <van-row>
        <van-col span="24" v-if="detail.market_id == '0'">
          <strong>交易市场</strong>
          <span style="width:4rem;">上证 <em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '1'">
          <strong>交易市场</strong>
          <span style="width:4rem;">深圳主板 <em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '2'">
          <strong>交易市场</strong>
          <span style="width:4rem;">深圳创业板<em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '3'">
          <strong>交易市场</strong>
          <span style="width:4rem;">港股<em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '4'">
          <strong>交易市场</strong>
          <span style="width:4rem;">美股<em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '5'">
          <strong>交易市场</strong>
          <span style="width:4rem;">ETF<em v-if="detail.stop_redeem_rate >0" style="color:rgb(255, 225, 49)">(停牌)</em></span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '6'">
          <strong>交易市场</strong>
          <span style="width:4rem;">上期所</span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '7'">
          <strong>交易市场</strong>
          <span style="width:4rem;">大商所</span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '8'">
          <strong>交易市场</strong>
          <span style="width:4rem;">郑商所</span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '9'">
          <strong>交易市场</strong>
          <span style="width:4rem;">中金所</span>
        </van-col>
        <van-col span="24" v-if="detail.market_id == '10'">
          <strong>交易市场</strong>
          <span style="width:4rem;">上期能源</span>
        </van-col>
        <van-col span="24" v-if="detail.open_rate > 0 && detail.market_id == '3' || detail.market_id == '4'" style="margin-top:0.3rem;">
          <strong>开仓/{{textFn()}}汇率</strong>
          <span>{{detail.open_rate || 0}}/{{detail.close_rate || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong>股票名称</strong>
          <span>{{detail.stock_name}}</span>
        </van-col>
        <van-col span="12">
          <strong>股票代码</strong>
          <span>{{detail.stock_code}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong>资金配比</strong>
          <span>{{detail.leverage || 0}}</span>
        </van-col>
        <van-col span="12">
          <strong>{{bond_name}}</strong>
          <span v-if="url1 == 'huifengstocks.com'||url1 == 'huachihk.com'">HK${{Number(detail.init_margin).toFixed(2) || 0}}</span>
          <span v-else>￥{{Number(detail.init_margin).toFixed(2) || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong>产品类型</strong>
          <span>{{detail.policy_type}}</span>
        </van-col>
        <van-col span="12">
          <strong>获利金额</strong>
          <span v-if="url1 == 'huifengstocks.com'||url1 == 'huachihk.com'">HK${{Number(detail.huoli).toFixed(2) || 0}}</span>
          <span v-else>￥{{Number(detail.huoli).toFixed(2) || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="16" v-if="detail.market_id == '6' || detail.market_id == '7' || detail.market_id == '8' || detail.market_id == '9' || detail.market_id == '10'">
          <strong style="width:2.2rem;">最低操作资金比率</strong>
          <span style="width:1.941rem;">{{((Number(detail.margin.margin_rate)) * 100).toFixed(2) || 0}}%</span>
        </van-col>
      </van-row>
      </div>
    <div class="orderDetails2">
      <van-row>
        <van-col span="12">
          <strong>方向</strong>
          <span v-text="Number(detail.cmd) === 0 ? text_con.text1:text_con.text2"></span>
        </van-col>
        <van-col span="12">
          <strong>开仓时间</strong>
          <span>{{assign_time}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong v-if="domainFn()">开仓价格</strong>
          <strong v-else>开仓均价</strong>
          <span v-if="detail.market_id == 3">HK${{Number(detail.open_price) || 0}}</span>
          <span v-else-if="detail.market_id == 4">${{Number(detail.open_price) || 0}}</span>
          <span v-else>￥{{Number(detail.open_price) || 0}}</span>
        </van-col>
        <van-col span="12">
          <strong>持有数量</strong>
          <span>{{detail.volume || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong>开仓金额</strong>
          <span v-if="detail.market_id == 3">HK${{Number(detail.open_market_value).toFixed(3) || 0}}</span>
          <span v-else-if="detail.market_id == 4">${{Number(detail.open_market_value).toFixed(3) || 0}}</span>
          <span v-else>￥{{Number(detail.open_market_value).toFixed(3) || 0}}</span>
        </van-col>
        <van-col span="12">
          <strong>可用数量</strong>
          <span>{{detail.left_volume || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12" v-if="detail.close_time">
          <strong>{{textFn()}}时间</strong>
          <span>{{close_time}}</span>
        </van-col>
        <van-col span="12" v-if="detail.close_price">
          <strong v-if="domainFn()">{{textFn()}}价格</strong>
          <strong v-else>{{textFn()}}均价</strong>
          <span v-if="detail.market_id == 3">HK${{detail.close_price || 0}}</span>
          <span v-else>￥{{detail.close_price || 0}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <strong>转让盈亏</strong>
          <span style="color:#FFE131" v-if="detail.market_id == 3" @click="seeYk">HK${{detail.close_profit || 0}}<em class="wh">?</em></span>
          <span style="color:#FFE131" v-else @click="seeYk">￥{{detail.close_profit || 0}}<em class="wh">?</em></span>
        </van-col>
        <van-col span="12" v-if="detail.market_id == '6' || detail.market_id == '7' || detail.market_id == '8' || detail.market_id == '9' || detail.market_id == '10'">
          <strong>每手单位</strong>
          <span>{{detail.lots_size || 0}}</span>
        </van-col>
      </van-row>
      <div v-if="tp_sl_witch == '0'">
        <van-row v-if="Number(detail.tp_money) > 0 || Number(detail.sl_money) > 0">
          <van-col span="12">
            <strong>止盈</strong>
            <span v-if="detail.market_id == '3'">HK${{detail.tp_money || 0}}</span>
            <span v-else>￥{{detail.tp_money || 0}}</span>
          </van-col>
          <van-col span="12">
            <strong>止损</strong>
            <span v-if="detail.market_id == '3'">HK$-{{detail.sl_money || 0}}</span>
            <span v-else>￥-{{detail.sl_money || 0}}</span>
          </van-col>
        </van-row>
      </div>
      <div v-else>
        <van-row v-if="Number(detail.sl) >0 || Number(detail.tp) >0">
          <van-col span="12" v-if="Number(detail.tp) >0">
            <strong>止盈价</strong>
            <span v-if="detail.market_id == '3'">HK${{Number(detail.tp) || 0}}</span>
            <span v-else>￥{{Number(detail.tp) || 0}}</span>
          </van-col>
          <van-col span="12" v-if="Number(detail.sl) >0">
            <strong>止损价</strong>
            <span v-if="detail.market_id == '3'">HK${{Number(detail.sl) || 0}}</span>
            <span v-else>￥{{Number(detail.sl) || 0}}</span>
          </van-col>
        </van-row>
      </div>
      <van-row v-if='showCurent'>
        <van-col span="12">
          <strong>当前价格</strong>
          <span style="color:#FFE131" v-if="detail.market_id == 3">HK${{Number(detail.now_price) || 0}}</span>
          <span style="color:#FFE131" v-else>￥{{Number(detail.now_price) || 0}}</span>
        </van-col>
        <van-col span="12">
          <strong>当前市值</strong>
          <span v-if="detail.market_id == 3">HK${{Number(detail.now_market_value).toFixed(2) || 0}}</span>
          <span v-else>￥{{Number(detail.now_market_value).toFixed(2) || 0}}</span>
        </van-col>
      </van-row>
      <van-row v-if='showCurent'>
        <!-- <van-col span="12">
          <strong>当前盈亏</strong>
          <span v-if="detail.market_id == '3'" :style="{color:detail.valueColor}">HK${{Number(detail.now_profit).toFixed(2) || 0}}</span>
          <span v-else :style="{color:detail.valueColor}">￥{{Number(detail.now_profit).toFixed(2) || 0}}</span>
        </van-col> -->
        <van-col span="12" v-if="Number(detail.now_profit) > 0">
          <strong>当前盈亏</strong>
          <span v-if="detail.market_id == '3'" style="color:#f00;">HK${{Number(detail.now_profit).toFixed(2) || 0}}</span>
          <span v-else style="color:#f00;">￥{{Number(detail.now_profit).toFixed(2) || 0}}</span>
        </van-col>
        <van-col span="12" v-else-if="Number(detail.now_profit) === 0">
          <strong>当前盈亏</strong>
          <span v-if="detail.market_id == '3'">HK${{Number(detail.now_profit).toFixed(2) || 0}}</span>
          <span v-else>￥{{Number(detail.now_profit).toFixed(2) || 0}}</span>
        </van-col>
        <van-col span="12" v-else>
          <strong>当前盈亏</strong>
          <span v-if="detail.market_id == '3'" style="color:rgb(40, 240, 100);">HK${{Number(detail.now_profit).toFixed(2) || 0}}</span>
          <span v-else style="color:rgb(40, 240, 100);">￥{{Number(detail.now_profit).toFixed(2) || 0}}</span>
        </van-col>
      </van-row>
    </div>
    <div class="orderDetails3" v-if="detail.stock_type == '0'">
      <p>买入费用 = 手续费+管理费+券商代扣 = <em v-if="detail.market_id == 3">({{detail.buy_commission}}+{{detail.service_fee}}+{{detail.buy_securities_fee}})=HK${{getBuyFee() || 0}}</em>
      <em v-else>({{detail.buy_commission}}+{{detail.service_fee}}+{{detail.buy_securities_fee}})=￥{{getBuyFee() || 0}}</em></p>
      <p>卖出费用 = 手续费+券商代扣 =  <em v-if="detail.market_id == 3">({{detail.sell_commission}}+{{detail.sell_securities_fee}})=HK${{getSellFee() || 0}}</em>
      <em v-else>({{detail.sell_commission}}+{{detail.sell_securities_fee}})=￥{{getSellFee() || 0}}</em></p>
      <p>递延费/递延天数 = 
      <em v-if="detail.market_id == 3">HK${{parseFloat(detail.delay_fee).toFixed(2) || 0}}/{{detail.delay_days}}</em>
      <em v-else>￥{{parseFloat(detail.delay_fee).toFixed(2) || 0}}/{{detail.delay_days}}</em>
      </p>
      <p v-if="url1 !== 'ruthinks.com'">平台盈利分成 = 
        <em v-if="detail.market_id == 3">HK${{parseFloat(detail.real_div_profit).toFixed(2) || 0}}</em>
        <em v-else>￥{{parseFloat(detail.real_div_profit).toFixed(2) || 0}}</em>
      </p>
      <p v-if="detail.stop_redeem_rate >0">停牌赎回手续费=<em v-if="detail.market_id == 3">￥{{parseFloat(detail.stop_fee).toFixed(2)}}</em>
      <em v-else>￥{{parseFloat(detail.stop_fee).toFixed(2)}}</em></p>
      <p v-if="detail.stop_redeem_rate >0">停牌赎回费率=
      <em>{{parseFloat((1-Number(detail.stop_redeem_rate))*100).toFixed(2)}}%</em></p>
    </div>
    <div class="orderDetails3" v-if="detail.stock_type == '1' || detail.stock_type == '2'">
      <p>买入手续费：<em v-if="detail.market_id == 3">HK${{detail.buy_commission || 0}}</em>
      <em v-else>￥{{detail.buy_commission || 0}}</em></p>
      <p>卖出手续费：<em v-if="detail.market_id == 3">HK${{detail.sell_commission || 0}}</em>
      <em v-else>￥{{detail.sell_commission || 0}}</em></p>
      <p>递延费/递延天数:
      <em v-if="detail.market_id == 3">HK${{parseFloat(detail.delay_fee).toFixed(2) || 0}}/{{detail.delay_days}}</em>
      <em v-else>￥{{parseFloat(detail.delay_fee).toFixed(2) || 0}}/{{detail.delay_days}}</em>
      </p>
    </div>
   </div>
   </van-pull-refresh>
   <Loading :loading="loading"></Loading>
   <!-- 转让盈亏-->
    <van-dialog v-model="showY">
      <div
        class="title"
        style="text-align:center;font-size:0.3rem;margin-bottom:0.16rem;padding-bottom:0.3rem;border-bottom:1px solid #efefef;"
      >转让盈亏</div>
      <div class="con">
        <van-row>
          <van-col span="24" style="text-align:Center;">股票价格按市价撮合成交，成交后开仓、平仓价格会有4~5位的小数，但价格只显示3位小数，故按开仓、平仓价计算盈亏会有出入，但此盈亏已包含小数点盈亏</van-col>
        </van-row>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import Header from '../../components/Header'
// import Footer from '../../components/Footer'
import Loading from '@/components/Loading'
import { commonRequest } from '../../api/api-strategy'
// var timer = null
export default {
   components: {
    Header,
    // Footer,
    Loading
  },
  data () {
    return {
      showY:false,
      loading: false,
      url: null,
      query: {},
      detail: {},
      url1: null,
      tp_sl_witch:0,
      assign_time: '',
      close_time:'',
      text_con: {},
      showCurent:false,
      timer:null,
      stock_key:'',
      bond_name:'操作资金'
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  mounted () {
    this.text_con = this.textFn1()
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url1 = firstDomain;
    if(this.url1=='huachihk.com'||this.url1=='huifengstocks.com'){
        this.bond_name='冻结资金'
    }else{
        this.bond_name='操作资金'
    }
    this.query = this.$route.query || {}
    if(this.query.type == '1'){
      this.url = 'posdetail';
      this.showCurent=true;
    }
    if(this.query.type == '2'){
      if(this.timer){
         window.clearInterval(this.timer)
      }
      this.url = 'hisdetail'
      this.showCurent=false;
    }
    this.getDetail2(true)
    if(this.query.type == '1'){
      if(firstDomain == 'liangrong-fund.com' || firstDomain == 'boloniasia.com' || firstDomain == 'raytekasia.com'|| firstDomain == 'acarpsgroup.com'){
          this.getRefreshTime()
      }else{
          this.refreshOtherData()
      }
    }
  },
  methods: {
    //查看盈亏计算介绍
    seeYk(){
     this.showY = true
    },
   onRefresh(){
     this.getDetail2(true)
   },
   refreshOtherData(){
        var self=this
        var count=0
        this.timer = setInterval(function(){
          count++;
          // that.getDetail2(false)
          self.updateData()
          if(count>200){
            count=0;
            window.clearInterval(self.timer)
            self.getDetail2(false)
            self.refreshOtherData()
          }
        }, 10000)
   },
    getRefreshTime(){
      commonRequest('list',{

      }).then(res=>{
        if(res.code==200){
          var count=0
          var time=Number(res.data.time_t)*1000
          var self=this
          this.timer = setInterval(function(){
            // self.getDetail2(false)
            count++;
            self.updateData()
            if(count>200){
              count=0
              window.clearInterval(self.timer)
              self.getDetail2(false)
              self.getRefreshTime()
            }
          }, time)
        }
      })
    },
   updateData(){
     commonRequest('price',{
       stock_key:this.stock_key
     }).then(res=>{
       if(res.code==200){
        //console.info('获取更新数据成功')
        var str='￥'
        if(this.detail.market_id == '3'){
            str='HK$'
        }
        //更新当前价格
        this.detail.now_price=res.data[0].now_price
        //根据报价更新盈亏
        if(this.detail.cmd==0){
          this.detail.now_profit=(Number(res.data[0].now_price)-Number(this.detail.open_price))*Number(this.detail.left_volume)*Number(this.detail.pip_value)
        }else{
          this.detail.now_profit=(Number(this.detail.open_price)-Number(res.data[0].now_price))*Number(this.detail.left_volume)*Number(this.detail.pip_value)
        }
        //更新当前市值
        this.detail.now_market_value=Number(res.data[0].now_price)*Number(this.detail.left_volume)*Number(this.detail.pip_value)
        this.detail.valueColor=this.getValueColor(this.detail.now_profit)
       }
     })
   },
   getValueColor(value){
     if(value>0){
       return '#f00'
     }else{
       return 'rgb(40, 240, 100)'
     }
   },
   getDetail2(val){
     this.loading = val
     commonRequest(this.url,{
       id: this.query.id
     }).then(res =>{
       this.loading = false
       if(res.code == '200'){
         this.detail = res.data
         if(this.url1 == 'dingmaohongsheng.com'){
          this.assign_time= res.data.assign_time.substring(0,16)
          this.close_time=res.data.close_time.substring(0,16)
         }else{
          this.assign_time= res.data.assign_time
          this.close_time=res.data.close_time
         }
         this.tp_sl_witch = this.detail.organ.tp_sl_witch
         this.stock_key=this.detail.stock_key
         this.detail.valueColor=this.getValueColor(this.detail.now_profit)
       }
     })
   },
   getBuyFee(){
     return (Number(this.detail.buy_commission) + Number(this.detail.service_fee) + Number(this.detail.buy_securities_fee)).toFixed(2)
   },
   getSellFee(){
     return (Number(this.detail.sell_commission) + Number(this.detail.sell_securities_fee)).toFixed(2)
   }
  }
}
</script>
<style scoped lang="scss">
 .header{
  position:fixed;
  top: 0;
  left:50%;
  margin-left:-3.75rem;
  height:1.1rem;
  width:100%;
  background:#0E0F19;
  text-align:center;
  max-width:750px;
  z-index:100;
 }
 .pages-con{
   color: #fff;
   padding-bottom:1.5rem;
   padding-top:1.32rem;
 }
 .orderDetails{
   padding:0 0.24rem;
   .van-row{
     margin-bottom:0.3rem;
   }
   strong{
      font-size:0.26rem;
      font-weight:normal;
      color:#969696;
      width:1.2rem;
      float:left;
      margin-right:0.16rem;
    }
    span{
     font-size:0.26rem;
     float:left;
     width:2.141rem;
    }
 }
 .orderDetails1,.orderDetails2{
   border-bottom:1px solid #32323C;
   padding-bottom: 0.1rem;
   margin-bottom:0.4rem;
 }
 .orderDetails3{
   p{
     color:#969696;
     font-size:0.26rem;
     margin-bottom:0.3rem;
     em{
       color:#fff;
     }
   }
 }
 .fh{
   position:absolute;
   bottom:0.12rem;
   left:0.18rem;
   img{
     width:0.27rem;
     height:0.47rem;
   }
 }
 .wh{
   margin-left:0.1rem;border:1px solid #FFE131;border-radius:50%;width:0.3rem;height:0.3rem;
   text-align:center;
   line-height:0.3rem;
   display:inline-block;
 }

</style>
