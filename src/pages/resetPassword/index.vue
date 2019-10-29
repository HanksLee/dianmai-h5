<template>
<div class="login register">
  <div class="header">
      <Header title="重置密码"></Header>
      <a class="fh" href="javascript:history.go(-1)"><img src="static/img/fh.png" alt=""></a>
  </div>
   <div class="register-box">
     <!-- 手机验证 -->
      <div class="input-box" v-if="!isPassword">
        <ul>
          <li>
            <i><img src="static/img/phone.png" alt=""></i>
            <input type="text" placeholder="请输入手机号" v-model="phone" v-on:input ="inputFunc">
            <img src="static/img/qc.png" alt="" class="clean-up" v-if="phone" @click="empty(true)">
          </li>
          <li>
            <i><img src="static/img/Icons／Tab bar@2x.png" alt=""></i>
            <input type="text" name="code" placeholder="请输入短信验证码" v-model="code" v-on:input ="inputFunc">
            <img src="static/img/qc.png" alt="" class="clean-up register-clean-up" v-if="code" @click="empty(false)">
            <button class="send-code"  @click="validateFn" :disabled="disabled1" :class="{active:isBotton === true}">{{text}}</button>
          </li>
          <li class="but-li" :class="{active:isBotton1 === true}">
            <button :disabled="disabled" @click="mobilePhoneVerification">手机验证</button>
          </li>
        </ul>
      </div>
    <!-- 重置密码 -->
      <div class="input-box" v-if="isPassword">
        <ul>
          <li>
            <i><img src="static/img/password.png" alt=""></i>
            <input type="password" placeholder="请输入密码" v-model="password" v-on:input ="inputFunc">
            <img src="static/img/qc.png" alt="" class="clean-up" v-if="phone" @click="empty(true)">
          </li>
          <li>
            <i><img src="static/img/password.png" alt=""></i>
            <input type="password" name="password" placeholder="请再次输入密码" v-model="repassword" v-on:input ="inputFunc">
            <img src="static/img/qc.png" alt="" class="clean-up" v-if="code" @click="empty(false)">
          </li>
          <li class="but-li" :class="{active:isBntton2 === true}">
            <button :disabled="disabled2" @click="resetPassword">重置密码</button>
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
import { isPhoneValid } from '@/utils/data'
export default {
  name: 'register',
   components: {
    Header,
  },
  data () {
    return {
     text: '发送短信验证码',
     isBotton1: false,
     phone: null,
     code: null,
     disabled: true,
     timer: null,
     time: 60,
     disabled1: true,
     isBotton: false,
     isPassword: false,
     password: null,
     repassword: null,
     disabled2:false,
     isBntton2: false
    }
  },
  created() {
  },
  // beforeDestroy () {
  //   if (this.timer) {
  //     clearInterval(this.timer)
  //     this.timer = null
  //   }
  // },
  methods: {
    //监听输入
   inputFunc(){
      if(this.phone&&this.code){
        this.isBotton1 = true
        this.disabled = false
      }else{
        this.isBotton1 = false
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
      //重置密码
      if(this.password&&this.repassword){
         this.disabled2 = false
         this.isBntton2 = true
      }else{
        this.disabled2 = true
        this.isBntton2 = false
      }
   },
   //清除输入
   empty(val){
     if(val){
       this.phone = null
       this.password = null
     }else{
       this.code = null
       this.repassword = null
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
        clearInterval(this.timer)
        this.text = '发送短信验证码'
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
   //手机验证
   mobilePhoneVerification(){
     commonRequest('valid',{
       mobile: this.phone,
       code: this.code
     }).then(res =>{
       if(res.code == '200'){
         this.isPassword = true
       }else{
         this.$message(res.msg)
       }
     })
   },
   //重置密码
   resetPassword(){
     if (this.password !== this.repassword) {
        this.$message('请输入正确的密码和重复密码')
        return
      }
     commonRequest('getBackPwd',{
       mobile: this.phone,
       password: this.password,
       repassword: this.repassword,
       smscode: this.code
     }).then(res =>{
       if(res.code == '200'){
        this.$messageSuccess(res.msg)
        this.$router.go(-1)
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
    margin-top:0.96rem;
    padding:0 0.48rem;
    width:6.54rem;
    li{
      width:100%;
      position:relative;
      margin-bottom:0.3rem;
      i{
        position:absolute;
        left:0.2rem;
        top:50%;
        margin-top:-0.24rem;
        img{
          width:0.48rem;
          height:0.48rem;
        }
      }
      input{
        height:1.1rem;
        background:#fff;
        background-size:8.3044%;
        width:5.78rem;
        border:none;
        border-radius:6px;
        padding-left:0.76rem;
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
      margin-top:0.8rem;
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
  width:1.92rem;
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
</style>
