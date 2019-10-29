<template>
  <div class="pages-home">
    <Header title="行情" :issearch="true" :searchUrl="searchs"></Header>
    <van-tabs v-model="active" swipeable :line-width="width" @click=switchShares>
      <van-tab title="沪深">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div class="host-shares">
          <h3>热门概念<img src="/static/img/jt.png" alt="箭头" @click="sharesList"></h3>
          <ul class="flex-around host-shares-page">
            <li>
              <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
              <p class="shares-name">海南旅游岛</p>
              <p class="shares-quotation" style="color: #FF1E3C">5.63%</p>
              <p class="shares-upsdows" style="color: #FF1E3C">国旅</p>
            </li>
            <li>
              <p class="shares-name">海南旅游岛</p>
              <p class="shares-quotation" style="color: #28F064">4.38%</p>
              <p class="shares-upsdows" style="color: #28F064">海峡股份</p>
            </li>
            <li>
              <p class="shares-name">海南旅游岛</p>
              <p class="shares-quotation" style="color: #28F064">4.37%</p>
              <p class="shares-upsdows" style="color: #28F064">吉视传媒</p>
            </li>
          </ul>
        </div>
        <div class="host-shares">
          <h3>热门概念<img src="/static/img/jt.png" alt="箭头" @click="sharesList"></h3>
          <ul class="flex-around host-shares-page">
            <li>
              <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
              <p class="shares-name">海南旅游岛</p>
              <p class="shares-quotation" style="color: #FF1E3C">5.63%</p>
              <p class="shares-upsdows" style="color: #FF1E3C">国旅</p>
            </li>
            <li>
              <p class="shares-name">三网融合</p>
              <p class="shares-quotation" style="color: #28F064">4.38%</p>
              <p class="shares-upsdows" style="color: #28F064">海峡股份</p>
            </li>
            <li>
              <p class="shares-name">三沙</p>
              <p class="shares-quotation" style="color: #28F064">4.37%</p>
              <p class="shares-upsdows" style="color: #28F064">吉视传媒</p>
            </li>
          </ul>
        </div>
        <!--<div class="host-shares">-->
        <!--<h3>热门概念<img src="/static/img/jt.png" alt="箭头" @click="sharesList"></h3>-->
        <!--<ul class="flex-around host-shares-page">-->
        <!--<li>-->
        <!--&lt;!&ndash;<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>&ndash;&gt;-->
        <!--<p class="shares-name">海南旅游岛</p>-->
        <!--<p class="shares-quotation" style="color: #FF1E3C">5.63%</p>-->
        <!--<p class="shares-upsdows" style="color: #FF1E3C">国旅</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="shares-name">三网融合</p>-->
        <!--<p class="shares-quotation" style="color: #28F064">4.38%</p>-->
        <!--<p class="shares-upsdows" style="color: #28F064">海峡股份</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="shares-name">三沙</p>-->
        <!--<p class="shares-quotation" style="color: #28F064">4.37%</p>-->
        <!--<p class="shares-upsdows" style="color: #28F064">吉视传媒</p>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</div>-->
        <!--<div class="host-shares">-->
        <!--<h3>热门概念<img src="/static/img/jt.png" alt="箭头" @click="sharesList"></h3>-->
        <!--<ul class="flex-around host-shares-page">-->
        <!--<li>-->
        <!--&lt;!&ndash;<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>&ndash;&gt;-->
        <!--<p class="shares-name">海南旅游岛</p>-->
        <!--<p class="shares-quotation" style="color: #FF1E3C">5.63%</p>-->
        <!--<p class="shares-upsdows" style="color: #FF1E3C">国旅</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="shares-name">三网融合</p>-->
        <!--<p class="shares-quotation" style="color: #28F064">4.38%</p>-->
        <!--<p class="shares-upsdows" style="color: #28F064">海峡股份</p>-->
        <!--</li>-->
        <!--<li>-->
        <!--<p class="shares-name">三沙</p>-->
        <!--<p class="shares-quotation" style="color: #28F064">4.37%</p>-->
        <!--<p class="shares-upsdows" style="color: #28F064">吉视传媒</p>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</div>-->
      </van-tab>
      <van-tab title="港股">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">热门概念</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in HongKongList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price || 0 }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,8)">{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="ETF">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">热门概念</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in etfproductList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,6)">{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
    <Footer></Footer>
  </div>
</template>
<script>
  import Header from '../../components/Header'
  import Footer from '../../components/Footer'
  import {commonRequest} from '../../api/api-home'
  export default {
    name: 'strategy',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        timer:'',
        marketData: [],
        searchs: '/search', // 查询
        HongKongList: [], // 港股列表
        etfproductList: [], //ETF列表
        width:30,
        active: 0,
        sharesup: 0,
        pricesrc: '/static/img/px.png',
        updouwsrc: '/static/img/px.png',
        industryList:[] ,// 热门行业
        classification: [] // 热门分类

      }
    },
    created () {
      this.active=this.$route.query.index||0
      if(this.active == '0'){
      }else if(this.active == '1'){
        this.hksearch()
      }else (
        this.etfproduct()
      )
      // 热门行业
      this.host('0')
      // 热门概念
      this.host('1')
      this.updateMarketIndex()
      this.timer = setInterval(this.updateMarketIndex, 5000)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      // 获取大盘数据
      updateMarketIndex () {
        let indexData = []
        let sc = document.createElement('script')
        sc.onload = () => {
          document.getElementsByTagName('head')[0].removeChild(sc)
          sc = null
          if (window.hq_str_s_sh000001) {
            let t = window.hq_str_s_sh000001.split(',')
            indexData.push({stock_code: 'sh000001', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          if (window.hq_str_s_sz399001) {
            let t = window.hq_str_s_sz399001.split(',')
            indexData.push({stock_code: 'sz399001', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          if (window.hq_str_s_sz399006) {
            let t = window.hq_str_s_sz399006.split(',')
            indexData.push({stock_code: 'sz399006', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          this.marketData=indexData
        }
        sc.src = 'https://bd-hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sz399006,int_hangseng,b_HSCEI,b_HSCCI'
        document.getElementsByTagName('head')[0].appendChild(sc)
      },
      // 判断搜索类型
      switchShares(index,title) {
        this.$router.push({name: 'home',query:{index: index}})
        //  if (index=='0') {
        //    // this.searchs='/search?type=0'
        //  }else if(index=='1'){
        //   // this.searchs='/search?type=1'
        //   this.hksearch()
        // }else if(index=='2'){
        //    // this.searchs='/search?type=2'
        //   this.etfproduct()
        // }
      },
      // 股票点买点卖sell_type，1是T+0,0是其他的
      goStrategy(stock,key) {
        this.$router.push({name:'strategy', query: {stock_code: stock.stock_code,sell_type: 1, key: key,index:0}})
      },
      // 港股列表
      hksearch() {
        commonRequest('hksearch', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.HongKongList = res.data.page_data
          }
        })
      },
      // 热门行业与热门概念
      host(a) {
        commonRequest('hot', {
          keyword: a
        }).then(res => {
          if (res.code === 200 && a=='0') {
            this.industryList=res.data.page_data
          }else {
            this.classification=res.data.page_data
          }
        })
      },
      // ETF列表
      etfproduct() {
        commonRequest('etfproduct', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.etfproductList = res.data.page_data
          }
        })
      },
      // 热门概念
      sharesList() {
        this.$router.push('/host_shares')
      },
      // 排序
      rsortKey(array, key) {
        // 价格
        if(key == 'price'){
          if(this.pricesrc == '/static/img/px.png'|| this.pricesrc == '/static/img/jpx.png'){
            this.pricesrc = '/static/img/spx.png'
            this.updouwsrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x = a[key]
              var y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.pricesrc == '/static/img/spx.png'){
            this.pricesrc = '/static/img/jpx.png'
            this.updouwsrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x = b[key]
              var y = a[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
        }else {
          if(this.updouwsrc == '/static/img/px.png'|| this.updouwsrc == '/static/img/jpx.png'){
            this.updouwsrc = '/static/img/spx.png'
            this.pricesrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x = a[key]
              var y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.updouwsrc == '/static/img/spx.png'){
            this.updouwsrc = '/static/img/jpx.png'
            this.pricesrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x = b[key]
              var y = a[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
        }
        return array.sort(function (a, b) {
          var x = b[key]
          var y = a[key]
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .flex-between{
    display: flex;
    justify-content: space-between;
  }
  .flex-around{
    display: flex;
    justify-content: space-around;
  }
  .pages-home{
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .shares-top{
      margin-top: 0.2rem;
      font-size: 0.28rem;
      li{
        box-sizing: border-box;
        width:2.22rem;
        height:1.9rem;
        padding: 0.3rem 0.2rem;
        background:rgba(24,24,32,1);
        border-radius:0.12rem;
        .shares-name{
          font-size:0.28rem;
          color:rgba(255,255,255,1);
          line-height:0.40rem;
        }
        .shares-quotation{
          font-size:0.36rem;
          margin: 0.1rem 0;
          color:rgba(255,30,60,1);
          line-height:0.42rem;
        }
        .shares-upsdows{
          font-size:0.24rem;
          color:rgba(255,30,60,1);
          line-height:0.28rem;
          span:nth-child(1){
            margin-right: 0.12rem;
          }
        }
      }
    }
    .host-shares{
      border-radius: 0.12rem;
      padding: 0 0.2rem;
      background:rgba(24,24,32,1);
      h3{
        font-size:0.24rem;
        font-weight:400;
        color:rgba(150,150,150,1);
        line-height:0.34rem;
        border-bottom: 1px solid rgba(50,50,60,1);
        margin: 0.2rem 0;
        padding: 0.2rem 0;
        img{
          float: right;
          width: 0.4rem;
        }
      }
      .host-shares-page{
        li{
          flex: 1;
          padding-bottom: 0.3rem;
          .shares-name{
            font-size:0.28rem;
            color:rgba(255,255,255,1);
            line-height:0.4rem;
          }
          .shares-quotation{
            font-size:0.28rem;
            margin: 0.1rem 0 0.18rem;
            color:rgba(40,240,100,1);
            line-height:0.32rem;
          }
          .shares-upsdows{
            font-size: 0.22rem;
            color:rgba(150,150,150,1);
            line-height:0.32rem;
          }
        }
      }
    }
    .hong-kong-stocks{
      h3{
        padding: 0.4rem 0 0.2rem 0;
        border-bottom: 1px solid rgba(50,50,60,1);
        margin-bottom: 0.32rem;
        span{
          position: relative;
          color:rgba(150,150,150,1);
          font-size: 0.24rem;
          line-height: 0.34rem;
        }
        .hong-kong-name{
          width: 2.18rem;
        }
        .hong-kong-price{
          width: 1.1rem;
          text-align: right;
          margin-right: 0.4rem;
        }
        .hong-kong-updouws{
          width: 1.2rem;
          text-align: right;
        }
        .hong-kong-operation{
          flex: 1;
        }
        img{
          position: absolute;
          width: 0.24rem;
          top: 0.04rem;
          z-index: 20;
        }
      }
      .hong-kong{
        li{
          font-size: 0.28rem;
          margin-bottom: 0.7rem;
          .hong-kong-name{
            width: 2.18rem;
            span:nth-child(1){
              display: block;
              line-height: 0.4rem;
              margin-bottom: 0.08rem;
            }
            span:nth-child(2){
              display: block;
              font-size: 0.24rem;
              line-height:0.28rem;
              color:rgba(150,150,150,1);
            }
          }
          .hong-kong-price{
            width: 1.1rem;
            margin-right: 0.4rem;
            text-align: right;
            font-size: 0.32rem;
          }
          .hong-kong-updouws{
            position: relative;
            width: 1.2rem;
            text-align: right;
            font-size: 0.32rem;
            line-height: 0.38rem;
            span{
              display: inline-block;
              width: 1.2rem;
              text-align: right;
              color:rgba(255,10,10,1);
            }
          }
          .hong-kong-operation{
            position: relative;
            flex: 1;
            button{
              position: absolute;
              padding: 0;
              width:1.4rem;
              height:0.5rem;
              color:rgba(255,225,49,1);
              font-size: 0.24rem;
              text-align: center;
              border-radius:0.08rem;
              border:1px solid rgba(255,225,49,1);
              background-color: #0E0F19;
            }
            button:nth-child(1){
              right: 0;
              top:-0.12rem;
            }
            button:nth-child(2){
              right: 0;
              top:0.5rem;
            }
          }
        }
      }
    }
  }
</style>
