<template>
  <div class="pages-host-shares">
    <Header title="热门概念" :issearch="true" :goreturn="true"></Header>
    <h3 class="flex-between"><span class="host-type">热门概念</span><span class="host-updows">涨跌幅</span><span
      class="host-name">领涨股</span></h3>
    <ul class="host-list">
      <li class="flex-between" v-for="(item,index) in hostList " @click="sharestype(item)" :key="index">
        <p class="host-type">{{item.plate_name}}</p>
        <p class="host-updows" :style="item.dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'">{{parseFloat(item.dif_rate).toFixed(2)}}%</p>
        <p class="host-name">
          <span style="display: block">{{item.top_stock_name}}</span>
          <span :style="item.top_dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'">{{parseFloat(item.top_dif_rate).toFixed(2)}}%</span>
        </p>
      </li>
    </ul>
    <!--<Footer></Footer>-->
  </div>
</template>
<script>
  import Header from '../../components/Header'
  import {commonRequest} from '../../api/api-home'

  export default {
    name: 'strategy',
    components: {
      Header,
      // Footer
    },
    data() {
      return {
        active: 0,
        sharesup: 0,
        hostList: JSON.parse(sessionStorage.getItem("hostList"))||[], // 热门列表
        typePage:this.$route.query.type||'1'
      }
    },
    created() {
this.hostdata()
    },
    methods: {
      hostdata() {
        commonRequest('hottype', {
          plate_type:this.$route.query.type
        }).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("hostList",JSON.stringify(res.data.all))
            this.hostList = res.data.all
          }
        })
      },
      // 股票分类页面
      sharestype(a) {
        this.$router.push({name: 'sharesType',query:{type: a.plate_name,plate_type:a.plate_type,plate_code:a.plate_code}})
      },
    }
  }
</script>
<style scoped lang="scss">
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flex-around {
    display: flex;
    justify-content: space-around;
  }

  .pages-host-shares {
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .sss {
      height: 200px;
      width: 100px;
      background-color: red;
      font-size: 20px;
      color: white;
    }
    h3 {
      padding: 0.2rem 0;
      border-bottom: 1px solid rgba(50, 50, 60, 1);
      margin:0 0.24rem 0.2rem;
      span {
        color: rgba(150, 150, 150, 1);
        font-size: 0.24rem;
        line-height: 0.34rem;
      }
      .host-type {
        flex: 1;
      }
      .host-updows {
        flex: 0.6;
      }
      .host-name {
        flex: 0.6;
        text-align: right;
      }
    }
    .host-list {
      padding: 0 0.24rem;
      li {
        font-size: 0.28rem;
        margin-bottom: 0.48rem;
        .host-type {
          flex: 1;
        }
        .host-updows {
          flex: 0.6;
          font-size: 0.32rem;
          color: rgba(255, 10, 10, 1);
        }
        .host-name {
          flex: 0.6;
          font-size: 0.24rem;
          line-height: 0.34rem;
          text-align: right;
          span:nth-child(2) {
            color: rgba(255, 10, 10, 1);
          }
        }
      }
    }
  }
</style>
