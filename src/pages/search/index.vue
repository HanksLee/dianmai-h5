<template>
  <div class="pages-search">
    <div class="search-box">
      <img src="/static/img/search.png" alt="">
      <!--<input v-if="type=='1'" v-model="keywords" type="text" placeholder="港股股票名称/代码">-->
      <!--<input v-else-if="type=='2'" v-model="keywords" type="text" placeholder="ETF股票名称/代码">-->
      <input type="text" v-model="keywords" placeholder="股票名称/代码">
      <span @click="goReturn">取消</span>
    </div>
    <div class="hong-kong-stocks">
      <h3 class="flex-between">
      </h3>
      <ul class="hong-kong">
        <li class="flex-between" v-for="(item,index) in searcgList" :key="index" @click="addsearchlog(item)">
          <p class="hong-kong-price">
            <span v-if="item.market_id =='0'||item.market_id =='11'" style="background-color:rgb(255,25,18)">SH</span>
            <span v-if="item.market_id =='2'||item.market_id =='1'" style="background-color:rgb(255,25,18)">SZ</span>
            <span v-if="item.market_id =='3'" style="background-color:rgb(255,97,46)">HK</span>
            <span v-if="item.market_id =='4'" style="background-color:rgb(52,132,255)">US</span>
            <span v-if="item.market_id =='5'" style="background-color:rgb(255,255,50)">ETF</span>
          </p>
          <p class="hong-kong-name">
            <span>{{item.stock_name}}
              <i v-if="item.stock_type === '1'">(指数.)</i> 
            </span>
            <span>{{item.stock_code}}</span>
          </p>
          <div class="hong-kong-operation business">
            <img v-if="item.focus=='0'" src="/static/img/tianjia.png" alt="添加" @click.stop="addOptional(item)">
            <span v-else>已添加</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="search-history" v-if="searcgList.length==0">
      <h3 v-if="searchlogList.length!=0">搜索历史</h3>
      <ul class="search-history-list">
        <li v-for="(item,index) in searchlogList" :key="index" @click="goStrategy(item,item.market_id)">
          <p class="search-history-list-name">{{item.stock_name}}</p>
          <p class="search-history-list-number">{{item.stock_code}}</p>
          <img v-if="item.focus=='0'" src="/static/img/tianjia.png" alt="添加" @click.stop="addOptional(item)">
          <span v-else>已添加</span>
        </li>
      </ul>
      <div v-if="searchlogList.length!=0" class="clear-history" @click="clearsearchlog">清除历史记录</div>
    </div>
    <Loading :loading="loading"></Loading>
  </div>
