<template>
  <div class="balance">
    <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50" infinite-scroll-immediate-check="false">
      <li style="border-bottom:none;text-align:center;color:#969696;font-size:0.26rem;" v-if="myhistoryData.length === 0">
        <p>没有结算订单</p>
      </li>
      <li v-for="(item,index) in myhistoryData" :key="index">
         <div class="title"><i style="width:0.6rem;height:0.6rem;text-align:center;line-height:0.6rem;display: inline-block;font-size:0.32rem;border-radius:50%;background:#FFE131;color:#000;margin-right:0.1rem;">{{index+1}}</i>{{item.stock_name}}({{item.stock_code}})
         <em v-if="item.stock_type == '2'" style="color:#FFE131;padding-left:0.07rem;">(指数)</em><em v-if="item.stock_type == '1'" style="color:#FFE131;padding-left:0.07rem;">(指数.)</em></div>
          <div class="balance-con">
            <van-row>
              <van-col span="12">
                <strong>订单号</strong>
                <span>{{item.id}}</span>
              </van-col>
            </van-row>
            <van-row>
            <van-col span="12">
              <strong>{{bond_name}}</strong>
              <span @click="tipsFn">{{item.init_margin}}<i style="margin-left:0.06rem;;color:#28f064;font-size:0.24rem;padding:0 0.1rem;border-radius:50%;border: 1px solid #28f064;display:inline-block;">?</i></span>
            </van-col>
            <van-col span="12">
              <strong>开</strong>
              <span v-if="item.market_id == '3'">HK${{item.open_price || 0}}</span>
              <span v-else>￥{{item.open_price || 0}}</span>
            </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <strong>数量</strong>
                <span>{{item.volume || 0}}</span>
              </van-col>
              <van-col span="12">
                <strong>平</strong>
                <span v-if="item.market_id == '3'">HK${{item.close_price || 0}}</span>
                <span v-else>￥{{item.close_price || 0}}</span>
              </van-col>
          </van-row>
          <van-row>
              <van-col span="12">
                <strong>转让盈亏</strong>
                <span v-if="item.market_id == '3'">HK${{parseFloat(item.close_profit).toFixed(2) || 0}}</span>
                <span v-else>￥{{parseFloat(item.close_profit).toFixed(2) || 0}}</span>
              </van-col>
              <van-col span="12">
                <strong>获利</strong>
                <span>{{parseFloat(item.huoli).toFixed(2) || 0}}({{(parseFloat(item.huolibi)*100).toFixed(2) || 0}}%)</span>
              </van-col>
          </van-row>
        </div>
        <div class="position-but">
          <van-row gutter="24">
            <van-col span="24">
              <div class="but-box" @click="seeDetails(item.id)">订单详情</div>
            </van-col>
          </van-row>
        </div>
      </li>
    </ul>
    <van-dialog v-model="show" showCancelButton :showConfirmButton="false" cancelButtonText="关闭">
    <div class="con" style="text-align:center;color:#fff;font-size:0.26rem;">
     操作资金等于冻结加递延
    </div>
  </van-dialog>
    <!-- 加载图标 -->
     <Loading :loading="loading"></Loading>
  </div>
</template>
<script>
import { commonRequest } from '@/api/api-strategy'
import Loading from '@/components/Loading'
export default {
  name: 'Balance',
  components: {
     Loading
   },
  data () {
    return {
    loading: false,
    myhistoryData: [],
    assetData:{},
    show: false,
    busy: false,
    page: 1,
    isEnd: false,
    page_count: 1,
    pageSize: 10,
    bond_name:'操作资金'
    }
  },
  mounted () {
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    if(firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'){
        this.bond_name='冻结资金'
    }else{
        this.bond_name='操作资金'
    }
    this.getMyhistory()
    // this.getuserMoney()
  },
  methods: {
     //获取持仓策略
    getMyhistory(){
      this.loading = true
      commonRequest('myhistory',{
        page_no:  this.page,
        page_size: this.pageSize
      }).then(res =>{
        if(res.code == '200'){
          this.page += 1
          this.page_count = res.data.page.page_count
          if(this.page > this.page_count){
            this.isEnd = true
          }
          let myhistoryData = res.data.page_data
          this.myhistoryData = [...this.myhistoryData, ...myhistoryData]
          this.loading = false
          this.busy = false
        }else{
          this.loading = false
          this.busy = false
        }
      })
    },
    loadMore () {
        // console.log(this.isEnd)
        if (this.isEnd) return
        this.busy = true
        this.getMyhistory()
    },
   seeDetails(id){
      this.$router.push({name:'orderDetails', query: {id: id, type: 2 }})
    },
    //获取净资产等
    getuserMoney(){
      commonRequest('userMoney').then(res=>{
        if(res.code == '200'){
          this.assetData = res.data
        }
      })
    },
    //查看操作资金
    tipsFn(){
      this.show = true
    }
  }
}
</script>
<style scoped lang="scss">

  .title{
    font-size:0.32rem;
    margin-bottom:0.42rem;
  }
  .balance{
    height:100vh;
    li{
      border-bottom:1px solid #32323C;
      margin-bottom:.5rem;
      &:nth-last-of-type(1){
        margin-bottom:1rem;
      }
    }
    .balance-con{
      border-bottom:1px solid #32323C;
      padding-bottom:0.4rem;
      margin-bottom:0.4rem;
    }
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
    }
    .info{
      color:#969696;
      font-size:0.24rem;
    }
    .but-box{
      height:0.9rem;
      line-height:0.9rem;
      text-align:center;
      border-radius:4px;
      color:#FFE131;
      border:1px solid #FFE131;
      font-size:0.32rem;
    }
  }
</style>
