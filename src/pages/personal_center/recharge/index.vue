<template>
  <div class="pages-recharge">
    <Header title="充值" :goreturn="true"></Header>
    <div class="recharges">
      <div class="recharge-data">
        <ul>
          <li>
            <span v-if="firstDomain=='huifengstocks.com'||firstDomain=='huachihk.com'">金额(HK$)</span>
            <span v-else>金额(￥)</span>
            <input type="text" v-model="money">
          </li>
        </ul>
      </div>
      <div class="pay-channel">
        <h3>选择支付通道<span class="span-tips">{{getTips()}}</span></h3>
        <div class="channel-box pay-color">
          <van-radio-group v-model="radio">
            <van-radio  v-for="(item,index) in radioOptions" :key="index" checked-color="#ffe131" :name="item.id">{{item.name}}</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div v-if="cashType === '3' || cashType == '5'" class="money-mode">
        <p>请选择充值金额：</p>
        <span v-for="(item, index) in set_money" :key="index" @click="clickMoney(item, index)" :class="{ active:isActive === index }">{{ item }}</span>
        <div class="payment-method">
          <p>请选择支付方式：</p>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='1'">微信</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='2'">支付宝</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='3'">其他</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='4'">转卡</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='5'">云闪付</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='6'">支付宝红包</span>
          <span v-for="(item, index) in scan_type" :key="index" @click="clickPaymentMethod(item, index)" :class="{ active:isActiveA === index }" v-if="item=='7'">微信h5</span>
          <!--<span v-for="(item, index) in payment_method_arr_qy" :key="index" @click="clickPaymentMethod(item.id, index)" :class="{ active:isActiveA === index }" v-if="firstDomain == 'redtactfull.com' || firstDomain == 'redtactful.com'">{{item.name}}</span>-->
          <!--<span v-for="(item, index) in payment_method_arr" :key="index" @click="clickPaymentMethod(item.id, index)" :class="{ active:isActiveA === index }" v-else>{{item.name}}</span>-->
        </div>
      </div>
      <div class="choice-bank" v-show="cashType === '1' || cashType === '2'">
        <div class="pay-channel">
          <h3 style="margin: 0.1rem 0 0.2rem;font-size: 0.3rem">选择{{ cashType === '1' ? '银行' : (cashType === '2' ? '卡号' : '')}}</h3>
          <div v-show="cashType === '2'"><span class="btn-bind" @click="onShowBind">绑定卡片</span></div>
          <div class="choice-banks">
            <div class="choice-bank-page" :class="['re-radio', cashType === '2' ? 're-radio-2' : '']" v-for="item in cashRadioOptions" :key="'re-bank-' + item.id">
              <input type="radio" name="radio-bank" :id="'radio-bank-' + item.id" v-model="cashRadio" :value="item.id">
              <label :for="'radio-bank-' + item.id">
                <img v-if="item.logo" class="re-label-img" :src="item.logo">
                <div class="re-label-text"><span>{{item.name || item.bank_card}}</span></div>
              </label>
              <span class="dell-bank" @click="onUnbind(item.id)" v-show="is_special !== 1">解除绑卡</span>
            </div>
          </div>
        </div>
      </div>
      <div class="balance-submit" v-if="cashType == '3'" @click="onSubmitJump">提交</div>
      <div class="balance-submit" v-else @click="onSubmit">提交</div>
      <div class="tops" v-html="tops">{{tops}}</div>
      <div class="tops" v-if="firstDomain == 'boloniasia.com' || firstDomain == 'raytekasia.com'">
        由於公司財務管理制度，每日17點后資金需扎帳匯總到三方銀行托管，故入金時間為工作日周一至周五09:00點至17:00点，其余時間暫不辦理入金。
      </div>
    </div>
    <van-dialog class="recharge-dialog" v-model="isShowBind" show-cancel-button :before-close="beforeClose" @confirm="onExec" style="width: 100%" :confirm-button-text="(is_special === 1 && !clickBindBtn) ? '确定' : '绑定'"
                @cancel="onCancelShow">
      <div class="title text-center">{{ (is_special === 1 && !clickBindBtn) ? '快捷支付' : '绑定银行卡'}}</div>
      <van-field
        v-model="bind.name"
        label="姓名"
        placeholder="请输入姓名"/>
      <van-field
        v-model="bind.phone"
        label="手机号"
        placeholder="请输入手机号"/>
      <van-field
        v-model="bind.id_card"
        label="身份证号"
        placeholder="请输入身份证号"/>
      <van-field
        v-model="bind.bank_card"
        label="银行卡号"
        placeholder="请输入银行卡号"/>
    </van-dialog>
    <van-dialog class="recharge-dialog" v-model="show1" show-cancel-button @confirm="confirmcode1" style="width: 100%" confirm-button-text="确定"
                @cancel="onCancelShow">
      <div class="title text-center">快捷方式需输入短信验证码</div>
      <van-field
        v-model="codes1"
        label="验证码"
        placeholder="请输入验证码"/>
    </van-dialog>
    <van-dialog class="recharge-dialog" v-model="show2" show-cancel-button @confirm="confirmcode2" style="width: 100%" confirm-button-text="确定"
                @cancel="onCancelShow">
      <div class="title text-center">快捷方式绑定短信验证</div>
      <van-field
        v-model="codes2"
        label="验证码"
        placeholder="请输入验证码"/>
    </van-dialog>
    <Loading :loading="loadings"></Loading>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import socialShare from '@/components/socialShare'
  import Loading from '@/components/Loading'
  import {commonRequest,requestPayBindPay} from '@/api/api-personalCenter'
  export default{
    components: {
      Header,
      socialShare,
      Loading
    },
    data() {
      return {
        loadings:false,
        orderId:'',
        payurl:'',
        codes1:'',
        codes2:'',
        bind: {
          name: "",
          phone: "",
          id_card: "",
          validCode: "",
          bank_card: "",
          sendCodeCD: 0
        },
        money:'',
        radio: null,
        cashRadio: undefined,
        cashType: undefined,
        rate: null,
        max: null,
        min:null,
        isActive: false,
        isActiveA: false,
        isShowBind: false,
        clickBindBtn: false,
        payment_method_arr: [
          {
            id: "1",
            name: "微信"
          },
          {
            id: "2",
            name: "支付宝"
          },
          {
            id: "3",
            name: "其他"
          },
          {
            id: "4",
            name: "转卡"
          },
          {
            id: "5",
            name: "云闪付"
          },
          {
            id: "6",
            name: "支付宝红包"
          },
          {
            id: "7",
            name: "微信h5"
          }
        ],
        payment_method_arr_qy: [
          {
            id: "2",
            name: "支付宝"
          }
        ],
        firstDomain: '',
        scan_type:[], // 支付方式
        set_money: [],
        is_special:0,
        radioOptions: [], // 支付通道列表
        cashRadioOptions: [],
        show1:false,
        show2:false,
        tops:''
      }
    },
    created() {
      // this.mui.init();
      this.cashdes()
      this.plusReady()
      this.getFirstDomain()
    },
    watch: {
      radio (val, oldVal) {
        this.cashRadio = undefined
        this.initCashRadioOption(val)
        // if (this.cashType === '2' && this.cashRadioOptions.length === 0) {
        //   this.isShowBind = true
        // }
      }
    },
    methods:{
      getFirstDomain () {
        var domain=document.domain
        const firstDomain = domain.substring(
          domain.indexOf(".") + 1,
          domain.length
        );
        this.firstDomain = firstDomain;
      },
      // 打开信webview
      // gonewwvb(url){
      //   this.mui.openWindow({
			// 			url: '#/newweb?id='+url,
			// 			id: "target"
			// 		});
      // },
      // 确定前的回调
      beforeClose(action, done) {
        if (action === 'confirm') {
          setTimeout(done, 1000);
        } else {
          done();
        }
      },
      // 绑定银行卡短信验证码确认
      confirmcode1(){
        this.bindConfirm(this.codes1, this.orderId)
      },
      // 验证码确认
      confirmcode2(){
        this.sendBindSMSCode(this.codes2, res.data.content.url)
      },
      // 绑定银行卡短信验证码确认
      bindConfirm(val,vv){
        commonRequest('bindcardconfirm', {
          channel_id:this.radio,
          sms_code:val,
          order_id:vv,
        }).then(res => {
          if (res.code === 200 ) {
            this.onCancelShow()
            this.getPayCashDesk()
          }
          this.$notify({
              message: res.msg,
              duration: 1000,
              background: '#1989fa'
            });
        })
      },
      // 快捷短信确认
        sendBindSMSCode (value, url) {
          requestPayBindPay(val,url).then(res => {
            if (res.code === 200) {
              console.log(res)
            }else {
              return this.$notify({
                message: res.msg,
                duration: 1000,
                background: '#fc5155'
              });
            }
          })
          return this.$notify({
            message: res.msg,
            duration: 1000,
            background: '#fc5155'
          });
      },
      // 点击颜色
      clickMoney (val, index) {
        console.log(val)
        this.money = val
        this.isActive = index
      },
      // 点击颜色
      clickPaymentMethod (val, index) {
        this.isActiveA = index
        this.index_id = val
      },
      onCancelShow () {
        this.isShowBind = false
        this.clickBindBtn = false
      },
      onExec () {
        if (this.is_special == 1 && !this.clickBindBtn) {
          return this.specialProPay()
        } else {
          return this.onBind()
        }
        console.log(11)
      },
      onBind(){
        console.log(11111)
        commonRequest('bindcard', {
          channel_id:this.radio,
          user_name:this.bind.name,
          mobile:this.bind.phone,
          id_card: this.bind.id_card,
          bank_card:this.bind.bank_card
        }).then(res => {
          if (res.code == 200) {
            this.orderId = res.data.content.order_id
            this.show2=true
          }
          console.log(11111)
          return this.$notify({
            message: res.msg,
            duration: 1000,
            background: '#fc5155'
          });
        })
      },
      tellPone(){},
      specialProPay () {
        if (!this.bind.name) {
          return this.$notify({
            message: "请输入姓名",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.bind.phone) {
          return this.$notify({
            message: "请输入手机号",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.bind.id_card) {
          return this.$notify({
            message: "请输入身份证号",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.bind.bank_card) {
          return this.$notify({
            message: "请输入银行卡号",
            duration: 1000,
            background: '#fc5155'
          });
        }
        let bankId
        let cardId
        if (this.cashType === "1") {
          bankId = this.cashRadio
        } else if (this.cashType === "2") {
          cardId = this.cashRadio
        }
        this.onCancelShow()
        console.log(11111111111)
        commonRequest('preorder', {
          channel_id:this.radio,
          bank_code:bankId,
          bind_id:cardId,
          money:this.money,
          user_name:'',
          mobile:'',
          id_card:'',
          bank_card:'',
          scan_type:scan_type
        }).then(res => {
          if (res.code != 200) {
            this.payurl=res.data.content.url||''
            return this.$notify({
              message: res.msg,
              duration: 1000,
              background: '#fc5155'
            })
          }else {
            return this.goThirdUrl(res.data.content.url)
          }
        })
      },
      // 生成订单地址
      onSubmit () {
        if (!this.money) {
          return this.$notify({
            message: "请输入充值金额",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.radio) {
          return this.$notify({
            message: "请选择支付通道",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (this.cashType === "1" && !this.cashRadio) {
          return this.$notify({
            message: "请选择银行",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (this.cashType === "2" && !this.cashRadio) {
          if (this.cashRadioOptions.length === 0) {
            this.isShowBind = true
            return
          }
          return this.$notify({
            message: "请选择卡号",
            duration: 1000,
            background: '#fc5155'
          });
        }
        let bankId
        let cardId
        if (this.cashType === "1") {
          bankId = this.cashRadio
        } else if (this.cashType === "2") {
          cardId = this.cashRadio
        }
        let scan_type
        if (this.cashType == "3") {
          scan_type = "2"
        }
        this.loadings=true
        commonRequest('preorder', {
          channel_id:this.radio,
          bank_code:bankId,
          bind_id:cardId,
          money:this.money,
          user_name:'',
          mobile:'',
          id_card:'',
          bank_card:'',
          scan_type:scan_type
        }).then(res => {
          if (res.code != 200) {
            this.loadings = false
            return this.$notify({
              message: res.msg,
              duration: 1000,
              background: '#fc5155'
            });
          }else {
            this.loadings = false
           this.payurl=res.data.content.url
            if (this.cashType === "2" && this.is_special !== 1) {
              this.show=true
            } else {
              // window.location.href = res.data.content.url
              this.goThirdUrl(this.payurl)
            }
          }
        })
      },
      // 判断plus在不在
      plusReady (callback) {
        if (window.plus) {
          callback();
        } else {
          document.addEventListener('plusready', callback);
        }
      },
      // 判断设备类型跳转
      goThirdUrl (url) {
        let u = navigator.userAgent
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)//ios终端
        if (url) {
          if (window.plus) {
            if(isiOS){
              if(this.cashType=='4'||this.cashType=='0'){
                plus.runtime.openURL(url)
              }
              else {
                plus.runtime.openWeb(url);
              }
            } else {
              if(this.cashType=='4'||this.cashType=='0'){
                plus.runtime.openURL(url)
              } else{
                plus.runtime.openWeb(url);
              }
            }
          } else {
            location.href = url;
          }
        }
      },
      // 判断设备类型跳转
      // goThirdUrl (url) {
      //   if (window.plus) {
      //     this.gonewwvb(url)
      //   }else {
      //     location.href = url;
      //   }
      // },
      // 提交
      onSubmitJump () {
        if (this.money == false) {
          return this.$notify({
            message: "请选择支付金额或输入支付金额",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (this.index_id === null) {
          return this.$notify({
            message: "请选择支付方式",
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (this.index_id == "1") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "1" }
          })
        } else if (this.index_id == "2") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "2" }
          })
        }else if (this.index_id == "3") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "3" }
          })
        }else if (this.index_id == "4") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "4" }
          })
        }else if (this.index_id == "5") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "5" }
          })
        }else if (this.index_id == "6") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "6" }
          })
        }else if (this.index_id == "7") {
          this.$router.push({
            name: "tiaozhuan",
            query: { money: this.money, channel_id: this.radio, scan_type: "7" }
          })
        }
      },
      // 解除绑定银行卡
      onUnbind(id) {
        if (this.cashType !== "2" || this.is_special === 1) return
        commonRequest('unbind', {
          channel_id:this.radio,
          bind_id:id,
        }).then(res => {
          if (res.code === 200) {
            this.cashRadio = null
            this.cashdes()
          }
          this.$notify({
            message: res.msg,
            duration: 1000,
            background: '#fc5155'
          });
        })
      },
      // 支付通道列表
      cashdes() {
        this.loadings=true
        commonRequest('cashdes', {}).then(res => {
          if (res.code === 200 && res.data) {
            let options = []
            for (let key in res.data.content) {
              let arr = res.data.content[key]
              arr.forEach(obj => {
                options.push(
                  Object.assign({ label: obj.name, value: obj.id }, obj)
                )
              })
            }
            this.radioOptions = options
            this.initCashRadioOption(this.radio)
            this.loadings=false
          }
          // this.$notify({
          //     message: '通知内容',
          //     duration: 1000,
          //     background: '#1989fa'
          //   });
        })
      },
      // 提示
      getTips () {
        let tips = ""
        if (this.rate !== null) {
          tips += "(提示：手续费" + this.rate + "%"
        }
        if (this.max !== null || this.min !== null) {
          if (tips === "") {
            tips += "(提示：入金"
          } else {
            tips += "，入金"
          }
          if (this.max !== null) {
            tips += "上限" + this.max + "元"
          }
          if (this.max !== null && this.min !== null) {
            tips += "/"
          }
          if (this.min !== null) {
            tips += "下限" + this.min + "元"
          }
        }
        if (tips !== "") {
          tips += ")"
        }
        return tips
      },
      // 提示相关
      initCashRadioOption (val) {
        this.cashType = undefined
        this.is_special = 0
        if (!val) {
          this.cashRadioOptions = []
          return
        }
        let options = []
        this.radioOptions.forEach(obj1 => {
          if (obj1.id === val) {
            this.is_special = obj1.is_special
            this.max = obj1.max
            this.min = obj1.min
            this.rate = obj1.rate
            this.cashType = obj1.type
            this.set_money = obj1.set_money
            this.scan_type = obj1.scan_type?obj1.scan_type.split(""):[]
            if (obj1.type === "1") {
              obj1.banks.forEach(obj2 => {
                options.push(Object.assign({}, obj2))
              })
            } else if (obj1.type === "2" && obj1.binded.length > 0) {
              obj1.binded.forEach(obj2 => {
                options.push(Object.assign({}, obj2))
              })
            }
          }
        })
        this.cashRadioOptions = options
      },
      onShowBind () {
        this.isShowBind = true
        this.clickBindBtn = true
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
  $browser-default-font-size: 100px !default;
  $color-primary: rgb(255, 225, 49);
  @function torem($px){
    @return $px / $browser-default-font-size * 1rem;
  }
  input{
    &[type="radio"]{
      position: relative;
      padding: 0;
      width: torem(20px);
      height: torem(20px);
      -moz-border-radius: torem(6px);
      -webkit-border-radius: torem(6px);
      border-radius: torem(20px);
      cursor: pointer;
      outline:none;
      &::after{
        content: '';
        width: torem(8px);
        height: torem(4px);
        position: absolute;
        top: torem(6px);
        left: torem(6px);
        border: torem(1px) solid #181820;
        border-top: none;
        border-right: none;
        background: transparent;
        opacity: 0;
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      &:checked{
        -webkit-appearance: none;
        background: -moz-linear-gradient(top, $color-primary 0%, rgb(255, 225, 49) 100%);
        background: -webkit-linear-gradient(top, $color-primary 0%, rgb(255, 225, 49) 100%);
        background: linear-gradient(to bottom, $color-primary 0%, rgb(255, 225, 49) 100%);
        -moz-box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 0px 0px rgba(255, 255, 255, 0.2);
        -webkit-box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 0px 0px rgba(255, 255, 255, 0.2);
        box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 0px 0px rgba(255, 255, 255, 0.2);
      }
      &:checked::after{
        opacity: 1;
      }
    }
  }
  .flex-between{
    display: flex;
    justify-content: space-between;
  }
  .flex-around{
    display: flex;
    justify-content: space-around;
  }
  .pages-recharge{
    color:white;
    font-size: 0;
    .pay-channel{
      font-size:0.3rem;
      padding: 0.24rem 0 0 0.24rem;
      background-color: #181820;
      margin: 0 0.24rem 0.4rem;
      h3{
        font-size: 0.36rem;
        span{
          font-size: 0.16rem;
          margin-left: 0.1rem;
        }
      }
      .van-radio{
        display: inline-block;
        margin: 0.2rem;
      }
    }
    .money-mode{
      padding: 0 0.24rem;
      font-size: 0.24rem;
      p{
        margin-bottom: 0.2rem;
      }
      span{
        display: inline-block;
        margin: 0 0.15rem  0.2rem 0;
        line-height: 0.5rem;
        width: 1.56rem;
        height: 0.5rem;
        text-align: center;
        border:1px solid rgba(255,255,255,1);
        color: white;

      }
      .active{
        border: 1px solid #FFE131;
        color: #000000;
        background-color: #FFE131;
      }
    }
    .choice-bank{
      font-size: 0.24rem;
      .choice-banks{
        padding:0.2rem 0;
        .choice-bank-page{
          margin-bottom: 0.2rem;
          input,.label,.dell-bank{
            display: inline-block;
            vertical-align: middle;
          }
          label{
            div,img{
              display: inline-block;
              vertical-align: middle;
            }
            img{
              width: 2rem;
            }
          }
          .dell-bank{
            margin-left: 0.2rem;
            color: #fc5155;
          }
        }
      }
    }
    .xiangxi{
      display: flex;
      padding: 0.3rem 0.24rem;
      .balance{
        font-size: 0.28rem;
        flex: 1;
      }
      .history{
        text-align: right;
        font-size: 0.28rem;
        flex: 1;
      }
    }
    .recharge-data{
      /*background-color: #181820;*/
      font-size:0.16rem;
      padding: 0 0.24rem;
      ul{
        padding: 0.2rem 0;
        position: relative;
        line-height: 0.7rem;
        li{
          margin-bottom: 0.2rem;
          font-size: 0.38rem;
          span{
            text-indent:0.28rem;
            text-align: left;
            background-color: #181820;
            width: 2.38rem;
            height: 0.7rem;
            position: absolute;
            left: 0;
            color:rgba(255,225,49,1);
            z-index: 2;
          }
          input{
            box-sizing: border-box;
            background-color: #181820;;
            padding: 0 0 0 2.48rem;
            position: relative;
            display: inline-block;
            height: 0.7rem;
            z-index: 1;
            width: 100%;
            border: none;
          }
        }
      }
    }
    .balance-submit{
      width: 6.7rem;
      height: 0.68rem;
      border-radius: 0.12rem;
      line-height: 0.68rem;
      background-color: rgba(255,225,49,1);
      font-size: 0.36rem;
      text-align: center;
      margin: 0 auto 0.7rem;
      color:#000;
    }
    .tops{
      padding: 0 0.24rem;
      font-size: 0.28rem;
    }
    .van-popup{
      background-color:#0E0F19;;
      width: 100%;
      height: 100%;
      .closer{
        color: #000000;
        position: absolute;
        right: 0.6rem;
        top: 0.6rem;
        width: 1rem;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.28rem;
        background-color:rgba(255,225,49,1);
      }
      .radioOptions{
        margin-top: 1.3rem;
        padding-left: 0.5rem;
        width: 6rem;
        font-size: 0.28rem;
        color: white;
      }
    }
  }
  .recharge-dialog{
    .van-cell{
      background-color: #242630;
      color: white;
    }
  }
</style>