</template>
<script>
  import Header from '../../components/Header'
  import Loading from '../../components/Loading'
  import {commonRequest} from '../../api/api-search'
  let timer = null
  let searchLogTimer = null
  export default {
    name: 'strategy',
    components: {
      Header,
      Loading,
    },
    data () {
      return {
        loading:false,
        keywords: '', // 搜索词
        searcgList: [], // 股票列表
        searchlogList:JSON.parse(sessionStorage.getItem("searchlogList"))||[], // 历史记录列表
        type:this.$route.query.type,
        value: '',
        active: 0,
        sharesup: 0
      }
    },
    created(){
      this.searchlog()
    },
    watch: {
      keywords (val) {
        clearTimeout(timer)
        clearTimeout(searchLogTimer)
        if (val) {
          timer = setTimeout(() => {
            this.searchall()
          }, 1000)
        } else {
          this.searcgList = []
          searchLogTimer = setTimeout(() => {
            this.searchlog()
          }, 1000)
        }
        // if(this.keywords!=''){
        //   console.log(this.keywords)
        //   this.searchall()
        // }else {
        //   this.searcgList = []
        //   this.searchlog()
        // }
      }
    },
    methods: {
      // 添加历史记录
      addsearchlog(item){
        commonRequest('addsearchlog', {
          stock_code:item.stock_code,
          stock_type:item.stock_type,
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.searchlog()
          }
        })
        if(item.stock_type == '0' || item.stock_type === undefined){
          this.$router.push({name:'strategy', query: {stock_code: item.stock_code, key: item.market_id,index:0,stock_type:item.stock_type}})
        }else{
          this.$router.push({name:'strategy1', query: {stock_code: item.stock_code, key: item.market_id,index:0,stock_type:item.stock_type}})
        }
      },
      // 清除历史记录
      clearsearchlog(){
        commonRequest('dellogSearchall', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.searchlog()
          }
        })
      },
      // 搜索历史记录列表
      searchlog(){
        commonRequest('searchlog', {
          page:'1',
          pageSize:'20'
        }).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("searchlogList",JSON.stringify(res.data.page_data))
            this.searchlogList = res.data.page_data
          }
        })
      },
      goReturn() {
        this.$router.go(-1);
      },
      dataList() {
        if (this.type=='1'){
          this.hksearch()
        }  else if (this.type=='2') {
          this.etfproduct()
        }
      },
      // 股票点买点卖
      // goStrategy() {
      //   this.$router.push('/strategy')
      // },
      // 添加自选
      addOptional(item){
        commonRequest('addmystock', {
          stock_code: item.stock_code,
          stock_type: item.stock_type,
        }).then(res => {
          if (res.code === 200 && res.data) {
             item.focus='1'
          }
        })
      },
      // 模糊股票列表
      searchall(){
        this.loading = true
        commonRequest('searchall', {
          keyword: this.keywords,
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.searcgList = res.data.page_data
            this.loading = false
          }
        })
      },
      // 港股列表
      hksearch(){
        commonRequest('hksearch', {
          keywords: this.keywords
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.searcgList = res.data.page_data
          }
        })
      },
      // ETF列表
      etfproduct() {
        commonRequest('etfproduct', {
          keywords: this.keywords
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.searcgList = res.data.page_data
          }
        })
      },
      goStrategy(stock,key) {
       if(stock.stock_type == '0' || stock.stock_type === undefined){
         this.$router.push({name:'strategy', query: {stock_code: stock.stock_code, key: key,index:0,stock_type:stock.stock_type}})
       }else{
         this.$router.push({name:'strategy1', query: {stock_code: stock.stock_code, key: key,index:0,stock_type:stock.stock_type}})
       }
      },
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
  input::-webkit-input-placeholder{
    font-size: 0.24rem;
  }
  input:-moz-placeholder{
    font-size: 0.24rem;
  }
  input::-moz-placeholder{
    font-size: 0.24rem;
  }
  input:-ms-input-placeholder{
    font-size: 0.24rem;
  }
  .pages-search{
    padding:0 0.24rem;
    margin-top: 0.4rem;
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .search-box{
      /*border-radius: 0.12rem;*/
      /*position: relative;*/
      /*background:rgba(30,30,40,1);*/
      /*height: 0.6rem;*/
      position: relative;
      border-radius: .3rem;
      height: .6rem;
      img{
        width: 0.28rem;
        position: absolute;
        top: 0.16rem;
        left: 0.2rem;
      }
      input{
        /*height: 0.6rem;*/
        /*width: 6.02rem;*/
        /*border: none;*/
        /*border-radius: 0.3rem;*/
        /*background:rgba(30,30,40,1);*/
        /*font-size: 0.28rem;*/
        /*line-height: 0.6rem;*/
        /*padding: 0;*/
        /*margin-left: 0.6rem;*/
        height: .6rem;
        width: 5.5rem;
        border: none;
        border-radius: .3rem;
        background: #1e1e28;
        font-size: .28rem;
        line-height: .6rem;
        padding: 0;
        padding-left: .6rem;
      }
      span{
        /*width: 0.92rem;*/
        /*background-color:#0E0F19;*/
        /*text-align: right;*/
        /*position: absolute;*/
        /*height: 0.6rem;*/
        /*right: 0;*/
        /*font-size: 0.34rem;*/
        /*color: white;*/
        /*line-height: 0.6rem;*/
        width: .92rem;
        background-color: #0e0f19;
        text-align: right;
        position: absolute;
        height: .6rem;
        right: 0;
        font-size: .34rem;
        color: #fff;
        line-height: .6rem;
      }
    }
  }
  .search-history{
    margin-top: 0.34rem;
    h3{
      height:0.34rem;
      font-size:0.24rem;
      font-weight:400;
      color:rgba(150,150,150,1);
      line-height:0.34rem;
      margin-bottom: 0.2rem;
    }
      .search-history-list{
        li{
          position: relative;
          background:rgba(24,24,32,1);
          margin-bottom: 0.1rem;
          padding: 0.2rem;
          .search-history-list-name{
            font-size: 0.28rem;
            line-height: 0.4rem;
            color: white;
            margin-bottom: 0.08rem;
          }
          .search-history-list-number{
            color:rgba(150,150,150,1);
            line-height:0.28rem;
            font-size: 0.24rem;
          }
          img,span{
            position: absolute;
            right: 0.2rem;
            top: 0.4rem;
          }
          img{
            width: 0.4rem;
          }
          span{
            font-size: 0.28rem;
          }
        }
      }
      .clear-history{
        color:rgba(150,150,150,1);
        font-size: 0.28rem;
        text-align: center;
        margin-top: 0.5rem;
    }
  }
  .hong-kong-stocks{
    h3{
      padding: 0.2rem 0 0.2rem 0;
      /*border-bottom: 1px solid rgba(50,50,60,1);*/
      margin-bottom: 0.32rem;
      span{
        position: relative;
        color:rgba(150,150,150,1);
        font-size: 0.24rem;
        line-height: 0.34rem;
      }
      .hong-kong-name{
        width: 2.28rem;
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
        align-items: center;
        font-size: 0.28rem;
        margin-bottom: 0.7rem;
        .hong-kong-name{
          width: 2.28rem;
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
          width: 0.5rem;
          margin-right: 0.1rem;
          text-align: left;
          span{
            padding: 0 0.05rem;
            font-size: 0.20rem;
            background-color:rgba(255,225,49,1);
            color: rgba(30,30,40,1);
          }
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
          text-align: right;
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
          img{
            width: 0.4rem;
          }
        }
      }
    }
  }
</style>
