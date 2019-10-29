<template>
  <div class="pages-findings-audit">
    <Header title="实名认证" :goreturn="true"></Header>
    <div class="findings-content">
      <div class="findings-img" v-if="statetype=='0'">
        <img class="sfzimg" src="/static/img/shz.png" alt="审核中">
        <h3>审核进行中</h3>
        <p v-if="firstDomain==='raytekasia.com'||firstDomain==='boloniasia.com'">
          工作人员正在进行审核，预计花费1-2个小时</p>
        <p v-else>工作人员正在进行审核，预计花费1-2个工作日</p>
      </div>
      <div class="findings-img" v-else>
        <img class="sfzimg" src="/static/img/shz.png" alt="审核中">
        <h3>审核通过</h3>
        <p>您的身份证已经通过审核</p>
      </div>
    </div>
</div>
</template>

<script>
  import Header from '../../../components/Header'
  export default{
    components: {
      Header,
    },
    data() {
      return {
        statetype:this.$route.query.state||'',
        positiveimg: '/static/img/sfz1.png',
        otherSideimg: '/static/img/sfz2.png',
        imgflag: '',
        imgs:[],
        firstDomain:null
      }
    },
    created(){
      const domain = document.domain;
      this.firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      console.log(this.$route.query)
    },
    methods:{
    }
  }
</script>

<style scoped lang="scss">
 .pages-findings-audit{
   color: white;
   font-size: 0;
   .findings-content{
     .findings-img{
       margin-top: 1.6rem;
       text-align: center;
       img{
         width: 2.42rem;
       }
       h3{
         margin:0.78rem 0 0.1rem 0;
         line-height: 0.66rem;
         font-size: 0.48rem;
       }
       p{
         font-size: 0.24rem;
         height: 0.34rem;
       }
     }
   }
 }
</style>
