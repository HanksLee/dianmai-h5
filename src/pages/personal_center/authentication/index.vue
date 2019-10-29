<template>
  <div class="pages-authentication">
    <Header :title="titles" :goreturn="true"></Header>
    <div class="authentication-content">
      <div class="userData">
        <ul>
          <li>
            <input type="text" placeholder="请输入真实姓名" v-model="userName">
            <img src="static/img/qc.png" alt="" class="clean-up" v-if="userName" @click="empty(true)">
          </li>
          <li>
            <input type="text" name="pwd" placeholder="请输入身份证号" v-model="userNumber">
            <img src="static/img/qc.png" alt="" class="clean-up" v-if="userNumber" @click="empty(false)">
          </li>
        </ul>
      </div>
      <div class="authentication-img">
        <img class="sfzimg" :src="positiveimg" alt="上传身份证正面" @click="imgClick('1')">
        <img class="sfzimg" :src="otherSideimg" alt="上传身份证反面" @click="imgClick('2')">
        <img v-if="positiveimg!='/static/img/sfz1.png'" class="closeimg" src="/static/img/closeimg.png" alt="删除" @click="delimg('1')">
        <img v-if="otherSideimg!='/static/img/sfz2.png'" class="closeimg" src="/static/img/closeimg.png" alt="删除" @click="delimg('2')">
      </div>
      <input style="float: left;  display: none;" ref="avatarInput" type="file" id='uploadFile'  accept="image/*"  @change="readLocalFile()">
    </div>
    <div class="authentication-tips">
      <h3>拍摄提示</h3>
      <p>1. 请确保身份证边框完整、文字清晰、无反光；</p>
      <p>2. 请确保身份证未过期、与开户本人一致；</p>
      <p v-if="url=='huachihk.com'||url=='huifengstocks.com'||url=='jungdamarkets.com'">
        3. 请使用身份证原件拍摄，系统会加密存储您的身份证信息，仅用于开户使用。
      </p>
      <p v-else>3. 请使用身份证原件拍摄，点买会加密存储您的身份证信息，仅用于开户使用。</p>
    </div>
    <div class="submit-authentication" :class="positiveimg!='/static/img/sfz1.png'&&otherSideimg!='/static/img/sfz2.png'?'authentication-submit':'authentication-nosubmit'" @click="authenticationSubmit">上传</div>
    <van-dialog class="shwtg" v-model="show" :show-cancel-button="false">
      <div class="title">审核未通过</div>
      <div class="con">审核未通过，请重新提交</div>
    </van-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import Cookies from 'js-cookie'
  import Header from '../../../components/Header'
  import {commonRequest} from '../../../api/api-personalCenter'
  export default{
    components: {
      Header,
    },
    data() {
      return {
        statetype:this.$route.query.state||'',
        titles:'实名认证',
        show:false,
        apiyrl:'',
        token: Cookies.get('token'),
        userName:sessionStorage.getItem("userName")||'',
        userNumber:sessionStorage.getItem("userNumber")||'',
        positiveimg:sessionStorage.getItem("positiveimg")||'/static/img/sfz1.png',
        otherSideimg:sessionStorage.getItem("otherSideimg")||'/static/img/sfz2.png',
        img_1:'',
        img_2:'',
        imgflag: '',
        imgs:[],
        url:''
      }
    },
    created() {
      if(this.statetype=='2'){
        this.show=true
      }else if(this.statetype=='1'){
        this.titles='实名认证（已通过）'
      }
      this.realAuthInfo()
      const domain = document.domain
      if (domain === 'localhost') {
        this.apiyrl = 'http://api.dianmai361.com'
      } else if (domain === 'h6.dianmai365.com') {
        const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.apiyrl = '//api4.' + firstDomain
      } else {
        const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.apiyrl = '//api2.' + firstDomain
      }
      const firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      this.url = firstDomain;
    },
    methods:{
      //转换文件
      dataURLtoFile (dataurl, fileName) {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], fileName, { type: mime })
      },
      //  上传信息
      realAuth () {
          var filedata = new FormData()
        if (!this.img_1){
          this.img_1 = this.dataURLtoFile(this.positiveimg, 'img_1.png')
        }
        if (!this.img_2){
          this.img_2 = this.dataURLtoFile(this.otherSideimg, 'img_2.png')
        }
          filedata.append('real_name', this.userName)
          filedata.append('card_id', this.userNumber)
          filedata.append('token', this.token)
          filedata.append('img_1', this.img_1)
          filedata.append('img_2', this.img_2)
          // filedata.append('img_2', this.$refs.avatarInput.files[0])
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          axios.post(this.apiyrl + '/v1_home/user/real-auth', filedata, config).then(res => {
           if(res.data.code!=200){
             return this.$notify({
               message: res.data.msg,
               duration: 1000,
               background: '#fc5155'
             });
           } else {
             return this.$notify({
               message: '上传成功',
               duration: 1000,
               background: '#78e60b'
             });
            }
          }).catch(res => {
            console.log(res)
          })
      },
      // 获取实名认证信息
      realAuthInfo() {
        commonRequest('realAuthInfo',{}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("userName",res.data.user_info.real_name)
            sessionStorage.setItem("userNumber",res.data.user_info.card_id)
            sessionStorage.setItem("positiveimg",'data:image/png;base64,'+res.data.user_info.img_1_content)
            sessionStorage.setItem("otherSideimg",'data:image/png;base64,'+res.data.user_info.img_2_content)
            let userInfo = res.data.user_info || {}
            if(this.statetype == 'null' || this.statetype == ''){
              this.userName =  ''
              this.userNumber =  ''
            }else{
              this.userName = userInfo.real_name
              this.userNumber = userInfo.card_id
            }
            this.positiveimg = userInfo.img_1 ? ('data:image/png;base64,' + userInfo.img_1_content) : '/static/img/sfz1.png'
            this.otherSideimg = userInfo.img_2 ? ('data:image/png;base64,' + userInfo.img_2_content) :'/static/img/sfz2.png'
          }
        })
      },
      // 清空信息
      empty(val){
        if(val){
          this.userName = null
        }else{
          this.userNumber = null
        }
      },
      //删除图片
      delimg:function(index){
        if (index == '1') {
          this.positiveimg =  '/static/img/sfz1.png'
        }else {
          this.otherSideimg =  '/static/img/sfz2.png'
        }
      },
      //图片click
      imgClick:function(a){
        this.imgflag=a
        document.getElementById("uploadFile").click();
      },
      //点击选中图片
      readLocalFile: function (event) {
        var localFile = document.getElementById("uploadFile").files[0];
        var reader = new FileReader();
        var content;
        var current=this;
        if(this.imgflag=='1'){
           this.img_1=document.getElementById("uploadFile").files[0];
        }else {
          this.img_2=document.getElementById("uploadFile").files[0];
        }
        reader.onload = function(event) {
          content = event.target.result;
          if (current.imgflag =='1'){
            current.positiveimg=content;//获取图片base64代码
          } else {
            current.otherSideimg=content;//获取图片base64代码
          }
        }
        reader.onerror = function(event) {
          alert('error')
        }
        content = reader.readAsDataURL(localFile,"UTF-8");
      },
      // 上传信息
      authenticationSubmit() {
        if (this.positiveimg != '/static/img/sfz1.png' && this.otherSideimg != '/static/img/sfz2.png') {
          this.realAuth()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .pages-authentication{
    font-size: 0;
    color: white;
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
    .userData{
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
    .authentication-img{
      position: relative;
      margin-top: 0.4rem;
      text-align: center;
      .sfzimg{
        width: 6.54rem;
        height: 4rem;
        border-radius: 0.2rem;
      }
      .closeimg{
        position: absolute;
        width:0.4rem;
      }
      img:first-child{
        margin-bottom: 0.4rem;
      }
      img:nth-child(3){
        right: 0.25rem;
        top: -0.20rem;
      }
      img:nth-child(4){
        right: 0.25rem;
        top: 4.2rem;
      }
    }
    .authentication-tips{
      font-size: 0.24rem;
      line-height: 0.34rem;
      padding: 0 0.24rem;
      margin-bottom: 1.1rem;
      h3{
        font-size: 0.32rem;
        margin: 0.4rem 0 0.1rem 0;
      }
    }
    .submit-authentication{
      position: fixed;
      bottom: 0;
      width: 7.5rem;
      height: 1.1rem;
      font-size: 0.32rem;
      line-height: 1.1rem;
      text-align: center;
    }
    .authentication-submit{

      background:rgba(255,225,49,1);
      color: #000000;
    }
    .authentication-nosubmit{
      background:rgba(150,150,150,1);
    }
  }
</style>
