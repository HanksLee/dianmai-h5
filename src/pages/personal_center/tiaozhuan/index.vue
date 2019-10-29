<template>
  <div class="pages-tiaozhuan">
    <Header :title="this.$route.query.scan_type == '1'?'微信支付':(this.$route.query.scan_type == '2'?'微信支付':'支付')" :goreturn="true"></Header>
    <div class="img-box">
      <h3>支付金额(元)：<span>{{ money }}</span></h3>
      <p class="img-p"><img :src="src" alt=""></p>
      <p style="word-break: break-all;white-space: normal;" v-if="this.$route.query.scan_type == '1'">链接地址：{{ src }}<span style="display:inline-block;padding:0.07rem 0.1rem;color:#fff;margin-left:7px;background:#fc5155;border:1px solid #ccc;border-radius:5px;font-size: 0.24rem" @click="copyFn(src)">复制</span></p>
      <dl>
        <dt>方法一：</dt>
        <dd v-if="this.$route.query.scan_type == '1'">请用微信扫码</dd>
        <dd v-else>长按二维码识别或点击“
          去支付”按钮，若跳转失败，则请用支付宝扫码支付</dd>
      </dl>
      <dl>
        <dt>方法二：</dt>
        <dd v-if="this.$route.query.scan_type == '1'">请复制链接地址在微信中打开，长按识别二维码</dd>
        <dd v-else>将二维码保存到相册。进入支付宝扫码选择“扫一扫”选择右上方“从相册选取二维码”即可完成支付</dd>
      </dl>
      <div class="tishi-box">
        <router-link to="/personal_center" v-if="this.$route.query.scan_type == '1'"><div class="balance-submit">完成存款,确认提交</div></router-link>
        <div class="balance-submit" v-else @click="toPayForFn">去支付</div>
        <p><router-link to="/recharge">支付失败,请重新下单</router-link></p>
      </div>
      <div style="color:#999;">温馨提示</div>
      <dl style="color:#999;">
        <dt style="width:7%;">1.</dt>
        <dd style="width:90%;">若在存款中提示二维码已过期或存入金额已满,请刷新二维码后重新下单；</dd>
      </dl>
      <dl style="color:#999;">
        <dt style="width:7%;">2.</dt>
        <dd style="width:90%;">为确保每一位客户存款能及时到账，每笔存款金额，系统均智能生成两位小数；</dd>
      </dl>
    </div>
    <Footer></Footer>
    <Loading :loading="loadings"></Loading>
  </div>
</template>

<script>
  import Header from '../../../components/Header'
  import Loading from '../../../components/Loading'
  import Footer from '../../../components/Footer'
  import socialShare from '../../../components/socialShare'
  import {getQRCode, requestPayPreorder, commonRequest} from '../../../api/api-personalCenter'
  export default{
    components: {
      Header,
      socialShare,
      Loading,
      Footer
    },
    data() {
      return {
        loadings:false,
        query: {},
        user: {},
        urlInformation: '',
        money: '',
        src: '',
        url: ''
      }
    },
    created() {
      this.query = this.$route.query || {}
      this.money = (Number(this.query.money) + Number(Math.random().toFixed(2))).toFixed(2)
      this.getInformation()
    },
    watch: {

    },
    methods: {
      // 获取二维码
       getUrl (val) {
         this.loadings =true
         getQRCode(val,{scan_type:this.$route.query.scan_type}).then(res => {
           console.log(res)
           if (res.code === 200) {
             this.src = res.data.data
             this.url = res.data.url
             this.loadings =false
           }else {
             console.log(res)
             this.$router.push('/recharge')
           }
         })
      },
      // 复制
      copyFn (url) {
        let textArea = document.createElement('textarea')
        textArea.style.position = 'fixed'
        textArea.style.left = '-10000px'
        textArea.style.top = '-10000px'
        document.body.appendChild(textArea)
        textArea.value = url
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      },
      // 预支付返回二维码连接
      getInformation() {
        commonRequest('preorder', {
          channel_id:this.$route.query.channel_id,
          bank_code:'',
          bind_id:'',
          money:this.money,
          user_name:'',
          mobile:'',
          id_card:'',
          bank_card:'',
          scan_type:this.$route.query.scan_type
        }).then(res => {
          if (res.code === 200) {
            this.urlInformation = res.data.content.url
            this.getUrl(this.urlInformation, this.$route.query.scan_type)
          }else {
            console.log(res.data)
          }
        })
      },
      // 判断设备类型跳转
      toPayForFn () {
        let u = navigator.userAgent
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)//ios终端
          if (window.plus) {
            if(isiOS){
              plus.runtime.openURL(this.url)
            } else {
              plus.runtime.openWeb(this.url);
            }
          } else {
            location.href = this.url;
          }
      },
      // toPayForFn(){
      //   let u = navigator.userAgent
      //   let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)//ios终端
      //     if (window.plus) {
      //       plus.runtime.openWeb(this.url);
      //     }else if(isiOS){
      //       window.webkit.messageHandlers.gopay.postMessage(this.url)
      //     }
      //     else {
      //       location.href = this.url;
      //     }
      //   // plus.runtime.openWeb(this.url);
      //   // // window.location.href = this.url
      // }
    }
  }
</script>

<style scoped lang="scss">
.pages-tiaozhuan{
  color: white;
  .img-box{
    padding: 0 0.24rem;
    .img-p{
      text-align:center;
      img{
        width:50%;
      }
    }
    h3{
      color: rgb(255, 225, 49);
      font-size:0.4rem;
      margin-bottom:0.05rem;
      span{
        color:#fc5155;
        font-size:0.52rem;
      }
    }
    dl{
      padding:0.03rem 0;
      overflow:hidden;
      dt{
        letter-spacing:2px;
        float:left;
      }
      dd{
        color: #a79f9f;
        float:left;
        font-size: 0.28rem;
        width:4.8rem;
      }
    }
    .tishi-box{
      margin-top:0.16rem;
      font-size:0.32rem;
      margin-bottom:0.6rem;
      .balance-submit,p{
        width: 6.7rem;
        height: 0.68rem;
        border-radius: 0.12rem;
        line-height: 0.68rem;
        background-color: rgba(255,225,49,1);
        font-size: 0.36rem;
        text-align: center;
        margin: 0.35rem auto;
        color:#000;
      }
      p{
        background:#fff;
        /*padding:0.2rem 0;*/
        /*border-radius:0.05rem;*/
        /*text-align:center;*/
        /*margin-top:0.2rem;*/
      }
    }
  }
}
</style>
