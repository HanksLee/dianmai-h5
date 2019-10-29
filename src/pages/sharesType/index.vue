<template>
  <div class="pages-shares-type">
    <Header :title="title" :issearch="true" :searchUrl="searchs" :goreturn="true"></Header>
    <div class="flex-between">
      <div class="optional-stock-name">名称代码</div>
      <div class="optional-stock-price"><span>价格</span>
        <img :src="pricesrc" alt="排序" @click="rsortKey(typesList,'now_price')">
      </div>
      <div class="optional-stock-updouws"><span>涨跌幅</span>
        <img :src="updouwsrc" alt="排序" @click="rsortKey(typesList,'dif_rate')">
      </div>
    </div>
    <div class="list">
      <ul class="agt">
        <li  class="flex-between" v-for="(item,index) in typesList" :key="index" @click="goStrategy(item,item.market_id)">
          <p class="type">
            <span v-if="item.market_id =='0'" style="background-color:rgb(255,25,18)">SH</span>
            <span v-if="item.market_id =='2'||item.market_id =='1'" style="background-color:rgb(255,25,18)">SZ</span>
            <span v-if="item.market_id =='3'" style="background-color:rgb(255,97,46)">HK</span>
            <span v-if="item.market_id =='4'" style="background-color:rgb(52,132,255)">US</span>
            <span v-if="item.market_id =='5'" style="background-color:rgb(255,255,50)">ETF</span>
          </p>
          <p class="namecode">
            <span>{{item.stock_name}}</span>
            <span>{{item.stock_code}}</span>
          </p>
          <p class="price">{{parseFloat(item.now_price).toFixed(2)}}</p>
          <p class="updown" :style="item.dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" style="color: #28F064">{{item.dif_rate}}%</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {commonRequest} from '../../api/api-home'
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
        title:this.$route.query.type,
        dellid: '',
        dellshow:false,
        searchs:'/search',
        pricesrc: '/static/img/px.png',
        updouwsrc: '/static/img/px.png',
        active: 0,
        sharesup: 0,
        typesList: JSON.parse(sessionStorage.getItem("hostTypesList"))||[], // 列表
      }
    },
    created(){
      this.typeList()
    },
    methods: {
      goStrategy(stock,key) {
        this.$router.push({name:'strategy', query: {stock_code: stock.stock_code, key: key,index:0}})
      },
      // 分类列表
       typeList(){
        commonRequest('type', {
          plate_code:this.$route.query.plate_code,
          plate_type:this.$route.query.plate_type
        }).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("hostTypesList",JSON.stringify(res.data.page_data))
            this.typesList = res.data.page_data
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
              var y =  Number(b[key])
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
  .pages-shares-type{
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .flex-between{
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(50,50,60,1);
      /*margin-bottom: 0.32rem;*/
      margin:0 0.24rem;
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
        text-align: right;
        flex: 0.6;
      }
      .optional-stock-updouws{
        position: relative;
        flex: 0.6;
        text-align: right;
        .delimg{
          position: absolute;
          right: 0;
          width: 0.4rem;
        }
      }
      img{
        margin-left: 0.06rem;
        width: 0.24rem;
      }
    }
    .list{
      .agt{
        li{
          align-items: center;
          font-size: 0.28rem;
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
          .price,.updown{
            text-align: right;
            flex:1
          }
        }
      }
    }
  }
</style>
