<template>
<div class="pages-personal-center">
  <Header title="个人中心" :goreturn="true" :signOut="true"></Header>
  <div class="personal-assets">
   <h3>{{user_info.real_name || '请登录'}}
     <span class="news">
       <router-link to="/news">
         <img src="static/img/news.png"><i class="count-num" v-if="Number(count_num)>0">{{count_num}}</i>
       </router-link>
      </span>
   </h3>
    <p class="assets" v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'">净资产（港元）</p>
    <p class="assets" v-else>净资产（元）</p>
    <p class="assets-number">{{ user_info.real_wallet === null || user_info.real_wallet === undefined ? '--' : user_info.real_wallet }}</p>
    <button class="recharge" @click="goauthentication('6')">入金</button>
    <button class="withdrawal" @click="goauthentication('5')">出金</button>
    <router-link class="capital-details" to="/capital_details">
        <img src="/static/img/zjmx.png" alt="资金明细">
        <span>资金明细</span>
        <img src="/static/img/xyb.png" alt="下一页">
    </router-link>
    <!-- new stock -->
    <router-link class="capital-details" to="/attack_new_stock">
        <img src="/static/img/zjmx.png" alt="资金明细">
        <span>新股申购</span>
        <img src="/static/img/xyb.png" alt="下一页">
    </router-link>
  </div>
  <div class="personal-list">
    <ul>
      <li @click="goauthentication('0')">
        <img src="/static/img/smrz.png" alt="实名认证">
        <div>
          <p>实名认证</p>
          <p>实名认证好交易</p>
        </div>
      </li>
      <li @click="goauthentication('1')">
        <router-link class="capital-details" to="/capital_details"></router-link>
        <img src="/static/img/gywm.png" alt="关于我们">
        <div>
          <p>关于我们</p>
          <p>了解我们</p>
        </div>
      </li>
      <li @click="goauthentication('2')">
        <img src="/static/img/bzzx.png" alt="帮助中心">
        <div>
          <p>帮助中心</p>
          <p>软件使用常见问题</p>
        </div>
      </li>
      <!-- <li @click="goauthentication('3')" v-if="firstDomain == 'ruthinks.com'">
        <img src="/static/img/lxkf.png" alt="联系客服">
        <div>
          <p>联系客服</p>
          <p>交易日9:30-次日5:00</p>
        </div>
      </li> -->
      <li @click="goauthentication('4')" v-if="user_info.is_agent == 1 && firstDomain == 'aaclplus.com'">
        <img src="/static/img/wdtg.png" alt="我的推广">
        <div>
          <p>我的推广</p>
          <p>邀请好友得佣金</p>
        </div>
      </li>
      <li @click="goauthentication('7')">
        <img src="/static/img/xiugai.png" alt="设置密码">
        <div>
          <p>设置密码</p>
          <p>修改登录密码</p>
        </div>
      </li>
    </ul>
  </div>
  <!-- <van-dialog v-model="show" show-cancel-button @confirm="tellPone">
    <div class="title">是否拨打</div>
    <div class="con">400-1005233</div>
  </van-dialog> -->
  <Footer ref="refdata" v-on:count_numFn="count_numFn"></Footer>
</div>
</template>

<script>
  import Header from '../../components/Header'
  import Footer from '../../components/Footer'
  import {commonRequest} from '../../api/api-personalCenter'
    export default {
        name: "index",
      components: {
        Header,
        Footer
      },
      data() {
        return{
          show:false,
          user_info:JSON.parse(sessionStorage.getItem("user_info"))|| {},
          count_num: 0,
          firstDomain:null,
        }
      },

      created(){
        const domain = document.domain
        this.firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.userInfo()
      },
      mounted(){
        this.count_numFn()
      },
      methods:{
        // 个人信息
        userInfo() {
          commonRequest('userInfo', {}).then(res => {
            if (res.code === 200 && res.data) {
              sessionStorage.setItem("user_info",JSON.stringify(res.data.user_info))
             this.user_info=res.data.user_info
            }
            // this.$notify({
            //     message: '通知内容',
            //     duration: 1000,
            //     background: '#1989fa'
            //   });
          })
        },
          // 拨打电话
        tellPone() {
          window.location.href = 'tel:' + 4001005233
        },
        goauthentication(a) {
          switch(a){
            case '0':
              if(this.user_info.check_status=='0'){
                // 审核中与成功
                this.$router.push('/findings_audit?state='+this.user_info.check_status);
              } else if(this.user_info.check_status=='2'){
                // 审核失败
                this.$router.push('/authentication?state='+this.user_info.check_status);
              }else {
                // 实名认证
                this.$router.push('/authentication?state='+this.user_info.check_status);
              }
              break;
            case '1':
              this.$router.push('/about_us');
              break;
            case '2':
              this.$router.push('/common_problem');
              break;
            case '3':
              this.show=true;
              break;
            case '4':
              this.$router.push('/my_promotion');
              break;
            case '5':
              this.$router.push('/cash_withdrawal');// 提现
              break;
            case '6':
              this.$router.push('/recharge'); // 充值
              break;
            case '7':
              this.$router.push('/resetPassword');//设置密码
          }
        },
        count_numFn(val){
          this.count_num = val
        }
      }
    }
