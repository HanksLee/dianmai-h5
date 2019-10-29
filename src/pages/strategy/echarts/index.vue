<template>
  <div class="echarts">
    <div class="tab-box"><span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span></div>
    <timeSharing :stock_code="stock_code" :stockDetail="stockDetail" v-if="isSwitch"></timeSharing>
    <kLine :stock_code="stock_code" :stockDetail="stockDetail" v-if="!isSwitch"></kLine>
    <div class="detailed">
      <van-row>
        <van-col span="8">
          <span class="item">今开</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.open_price}}</span>
        </van-col>
        <van-col span="8">
          <span class="item">最高</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.high_price}}</span>
        </van-col>
        <van-col span="8">
          <span class="item">最低</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.low_price}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="8" v-if="stockDetail.market_id !== 3">
          <span class="item">涨停</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.limit_max}}</span>
        </van-col>
        <van-col span="8" v-if="stockDetail.market_id !== 3">
          <span class="item">跌停</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.limit_min}}</span>
        </van-col>
        <van-col span="8">
          <span class="item">振幅</span>
          <span>{{stockDetail.suspend_status == 1 ? '--' : Number(stockDetail.swing).toFixed(3)+'%'}}</span>
        </van-col>
      </van-row>
     </div>
     <!--港股，指数，指数.不显示-->
     <div class="offer" v-if="stockDetail.market_id !== 3 && stockDetail.stock_type == '0'&&stockDetail.market_id !== 6&&stockDetail.market_id !== 7&&stockDetail.market_id !== 8&&stockDetail.market_id !== 9&&stockDetail.market_id !== 10">
      <van-row>
        <van-col span="12">
          <div class="item">
            <span class="buy" v-if="stockDetail.market_id !== 6 && stockDetail.market_id !== 7 && stockDetail.market_id !== 8 && stockDetail.market_id !== 9 && stockDetail.market_id !== 10">买1</span>
            <span class="buy" v-else>买价</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_1_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_1_volume}}</span>
          </div>
          <div v-if="stockDetail.market_id !== 6 && stockDetail.market_id !== 7 && stockDetail.market_id !== 8 && stockDetail.market_id !== 9 && stockDetail.market_id !== 10">
            <div class="item">
              <span class="buy">买2</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_2_price}}</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_2_volume}}</span>
            </div>
            <div class="item">
              <span class="buy">买3</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_3_price}}</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_3_volume}}</span>
            </div>
            <div class="item">
              <span class="buy">买4</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_4_price}}</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_4_volume}}</span>
            </div>
            <div class="item">
              <span class="buy">买5</span>
              <span >{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_5_price}}</span>
              <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.buy_5_volume}}</span>
            </div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="item">
            <span class="sell" v-if="stockDetail.market_id !== 6 && stockDetail.market_id !== 7 && stockDetail.market_id !== 8 && stockDetail.market_id !== 9 && stockDetail.market_id !== 10">卖1</span>
            <span class="sell" v-else>卖价</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_1_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_1_volume}}</span>
          </div>
          <div v-if="stockDetail.market_id !== 6 && stockDetail.market_id !== 7 && stockDetail.market_id !== 8 && stockDetail.market_id !== 9 && stockDetail.market_id !== 10">
          <div class="item">
            <span class="sell">卖2</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_2_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_2_volume}}</span>
          </div>
          <div class="item">
            <span class="sell">卖3</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_3_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_3_volume}}</span>
          </div>
          <div class="item">
            <span class="sell">卖4</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_4_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_4_volume}}</span>
          </div>
          <div class="item">
            <span class="sell">卖5</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_5_price}}</span>
            <span>{{stockDetail.suspend_status == 1 ? '--' : stockDetail.sell_5_volume}}</span>
          </div>
          </div>
        </van-col>
      </van-row>
     </div>
     <div class="f10-box" v-if="stockDetail.market_id !== 3 && stockDetail.market_id !== 6 && stockDetail.market_id !== 7 && stockDetail.market_id !== 8 && stockDetail.market_id !== 9 && stockDetail.market_id !== 10 && stockDetail.stock_type == '0'">
        <van-tabs v-model="active" @change="clickTab">
          <van-tab title="盘口">
             <div class="handicap-box"><handicap :stock_code="stock_code" :capitalData="capitalData"></handicap></div>
             <div class="pillar-box"><pillar :stock_code="stock_code" :capitalData="capitalData"></pillar></div>
          </van-tab>
          <van-tab title="资讯">
             <ul class="ul-tab">
               <li @click="clickLi(1)" :class="{active:isActive1 === 1}">交易提示</li>
               <li @click="clickLi(2)" :class="{active:isActive1 === 2}">投资要点</li>
               <li @click="clickLi(3)" :class="{active:isActive1 === 3}">研报精选</li>
             </ul>
             <div class="tab-con" v-html="htmlCon" v-if="isActive1 === 1"></div>
             <div class="tab-con" v-html="htmlCon" v-if="isActive1 === 2"></div>
              <div class="tab-con" v-if="isActive1 === 3">
               <dl>
                 <dd v-for="(item,index) in great_hits" :key="index" @click="seeDetile(item.id)">{{item.title}}</dd>
               </dl>
             </div>
          </van-tab>
          <!-- <van-tab title="公告">公告</van-tab> -->
        </van-tabs>
     </div>
  </div>
