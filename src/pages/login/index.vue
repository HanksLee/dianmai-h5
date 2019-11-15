<template>
  <div class="login" :class="{
    aaclplus: url == 'aaclplus.com', zggjcenter: url == 'zggjcenter.com',
    ruthmarkets: url =='ruthinks.com', zxcnmarkets: url == 'zxcnmarkets.com',
    gplrds: url == 'gplrds.com', dingmaohongsheng: url == 'dingmaohongsheng.com',
    ftstrategy: url=='ftstrategy.net', liangrongFund: url=='liangrong-fund.com',
    boloniasia: url== 'boloniasia.com', raytekasia: url== 'raytekasia.com',
    acarpsgroup: url=='acarpsgroup.com', huachihk: url=='huachihk.com',
    huifengstocks: url=='huifengstocks.com', jungdamarkets: url=='jundatl.com',
    huataistock: url == 'huataistock.com'
  }">
    <div class="login-box">
      <!-- <a class="fh" href="javascript:history.go(-1)">
        <img src="static/img/fh.png" alt>
      </a> -->
      <!-- <div class="title">点买
        <p>一个实现梦想的地方</p>
      </div> -->
      <!--<div @click="goThirdUrl('http://api.dianmai361.com/v1_home/pay/pay?pre_id=BH4d3awmxQiPrCTGIWzQoe1emrN63rOjJyBUj4HXLs4')">测试</div>-->
      <div class="input-box">
        <ul>
          <li>
            <i>
              <img src="static/img/phone.png" alt>
            </i>
            <input type="text" placeholder="请输入手机号" v-model="phone" v-on:input="inputFunc">
            <img src="static/img/qc.png" alt class="clean-up" v-if="phone" @click="empty(true)">
          </li>
          <li>
            <i>
              <img src="static/img/password.png" alt>
            </i>
            <input
              type="password"
              name="pwd"
              placeholder="请输入密码"
              v-model="password"
              v-on:input="inputFunc"
            >
            <img src="static/img/qc.png" alt class="clean-up" v-if="password" @click="empty(false)">
          </li>
          <li class="jizhu"><van-checkbox v-model="checked" @change="rememberFn"><span :style="{color:colorValue}">记住账号</span></van-checkbox></li>
          <li class="but-li" :class="{active:isInput === true}">
            <button @click="signIn" :disabled="disabled">登录</button>
          </li>
          <li>
            <div class="register-link">
              <router-link to="/register">新用户注册 >
                <!-- <img src="static/img/x.png" alt> -->
              </router-link>
            </div>
            <div class="forget-password">
              <router-link to="/resetPassword">忘记密码?</router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <van-dialog v-model="show" :show-confirm-button="false" :closeOnClickOverlay="true">
      <div class="info">请输入图中验证码</div>
      <div class="con">
        <img :src="src" alt @click="signIn">
        <div class="change-graph">看不清楚？点击图片换一张</div>
        <div class="input-dl">
          <input type="text" v-model="codeOgj.code">
          <!-- <input type="text" v-model="codeOgj.code2" maxlength="1" v-on:input ="inputFuncCode(2,codeOgj.code2)" id="code2">
            <input type="text" v-model="codeOgj.code3" maxlength="1" v-on:input ="inputFuncCode(3,codeOgj.code3)" id="code3">
          <input type="text" v-model="codeOgj.code4" maxlength="1" v-on:input ="inputFuncCode(4,codeOgj.code4)" id="code4">-->
        </div>
        <div class="validate" @click="signInFn">验证</div>
      </div>
    </van-dialog>
    <!-- <div class="loading-box" v-if="iSloading">
    <van-loading type="spinner" color="#ffe131" size="24px" vertical></van-loading>
    <div class="text-loading">登录中...</div>
    </div> -->
  </div>
