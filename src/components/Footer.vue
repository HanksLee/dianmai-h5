<template>
  <div>
    <footer>
      <ul>
        <li v-for="(item,index) in data" :key="index" :class="{active:isActive == item.routerName}" @click="footerFn(item.routerName)">
          <div :class="item.className" @click="routerFn(index,item.path)">
            <span v-if="item.className == 'strategy'">
              {{textFn3()}}
            </span>
            <span v-else>
              {{item.name}}
              <i class="count" v-if="item.className == 'my' && Number(count)>0"></i>
            </span>
          </div>
        </li>
      </ul>
    </footer>
  </div>
</template>
<script>
import { commonRequest } from '@/api/api-strategy'
import Cookies from 'js-cookie'
var timer = null
export default {
  name: 'Footer',
  data(){
    return {
      isActive: '/',
      data:[{
        className: 'market',
        path: '/',
        routerName: 'home',
        name: '行情',
      },{
        className: 'optional',
        routerName: 'optionalStock',
        path: '/optional_stock',
        name: '自选',
      },{
        className: 'strategy',
        routerName: 'strategy',
        path: '/strategy',
        name: '策略',
      },{
        className: 'my',
        routerName: 'personal_center',
        path: '/personal_center',
        name: '我的',
      }],
      query: {},
      count: 0,
      stock_code:null,
      url:null
    }
  },
  beforeDestroy() {
    clearInterval(timer)
  },
  created() {
  },
  mounted() {
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url = firstDomain;
    this.isActive = this.$route.name || 'home'
    let token = Cookies.get('token') || null
    if(token || token !== undefined){
      this.getAlertcount()
      timer = setInterval(this.getAlertcount, 30000)
    }
    if(this.$route.path == '/strategy1'){
      this.isActive = 'strategy'
    }
  },
  methods: {
    footerFn(val){
      this.isActive = val
    },
    routerFn(index,pathName){
      let queryObj = Cookies.get('query')
      if(queryObj){
        this.query = JSON.parse(Cookies.get('query'))
      }
      if(index === 2){
        if(this.query.stock_type  == '0' || this.query.stock_type === undefined){ // 股票
           if(this.query.stock_code === undefined){
             if(this.url == 'huachihk.com'||this.url=='huifengstocks.com'){
               this.$router.push({name: 'strategy',query:{stock_code: '00001',key:'2',index: 0}})
             }
              else if(this.url == 'raytekasia.com' || this.url == 'acarpsgroup.com'){
                this.$router.push({name: 'strategy',query:{stock_code: '510500',key:'2',index: 0}})
              }else{
                this.$router.push({name: 'strategy',query:{stock_code: '000001',key:'2',index: 0}})
              }
          }else{
            this.$router.push({name: 'strategy',query:{stock_code:this.query.stock_code,key:this.query.key,index: 0,stock_type: this.query.stock_type}})
          }
        }
        if(this.query.stock_type  == '1' || this.query.stock_type  == '2'){ // 点差
           if(this.query.stock_code === undefined){
            this.$router.push({name: 'strategy1',query:{stock_code: '000001',key:'2',index: 0}})
          }else{
            this.$router.push({name: 'strategy1',query:{stock_code:this.query.stock_code,key:this.query.key,index: 0,stock_type: this.query.stock_type}})
          }
        }
      }else{
        this.$router.push({path:pathName})
      }
    },
    //给只做期货的客户默认获取第一个期货策略
    // getfuture(){
    //   let m_id = localStorage.getItem('market_open_type')
    //   commonRequest('future',{
    //     market_id: m_id
    //   }).then(res=>{
    //     if(res.code == '200'){
    //        this.stock_code = res.data.page_data[0].stock_code
    //        this.$router.push({name: 'strategy',query:{stock_code: this.stock_code,key:m_id,index: 0}})
    //     }
    //   })
    // },
    //获取爆仓预警消息条数
    getAlertcount(){
      commonRequest('alertcount').then(res=>{
        if(res.code == '200'){
           this.count = res.data.count
           this.$emit('count_numFn',this.count)
           //this.$parent.count_num = 10
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
footer{
  position:fixed;
  bottom: 0;
  left:50%;
  margin-left:-3.75rem;
  height:1rem;
  width:100%;
  background:#0E0F19 url('/static/img/Rectangle@2x.png') top center no-repeat;
  background-size:100%;
  color:#969696;
  text-align:center;
  max-width:750px;
  z-index:100;
  li{
    width:25%;
    float:left;
  }
  div{
    span{
      height:1rem;
      color:#969696;
      font-size:0.2rem;
      display:block;
      line-height:1.64rem;
    }
  }
  .market{
    span{
      background:url('/static/img/f1.png') center 0.16rem no-repeat;
      background-size:0.48rem 0.48rem;
    }
  }
  .optional{
    span{
      background:url('/static/img/f2.png') center 0.16rem no-repeat;
      background-size:0.48rem 0.48rem;
    }
  }
  .strategy{
    span{
      background:url('/static/img/f3.png') center 0.16rem no-repeat;
      background-size:0.48rem 0.48rem;
    }
  }
  .my{
    position:relative;
    span{
      background:url('/static/img/f4.png') center 0.16rem no-repeat;
      background-size:0.48rem 0.48rem;
    }
    i{
        position:absolute;
        right:0.6rem;
        top:0.1rem;
        color:#fff;
        font-size:0.1rem;
        background:#f00;
        border-radius:50%;
        display:inline-block;
        width:0.16rem;
        height:0.16rem;
        line-height:0.16rem;
      }
  }
  .active{
    .market{
      span{
        background:url('/static/img/f1_click.png') center 0.16rem no-repeat;
        background-size:0.48rem 0.48rem;
        color:#FFE131;
      }
    }
    .optional{
      span{
        background:url('/static/img/f2_click.png') center 0.16rem no-repeat;
        background-size:0.48rem 0.48rem;
        color:#FFE131;
     }
    }
    .strategy{
      span{
        background:url('/static/img/f3_click.png') center 0.16rem no-repeat;
        background-size:0.48rem 0.48rem;
        color:#FFE131;
      }
    }
   .my{
      span{
        background:url('/static/img/f4_click.png') center 0.16rem no-repeat;
        background-size:0.48rem 0.48rem;
        color:#FFE131;
      }
   }
  }
  img{
    width:0.48rem;
    margin-top:0.12rem;
    height:0.48rem;
  }
}

</style>