</template>
<script>
import { commonRequest } from '@/api/api-strategy'
import kLine from './k-line'
import timeSharing from './time-sharing'
import handicap from './handicap'
import pillar from './pillar'
export default {
  components: {
     timeSharing,
     kLine,
     handicap,
     pillar
  },
  data () {
    return {
    active: 0,
    isSwitch: true,
    isActive: 0,
    tabData:[{
        id: 1,
        value: '分时'
      },{
        id: 2,
        value: '日K'
    }],
    stockDetailA:{},
    capitalData:{},
    htmlData:{},
    htmlCon: '',
    isActive1: 1,
    great_hits:[],
    isDetitle:false,
	}
  },
  props:{
    stock_code: String,
    stockDetail: Object,
    seeEchartsDetail:Function
  },
  mounted() {
    this.getDetail()
    this.getData()
  },
  methods: {
    //分时日k切换
     tabFn(index){
      this.isActive = index
      if(index === 0){
        this.isSwitch = true
      }else{
        this.isSwitch = false
      }
    },
    // //报价
    getDetail(){
      this.stockDetailA = this.stockDetail
    },
    clickTab(index){
      if(index === 0){
        this.getData()
      }
      if(index === 1){
        this.gettrademsg()
      }
    },
    //获取盘口
    getData(){
      commonRequest('fundflow',{
        keywords:this.stock_code
      }).then(res=>{
        if(res.code == '200'){
            this.capitalData = res.data.page_data
        }
      })
    },
    //获取资讯
    gettrademsg(){
      commonRequest('trademsg',{
        stock_code: this.stock_code
      }).then(res=>{
        if(res.code == '200'){
           this.htmlData = res.data
           this.htmlCon = this.htmlData.trade_tip
        }
      })
    },
    clickLi(index){
      this.isActive1 = index
      if(index === 1){
        this.htmlCon = this.htmlData.trade_tip
        // console.log(this.htmlCon)
      }
      if(index === 2){
        this.htmlCon = this.htmlData.invest
      }
      if(index === 3){
        this.great_hits = this.htmlData.great_hits
      }
    },
    seeDetile(id){
      this.isDetitle = true
      this.seeEchartsDetail(id)
    }
  }
}
</script>
<style scoped lang="scss">
  .tab-box{
    padding:0.2rem 0 0;
    position:relative;
    z-index:100;
    span{
      color:#969696;
      display:inline-block;
      padding:0 0.3rem;
    }
    span.active{
      color:#FFE131;
    }
  }
  .detailed{
    font-size:0;
    border-bottom:1px solid #32323C;
    padding-top:0.2rem;
    margin-bottom:0.2rem;
    .van-row{
      margin-bottom:0.2rem;
    }
    span{
     width:60%;
     display:inline-block;
     font-size:0.26rem;
     color:#FFE131;
    }
   .item{
      color:#969696;
      width:40%;

    }
  }
  .offer{
    border-bottom:1px solid #32323C;
    padding:0 0 0.2rem;
    margin-bottom:0.2rem;
    .item{
      font-size:0;
      margin-bottom:0.15rem;
      span{
        display:inline-block;
        font-size:0.26rem;
       &:nth-last-child(3){
         width:20%;
       }
       &:nth-last-child(2){
         width:35%;
         color:#FFE131;
       }
       &:nth-last-child(1){
         width:45%;
       }
      }
      .buy{
        color:#28F064;
      }
      .sell{
         color:#FF1E3C;
      }
    }

  }
  .f10-box{
    border-bottom:1px solid #32323C;
    margin-bottom:0.3rem;
  }
.handicap-box{
  margin-bottom:0.5rem;
}
.ul-tab{
  overflow: hidden;
  border-bottom:1px solid #32323C;
  padding:0 0 0.2rem;
  margin-bottom:0.2rem;
  li{
    width:33%;
    float:left;
    color:#969696;
    text-align:center;
    font-size:0.2rem;
  }
  .active{
    color:#fff;
  }
}
.tab-con{
  dl{
    dd{
      padding:0.16rem 2%;
      cursor: pointer;
      overflow:hidden;
      width:96%;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size:0.2rem;
    }
  }
}
</style>
