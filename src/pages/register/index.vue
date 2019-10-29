<template>
<div class="login register">
  <div class="header">
      <Header title="注册"></Header>
      <a class="fh" href="javascript:history.go(-1)"><img src="static/img/fh.png" alt=""></a>
  </div>
   <div class="register-box">
      <div class="input-box">
        <ul>
          <li>
            <input type="text" placeholder="请输入手机号" v-model="phone" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="phone" @click="empty(1)">
          </li>
          <li>
            <input type="text" name="code" placeholder="请输入短信验证码" v-model="code" v-on:input ="inputFunc">
            <img src="static/img/qc.png" alt="" class="clean-up register-clean-up" v-if="code" @click="empty(2)">
            <button class="send-code"  @click="validateFn" :disabled="disabled1" :class="{active:isBotton === true}">{{text}}</button>
          </li>
          <li>
            <input type="text" placeholder="请输入真实姓名" v-model="realName" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="realName" @click="empty(3)">
          </li>
          <li v-if="email_type === 1">
            <input type="text" placeholder="请输入邮箱" v-model="email" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="email" @click="empty(7)">
          </li>
          <li>
            <input type="password" placeholder="请输入6-20位字母和数字组合的密码" v-model="password" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="password" @click="empty(4)">
          </li>
          <li>
            <input type="password" placeholder="请再次输入密码" v-model="newPassword" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="newPassword" @click="empty(5)">
          </li>
          <li>
            <input type="text" :disabled="hasInviteCode" placeholder="请填写机构/IB经纪人编码（邀请码）" v-model="InviteCode" v-on:input ="inputFunc">
              <img src="static/img/qc.png" alt="" class="clean-up" v-if="InviteCode && !hasInviteCode" @click="empty(6)">
          </li>
          <li>
            <div class="protocol" @click="choice" :class="{active:isAgree === true}">
              <i><van-icon :name="icoName" /></i>
              <span>我已阅读并同意</span>
              <router-link v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'||firstDomain=='jungdamarkets.com'" to="/hzxy">服务协议</router-link>
              <router-link v-else to="/hzxy">合作协议</router-link>
            </div>
          </li>
          <li class="but-li" :class="{active:isInput === true}">
            <button :disabled="disabled" @click="registerFn">注册</button>
          </li>
          <li>
            <div class="register-link"><router-link to="/login">已有账号，马上登录 <img src="static/img/x.png" alt=""></router-link></div>
          </li>
        </ul>
      </div>
  </div>
