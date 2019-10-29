<template>
  <div class="pages-my-promotion">
    <Header title="我的推广" :goreturn="true"></Header>
    <div class="my-promotion-content">
     <h3>已赚取：{{cal_profit}}元</h3>
      <div class="invitation-code">
         <h3>我的邀请码</h3>
        <div class="invitation-code-content">
        <img :src="imgurl" alt="二维码">
        <ul>
          <li>赶快邀请你的小伙伴来赚钱啦！</li>
          <li>你的邀请码为{{invite_code}}！</li>
        </ul>
      </div>
        <div class="immediately">
          <h3>立即分享</h3>
          <div class="flex-between share-content">
            <div class="social-share" data-initialized="true" :data-url="host" :data-source="host" @click="onShare(1)" style="flex: 1">
              <a href="javascript:;" class="social-share-icon icon-qq"></a>
              <div class="f-24">QQ</div>
            </div>
            <div class="social-share" data-initialized="true" :data-url="host" :data-source="host" @click="onShare(2)" style="flex: 1">
              <a href="javascript:;" class="social-share-icon icon-qzone"></a>
              <div class="f-24">QQ空间</div>
            </div>
            <div class="social-share" data-initialized="true" :data-url="host" :data-source="host" @click="onShare(3)" style="flex: 1">
              <a href="javascript:;" class="social-share-icon icon-wechat"></a>
              <div class="f-24">微信</div>
            </div>
            <div class="social-share" data-initialized="true" :data-url="host" :data-source="host" @click="onShare(4)" style="flex: 1;">
              <a href="javascript:;" class="social-share-icon icon-weibo"></a>
              <div class="f-24">微博</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <social-share :src="'/static/social-share/js/social-share.min.js'"></social-share>
  </div>
</template>

<script>
  import Header from '../../../components/Header'
  import socialShare from '../../../components/socialShare'
  import {commonRequest} from '../../../api/api-personalCenter'
  export default{
    components: {
      Header,
      socialShare
    },
    data() {
      return {
        host: window.location.host,
        invite_code:sessionStorage.getItem("invite_code")||'', //邀请码
        imgurl:sessionStorage.getItem("imgurl")||'/static/img/default-user-img.png', // 邀请二维码
        cal_profit:sessionStorage.getItem("cal_profit")||'0' // 已赚取金额
      }
    },
    created(){

      this.userInfo()
      this.calprofit()
    },
    methods:{
      // 二维码
      userInfo() {
        commonRequest('inviterurl', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("invite_code",res.data.invite_code)
            sessionStorage.setItem("imgurl",res.data.imgurl)
            this.invite_code=res.data.invite_code
            this.imgurl=res.data.imgurl
          }
        })
      },
      // 已赚取
      calprofit() {
        commonRequest('calprofit', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("cal_profit",res.data.cal_profit)
            this.cal_profit=res.data.cal_profit
          }
        })
      },
      onShare (flag) {
        switch (flag) {
          case 1:
            console.log('qq')
            break
          case 2:
            console.log('qzone')
            break
          case 3:
            console.log('wechat')
            break
          case 4:
            console.log('weibo')
            break
          default:
            break
        }
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
  .pages-my-promotion{
    color:white;
    font-size: 0;
    .my-promotion-content{
      padding: 0.5rem 0 0.3rem;
      background-color: #181820;;
      h3{
        font-size: 0.4rem;
        text-align: center;
      }
      .invitation-code{
        h3{
          font-size: 0.28rem;
          border-left: 0.16rem solid rgb(252, 81, 85);
          text-align: left;
          padding-left: 0.18rem;
        }
        .invitation-code-content{
          padding: 0.3rem;
          img{
            display: inline-block;
            vertical-align: middle;
            width: 2.4rem;
          }
          ul{
            box-sizing: border-box;
            padding: 0.2rem;
            display: inline-block;
            vertical-align: middle;
            color: rgb(252, 81, 85);
            font-size: 0.28rem;
            li{
              padding-bottom: 0.16rem;
            }
          }
        }
        .immediately{
          .share-content{
            padding: 0.3rem;
          }
          text-align: center;
        }
      }
    }
  }
</style>