</script>

<style scoped lang="scss">
.pages-personal-center{
  color: white;
  font-size: 0;
  .personal-assets,.personal-list{
    box-sizing: border-box;
    width:7.02rem;
    padding: 0 0.2rem ;
  }
  .personal-assets{
    height:5.58rem;
    margin: 0.2rem auto 0;
    background:rgba(24,24,32,1);
    h3{
      font-size: 0.48rem;
      line-height: 0.66rem;
      padding: 0.4rem 0;
    }
    .assets{
      font-size:0.24rem;
      color:rgba(150,150,150,1);
      line-height:0.34rem;
    }
    .assets-number{
      font-size:0.96rem;
      font-weight:bold;
      color:rgba(255,225,49,1);
      line-height:1.12rem;
    }
    .recharge,.withdrawal{
      padding: 0;
      margin: 0.4rem 0 0.3rem;
      width:3.16rem;
      height:0.86rem;
      font-size:0.32rem;
      text-align: center;
      line-height: 0.9rem;
      border-radius:0.12rem;
    }
    .recharge{
      margin-right: 0.2rem;
      background:rgba(255,225,49,1);
      border:1px solid rgba(255,225,49,1);
      color: #000;
    }
    .withdrawal{
      background-color: transparent;
      border:1px solid rgba(255,225,49,1);
      color:rgba(255,225,49,1);
    }
    .capital-details{
      width: 100%;
      display: inline-block;
      height: 0.48rem;
      padding-top: 0.3rem;
      border-top: 1px solid rgba(50,50,60,1);
      position: relative;
      font-size: 0.32rem;
      color: white;
      text-indent: 0.56rem;
      line-height: 0.44rem;
      img{
       position: absolute;
      }
      img:first-child{
        left: 0;
        width: 0.48rem;
      };
      img:last-child{
        right: 0.2rem;
        width: 0.4rem;
      }
    }
  }
  .personal-list{
    margin: 0.8rem auto 1rem;
    padding: 0 0.24rem;
    ul{
      li{
        display: inline-block;
        width: 50%;
        margin-bottom: 0.8rem;
        img,div{
          display: inline-block;
          vertical-align: middle;
        }
        img{
          width:0.6rem;
          margin-right: 0.2rem;
        }
        div{
          p:first-child{
            font-weight: 600;
            font-size: 0.32rem;
            line-height: 0.44rem;
            margin-bottom: 0.04rem;
          }
          p:last-child{
            font-size: 0.22rem;
            color:rgba(150,150,150,1);
            line-height: 0.32rem;
          }
        }
      }
    }
  }
  .van-dialog__content{
    .title{
      text-align:center;
      font-size:0.36rem;
      margin-bottom:0.28rem;
    }
    .con{
      margin-bottom:0.08rem;
      text-align:center;
      font-size:0.26rem;
    }
  }
}
.news{
  float:right;
  width:0.48rem;
  position:relative;
  top:0.04rem;
  img{
    width:0.48rem;
  }
  .count-num{
    position:absolute;
    top:-0.13rem;
    right:-0.1rem;
    background:#f00;
    font-size:0.14rem;
    width:0.3rem;
    height:0.3rem;
    line-height:0.3rem;
    border-radius:50%;
    text-align:center;
    color:#fff;
  }
}

</style>