</div>
</template>
<script>
import Header from '../../components/Header'
import { setUserCookie } from '@/utils/user'
import { commonRequest } from '@/api/api-login'
import { isPhoneValid,removeAllSpace } from '@/utils/data'
export default {
  name: 'register',
   components: {
    Header,
  },
  data () {
    return {
     hasInviteCode: false,
     text: '发送短信验证码',
     isInput: false,
     phone: null,
     code: null,
     realName: null,
     email:null,
     email_type: null,
     password: null,
     newPassword: null,
     InviteCode: null,
     disabled: true,
     timer: null,
     time: 60,
     disabled1: true,
     isBotton: false,
     icoName:'passed',
     isAgree: false,
     firstDomain:''
    }
  },
  created() {
    if (this.$route.query.ib) {
      this.InviteCode = this.$route.query.ib
      this.hasInviteCode = true
    }
    const domain = document.domain;
    this.firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.getuserWeb()
  },
  // beforeDestroy () {
  //   if (this.timer) {
  //     clearInterval(this.timer)
  //     this.timer = null
  //   }
  // },
  methods: {
    getuserWeb(){
      commonRequest('userWeb').then(res=>{
        if(res.code == '200'){
           this.email_type = res.data.mail_must
           if(this.email_type == '0'){
             this.email = true
           }
        }
      })
    },
    //监听输入
  inputFunc(){
      if(this.phone&&this.code&&this.realName&&this.email&&this.password&&this.newPassword&&this.isAgree){
        this.isInput = true
        this.disabled = false
      }else{
        this.isInput = false
        this.disabled = true
      }
      //验证码发送按钮
      if(this.phone){
        this.disabled1 = false
        this.isBotton = true
      }else{
        this.disabled1 = true
        this.isBotton = false
      }
   },
   //清除输入
   empty(val){
     if(val === 1){
       this.phone = null
     }else if(val === 2){
       this.code = null
     }else if(val === 3){
       this.realName = null
     }else if(val === 7){
       this.email = null
     }else if(val === 4){
       this.password = null
     }else if(val === 5){
       this.newPassword = null
     }else if(val === 6){
       this.InviteCode = null
     }
     this.inputFunc()
   },
   //获取验证码
   validateFn(){
     if(!isPhoneValid(this.phone)){
      this.$message('请输入正确的手机号码')
      return
     }
     this.countDown()
     commonRequest('smscode',{
       mobile:this.phone
     }).then(res=>{
       if(res.code == '200'){
        this.$message(res.msg)
       }else{
        this.$message(res.msg)
       }
     })
   },
   //验证码倒计时
   countDown(){
     this.timer = setInterval(() => {
        if(this.time > 1){
          this.time--
          this.text = this.time+'s后重新发送'
        }else{
          clearInterval(this.timer)
          this.text = '发送短信验证码'
        }
     },1000)
   },
   //勾选合作协议
   choice(){
    if(this.isAgree){
      this.isAgree = false
      this.icoName = 'passed'
    }else{
      this.isAgree = true
      this.icoName = 'checked'
    }
    this.inputFunc()
   },
   //注册
   registerFn(){
     if(this.password !== this.newPassword){
       this.$message('两次输入的密码不一致')
       return
     }
     commonRequest('register',{
       mobile: removeAllSpace(this.phone),
       smscode: this.code,
       real_name: this.realName,
       email:this.email,
       password: this.password,
       inviter_id: this.InviteCode,
     }).then(res=>{
       if(res.code == '200'){
        this.$messageSuccess(res.msg)
        this.$router.push({path: '/login'})
       }else{
        this.$messageFail(res.msg)
       }
     })
   }
  }
}
</script>
<style scoped lang="scss">
.header{
  position:relative;
  .fh{
   position:absolute;
   bottom:0.12rem;
   left:0.18rem;
   img{
     width:0.27rem;
     height:0.47rem;
   }
  }
}
.register{
  background-image: url('/static/img/bg@2x.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height:100vh;
  padding-bottom:0.5rem;
  position:relative;
  color:#fff;
  .title{
    margin-top:1.5rem;
    margin-left:0.48rem;
    font-size:0.72rem;
  }
  p{
    font-size:0.32rem;
    margin-top:0.2rem;
  }
  .input-box{
    margin-top:0.62rem;
    padding:0 0.48rem;
    width:6.54rem;
    li{
      width:100%;
      position:relative;
      margin-bottom:0.3rem;
      // i{
      //   position:absolute;
      //   left:0.2rem;
      //   top:50%;
      //   margin-top:-0.24rem;
      //   img{
      //     width:0.48rem;
      //     height:0.48rem;
      //   }
      // }
      input{
        height:1.1rem;
        background:#fff;
        background-size:8.3044%;
        width:6.34rem;
        border:none;
        border-radius:6px;
        padding-left:0.2rem;
        color:#000;
        font-size:0.32rem;
      }
      .clean-up{
        position:absolute;
        right:0.2rem;
        top:50%;
        margin-top:-0.14rem;
        width:0.28rem;
      }
      .register-clean-up{
         right:2.5rem;
      }
      a{
        color:#fff;
        font-size:0.24rem;
        img{
          width:0.1rem;
          height:0.18rem;
        }
      }
      .register-link{
        float:left;
      }
      .forget-password{
        float:right;
      }
    }
    .but-li{
      margin-top:0.66rem;
      button{
        background:#969696;
        height:1.1rem;
        border:none;
        border-radius:6px;
        width:6.54rem;
        padding:0;
        font-size:0.32rem;
      }
    }
    .but-li.active{
      button{
        background:#FFE131;
        color:#000;
      }
    }
  }
}
.send-code{
  position:absolute;
  right:0.2rem;
  top:50%;
  margin-top:-0.3rem;
  background:#969696;
  width:2rem;
  height:0.6rem;
  border-radius:4px;
  font-size:0.24rem;
  color:#fff;
  text-align:center;
  line-height:0.6rem;
  border:none;
}
.send-code.active{
  background:#FFE131;
  color:#000;
}


.protocol{
    bottom:0.4rem;
    text-align:center;
    width:100%;
    font-size:0.24rem;
    span{
      color:#969696;
    }
    i{
      color:#969696;
      font-size:0.32rem;
      position:relative;
      top:0.04rem;
    }
  }
   .register .input-box li .protocol.active{
    i{
      color:#FFE131;
    }
    a{
      color:#FFE131;
    }
  }
</style>
