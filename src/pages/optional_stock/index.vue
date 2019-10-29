<template>
  <div class="pages-optional-stock">
    <Header title="自选股" :issearch="true" :searchUrl="searchs"></Header>
    <div class="flex-between">
      <div class="optional-stock-name" style="text-indent: 0.6rem">全部股票</div>
      <div class="optional-stock-price"><span>价格</span>
        <img :src="pricesrc" alt="排序" @click="rsortKey(list,'now_price')">
      </div>
      <div class="optional-stock-updouws"><span>涨跌幅</span>
        <img :src="updouwsrc" alt="排序" @click="rsortKey(list,'dif_rate')">
      </div>
    </div>
    <ul class="optional-stock">
      <li class="flex-between" v-for="(item,index) in list" :key="index" @click="tianzhuan(item)">
        <div class="optional-stock-name">
          <p class="type">
            <span v-if="item.market_id =='0'||item.market_id =='11'" style="background-color:rgb(255,25,18)">SH</span>
            <span v-if="item.market_id =='2'||item.market_id =='1'" style="background-color:rgb(255,25,18)">SZ</span>
            <span v-if="item.market_id =='3'" style="background-color:rgb(255,97,46)">HK</span>
            <span v-if="item.market_id =='4'" style="background-color:rgb(52,132,255)">US</span>
            <span v-if="item.market_id =='5'" style="background-color:rgb(255,255,50)">ETF</span>
          </p>
          <p class="namecode">
            <span>{{item.stock_name}}
              <i v-if="item.stock_type === '1'">(指数.)</i> 
              <i v-else-if="item.stock_type === '2'">(指数)</i>
            </span>
            <span>{{item.stock_code}}</span>
          </p>
        </div>
        <p class="optional-stock-price">{{ item.now_price }}</p>
        <p class="optional-stock-updouws">
          <span v-if="parseFloat(item.dif_rate)>0" :style="item.dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'">+{{parseFloat(item.dif_rate).toFixed(2)}}%</span>
          <span v-else :style="item.dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'">{{parseFloat(item.dif_rate).toFixed(2)}}%</span>
          <img class="delimg" src="/static/img/shanchu.png" alt="删除" @click.stop="dellshows(item)">
        </p>
      </li>
    </ul>
    <!--<ul style="font-size: 20px">-->
      <!--<li v-for="(stu,index) in students1" :key="index">-->
        <!--{{stu}}-->
      <!--</li>-->
    <!--</ul>-->
    <van-dialog v-model="dellshow" show-cancel-button @confirm="yesdell(item)">
      <div class="title">提示</div>
      <div class="con">确认将股票从自选中删除</div>
    </van-dialog>
    <Footer></Footer>
  </div>
</template>
<script>
  import {commonRequest} from '../../api/api-search'
  import Header from '../../components/Header'
  import Footer from '../../components/Footer'
  export default {
    name: 'strategy',
    components: {
      Header,
      Footer
    },
    data() {
      return {
        dellid: '',
        dellshow:false,
        searchs:'/search',
        pricesrc: '/static/img/px.png',
        updouwsrc: '/static/img/px.png',
        active: 0,
        sharesup: 0,
        list:  JSON.parse(sessionStorage.getItem("zixuanList"))|| [],
        stock_type: 0,
      }
    },
    created(){
      this.searchlog()
    },
    methods: {
      // 跳转
      tianzhuan(item){
        if(item.stock_type == '0' || item.stock_type === undefined){
          this.$router.push({name:'strategy', query: {stock_code: item.stock_code, key: item.market_id,index:0,stock_type:item.stock_type}})
        }else{
          this.$router.push({name:'strategy1', query: {stock_code: item.stock_code, key: item.market_id,index:0,stock_type:item.stock_type}})
        }
        
      },
      // 提示
      dellshows(item) {
        this.dellshow = true
        this.dellid=item.stock_code
        this.stock_type = item.stock_type
      },
      // 删除自选股
      yesdell() {
        commonRequest('delmystock', {
          stock_code:this.dellid,
          stock_type: this.stock_type
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.searchlog()
          }
        })
      },
      // 自选列表
      searchlog(){
        commonRequest('mystockList', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("zixuanList",JSON.stringify(res.data.page_data))
            this.list = res.data.page_data
          }
        })
      },
      // 排序
      rsortKey(array, key) {
        // 价格
        if(key == 'now_price'){
          if(this.pricesrc == '/static/img/px.png'|| this.pricesrc == '/static/img/jpx.png'){
            this.pricesrc = '/static/img/spx.png'
            this.updouwsrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x =  Number(a[key])
              var y = Number(b[key])
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.pricesrc == '/static/img/spx.png'){
            this.pricesrc = '/static/img/jpx.png'
            this.updouwsrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x =  Number(b[key])
              var y =  Number(a[key])
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
        }else {
          if(this.updouwsrc == '/static/img/px.png'|| this.updouwsrc == '/static/img/jpx.png'){
            this.updouwsrc = '/static/img/spx.png'
            this.pricesrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x =  Number(a[key])
              var y =  Number(b[key])
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.updouwsrc == '/static/img/spx.png'){
            this.updouwsrc = '/static/img/jpx.png'
            this.pricesrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x =  Number(b[key])
              var y =  Number(a[key])
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
  .pages-optional-stock{
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .flex-between{
      padding: 0.3rem 0;
      margin:0 0.24rem;
      border-bottom: 1px solid rgba(50,50,60,1);
      /*margin-bottom: 0.32rem;*/
      div{
        position: relative;
        color:rgba(150,150,150,1);
        font-size: 0.24rem;
        line-height: 0.34rem;
        span,img{
          display: inline-block;
          vertical-align: middle;
        }
      }
      .optional-stock-name{
        flex: 1;
      }
      .optional-stock-price{
        flex: 0.6;
      }
      .optional-stock-updouws{
        position: relative;
        padding-right: 0.6rem;
        flex: 0.6;
        text-align: right;
        .delimg{
          position: absolute;
          right: 0;
          width: 0.4rem;
          z-index:1;
        }
      }
      img{
        margin-left: 0.06rem;
        width: 0.24rem;
      }
    }
    .optional-stock{
      padding:0 0.24rem;
      li{
        font-size: 0.28rem;
        /*margin-bottom: 0.7rem;*/
        .optional-stock-name{
          flex: 1;
          display: flex;
          align-items: center;
          .type{
            width: 0.5rem;
            margin-right: 0.1rem;
            text-align: left;
            span{
              padding: 0 0.05rem;
              font-size: 0.20rem;
              color: #1e1e28;
            }
          }
          .namecode{
            color: white;
            width: 2.28rem;
            span:first-child{
              display: block;
              line-height: 0.4rem;
              margin-bottom: 0.08rem;
            }
            span:last-child{
              display: block;
              font-size: 0.24rem;
              line-height: 0.28rem;
              color: #969696;
            }
          }
        }
        .optional-stock-price{
          flex: 0.6;
          font-size: 0.32rem;
        }
        .optional-stock-updouws{
          padding-right: 0.6rem;
          flex: 0.6;
          font-size: 0.32rem;
          line-height: 0.38rem;
          text-align: right;
          span{
            color:rgba(255,10,10,1);
          }
        }
      }
    }
  }
</style>