</template>
<script>
import { setUserCookie } from "@/utils/user";
import { commonRequest, getLoginCode } from "@/api/api-login";
export default {
  name: "login",
  data() {
    return {
      iSloading:false,
      loading:true,
      url: null,
      isInput: false,
      phone: null,
      password: null,
      code: null,
      disabled: true,
      show: false,
      src: null,
      codeOgj: {
        code: ""
        // code2: '',
        // code3: '',
        // code4: '',
      },
      code: null,
      isSuccess: false,
      checked:false,
      colorValue:''
    };
  },
  created() {
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url = firstDomain;
    if(this.url =='huachihk.com'||this.url=='huifengstocks.com'||this.url=='jungdamarkets.com'
      || this.url == 'huataistock.com'){
       this.colorValue='#909399'
    }else{
       this.colorValue=''
    }
    if(JSON.parse(localStorage.getItem("checked"))){
      let data = JSON.parse(localStorage.getItem("infoData"));
      this.checked = true
      this.phone = data.phone
    }

  },
  methods: {
    inputFunc() {
      if (this.phone && this.password) {
        this.isInput = true;
        this.disabled = false;
      } else {
        this.isInput = false;
        this.disabled = true;
      }
    },
    empty(val) {
      if (val) {
        this.phone = null;
      } else {
        this.password = null;
      }
      this.isInput = false;
    },
    signIn() {
      if (this.isInput) {
        this.src = getLoginCode();
        this.show = true;
        for (let i in this.codeOgj) {
          this.codeOgj[i] = "";
        }
      }
    },
    signInFn() {
      // this.code = String(this.codeOgj.code1) + String(this.codeOgj.code2) + String(this.codeOgj.code3) + String(this.codeOgj.code4)
      this.code = this.codeOgj.code;
      const data = {
        mobile: this.phone,
        password: this.password,
        code: this.code
      };
      //this.iSloading = true
      commonRequest("login", data).then(res => {
        //this.iSloading = false
        if (res.code == "200") {
          this.show = false;
          let data = res.data;
          localStorage.setItem('userinfo',JSON.stringify(res.data))
          setUserCookie(data.token);
          this.$messageSuccess(res.msg);
          if (this.$route.query.backUrl) {
            window.location.href = decodeURIComponent(
              this.$route.query.backUrl
            );
          } else if (this.$route.query.backRoute) {
            this.$router.replace({
              path: decodeURIComponent(this.$route.query.backRoute)
            });
          } else {
            this.$router.replace({ path: "/" });
          }
        } else if (res.code == "301") {
          this.$messageFail(res.msg);
          this.show = true;
        } else {
          this.show = false;
          this.$messageFail(res.msg);
        }
      });
    },
    inputFuncCode(val, value) {
      //  if(value&&val < 4){
      //   let id = 'code'+(val+1)
      //   let el = document.getElementById(id)
      //   el.focus()
      //  }
    },
    //记住账号
     rememberFn(val){
      let checked = val
      localStorage.setItem("checked", JSON.stringify(checked));
      if(val){
        let infoData = {
          phone: this.phone,
        }
        localStorage.setItem("infoData", JSON.stringify(infoData));
      }else{
        let infoData = {
          phone: null,
          //password: null
        }
        localStorage.setItem("infoData", JSON.stringify(infoData));
      }
    }
  }
};
</script>
<style scoped lang="scss">
html,body,#app{
  height:100%;
}
.fh {
  position: absolute;
  top: 0.4rem;
  left: 0.14rem;
  img {
    width: 0.24rem;
    height: 0.44rem;
  }
}
.login {
  background-image: url("/static/img/login-bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 720px;
  position: relative;
  color: #fff;
  .login-box {
    position: absolute;
    left: 0;
    top: 0;
  }
  .title {
    margin-top: 1.5rem;
    margin-left: 0.48rem;
    font-size: 0.72rem;
  }
  p {
    font-size: 0.32rem;
    margin-top: 0.2rem;
  }
  .input-box {
    margin-top: 4.96rem;
    padding: 0 0.48rem;
    width: 6.54rem;
    li {
      width: 100%;
      position: relative;
      margin-bottom: 0.3rem;
      i {
        position: absolute;
        left: 0.2rem;
        top: 50%;
        margin-top: -0.24rem;
        img {
          width: 0.48rem;
          height: 0.48rem;
        }
      }
      input {
        height: 1.1rem;
        background: #fff;
        background-size: 8.3044%;
        width: 5.78rem;
        border: none;
        border-radius: 6px;
        padding-left: 0.76rem;
        color: #000;
        font-size: 0.32rem;
      }
      .clean-up {
        position: absolute;
        right: 0.2rem;
        top: 50%;
        margin-top: -0.14rem;
        width: 0.28rem;
      }
      a {
        color: #fff;
        font-size: 0.24rem;
        img {
          width: 0.1rem;
          height: 0.18rem;
        }
      }
      .register-link {
        float: left;
        a {
          color: #909399;
        }
      }
      .forget-password {
        float: right;
        a {
          color: #909399;
        }
      }
    }
    .but-li {
      margin-top: 0.8rem;
      button {
        background: #969696;
        height: 1.1rem;
        border: none;
        border-radius: 6px;
        width: 6.54rem;
        padding: 0;
        font-size: 0.32rem;
      }
    }
    .but-li.active {
      button {
        background: #ffe131;
        color: #000;
      }
    }
  }
  .info {
    font-size: 0.36rem;
    margin: -0.02rem 0 0.4rem 0;
    text-align: center;
  }
  .con {
    text-align: center;
    img {
      width: 1.86rem;
      height: 0.6rem;
    }
    .change-graph {
      margin-top: 0.1rem;
      color: #ffe131;
      font-size: 0.24rem;
    }
  }
  .input-dl {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0.4rem 0;
    input {
      width: 100%;
      text-align: center;
      height: 0.6rem;
      line-height: 0.6rem;
      background: #fff;
      border-radius: 4px;
      border: none;
      color: #000;
      font-size: 0.32rem;
    }
  }
  .validate {
    background: rgba(255, 225, 49, 1);
    border-radius: 0px 0px 8px 8px;
    color: #000;
    font-size: 0.32rem;
    height: 0.9rem;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 0.9rem;
  }
  .loading-box{
    position:fixed;
    height:100%;
    width:100%;
    background:#000;
    left:0;
    top:0;
    z-index:100000;
  }
.van-loading{
  position:fixed;
  left:50%;
  top:50%;
  z-index:1000;
}
.text-loading{
    color:#ffe131;
  font-size:0.28rem;
  position: fixed;
    left: 4%;
    width: 100%;
    top: 56%;
    text-align: center;
    font-size: 0.3rem;
}

}
.login.aaclplus{
  background-image: url("/static/loginBg/aaclplus.jpg");
  .input-box li a{
    color:#666;
  }
}
.login.zggjcenter{
  background-image: url("/static/loginBg/zggjcenter.jpg");
  .input-box li a{
    color:#000;
  }
}
.login.ruthmarkets{
  background-image: url("/static/loginBg/ruthmarkets.jpg");
  .input-box li a{
    color:#000;
  }
  .input-box li input{
    border:1px solid #ccc;
  }
}
.login.zxcnmarkets{
   background-image: url("/static/loginBg/zxcnmarkets.jpg");
  .input-box li a{
    color:#000;
  }
  .input-box li input{
    border:1px solid #ccc;
  }
}
.login.gplrds{
  background-image: url("/static/loginBg/gplrds.jpg");
  .input-box li a{
    color:#000;
  }
  .input-box li input{
    border:1px solid #ccc;
  }
}
.login.dingmaohongsheng{
  background-image: url("/static/loginBg/dingmaohongsheng.jpg");
  .input-box li a{
    color:#000;
  }
}
.login.ftstrategy{
  background-image: url("/static/loginBg/ftstrategy.jpg");
}
.login.liangrongFund{
  background-image: url("/static/loginBg/liangrong-fund.jpg");
}
.login.huataistock {
  background-image: url("/static/loginBg/huataistock.jpg")
}

.login.boloniasia{
  background-image: url("/static/loginBg/boloniasia.jpg");
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
}

.login.raytekasia{
  background-image: url("/static/loginBg/raytekasia.jpg");
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
}
.login.acarpsgroup{
  background-image: url("/static/loginBg/acarpsgroup.png");
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
}
.login.test{
  background-image: url("/static/loginBg/acarpsgroup.png");
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
}
.login.huachihk{
  background-image: url("/static/loginBg/huachihk.jpg");
  // background-position: 0px -110px;
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
  .input-box{
    margin-top:5.5rem;
    input {
      background-color: rgba(255, 255, 255, 0.774)
    }
  }
}
.login.huifengstocks{
  background-image: url("/static/loginBg/huifengstocks.jpg");
  // background-position: 0px -110px;
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
  .input-box{
    margin-top:5.5rem;
    input {
      background-color: rgba(255, 255, 255, 0.774)
    }
  }
}
.login.jungdamarkets{
  background-image: url("/static/loginBg/jungdamarkets.jpg");
  // background-position: 0px -110px;
  .input-box li input{
    border:1px solid #ccc;
  }
  .input-box li a{
    color:#000;
  }
  .jizhu .van-checkbox__label{
    color:#000;
  }
  .input-box{
    margin-top:5.5rem;
    input {
      background-color: rgba(255, 255, 255, 0.774)
    }
  }
}
//加载动画
/* Start the loader code, first, let's align it the center of screen */


</style>
