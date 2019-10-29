<template>
  <div class="pages-capital-details">
    <Header title="资金明细" :goreturn="true"></Header>
    <div class="capital-list">
      <div class="tab-box">
        <span :class="{active:isActive === 1}" @click="tabClick(1)">出金入金</span>
        <span :class="{active:isActive === 2}" @click="tabClick(2)">余额变动</span>
      </div>
          <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" infinite-scroll-immediate-check="false">
            <li v-for="(item, index) in capitalData" :key="index">
              <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
              <p :style="item.money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="bianhua" style="color: #FF1E3C">
                {{item.money}}
                <span style="float:right;color:rgba(40, 240, 100,1)" v-if="isActive === 1">{{item.status}}</span>
                <span style="float:right;margin-right:0.3rem;color:#fff;font-size:0.28rem;" v-if="isActive === 1">{{item.desc}}</span>
                <span style="float:right;margin-right:0.3rem;color:#fff;font-size:0.28rem;" v-if="isActive === 2">{{item.desc}}</span>
              </p>
              <p class="time">{{ item.time}}</p>
            </li>
            <li v-if="nonono" class="nonono">没有更多了</li>
          </ul>
    </div>
    <Loading :loading="loadings"></Loading>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Loading from '@/components/Loading'
  import {commonRequest} from '@/api/api-authentication'
  export default {
    components: {
      Header,
      Loading
    },
    data() {
      return{
        isActive: 1,
        width:30,
        nonono:false,
        capitalData: [],
        page: 1,
        pageSize: 20,
        list: [],
        loadings: false,
        loading: false,
        isEnd: false
      }
    },
    created(){
      this.customerDetail()
    },
    methods:{
      customerDetail() {
        this.loadings=true
        commonRequest('customerDetail', {
          page_no:  this.page,
          page_size: this.pageSize,
          type: this.isActive
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.page += 1
            if (this.page >  res.data.page.page_count) {
              this.nonono = true
            }
            let pageData = res.data.page_data
            this.capitalData = [...this.capitalData, ...pageData]
            this.loading = false
            this.loadings = false
          }else {
            this.loadings=false
          }
        })
      },
      loadMore () {
        if (this.nonono) return
        this.loading = true
        this.customerDetail()
      },
      tabClick(val){
        this.nonono = false
        this.page = 1
        this.isActive = val
        this.capitalData = []
        this.customerDetail()
      },
    },
    name: "index"
  }
</script>

<style scoped lang="scss">
.pages-capital-details{
  color: white;
  font-size: 0;
  .capital-list{
    font-size: 0.32rem;
    height: calc(100vh - 1.2rem);
    overflow-y: auto;
    padding-top:0.1rem;
    .tab-box{
      padding:0.2rem 0.1rem 0.3rem;
      text-align:center;
      span{
       display:inline-block;
       padding:0 0.12rem 0.15rem;
       margin:0 1rem;
      }
      span.active{
        color:#FFE131;
        border-bottom:2px solid #FFE131;
      }
    }
    ul{
      li{
        padding: 0 0.24rem 0.1rem;
        border-bottom: 1px solid #32323C;
        .bianhua{
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: 0.32rem;
        }
        .time{
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: 0.24rem;
        }
      }
      .nonono{
        text-align: center;
        padding: 0.2rem;
        border: none;
        font-size: 0.30rem;
      }
    }
  }
}
</style>
