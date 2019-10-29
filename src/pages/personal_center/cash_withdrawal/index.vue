<template>
  <div class="pages-cash-withdrawal">
    <Header title="提现" :goreturn="true"></Header>
    <div class="cash-withdrawal">
      <div class="xiangxi">
        <div class="balance">可提余额：{{ user_info.can_bring_money||'0' }}</div>
        <!--<div class="history" @click="show=true">历史记录</div>-->
      </div>
      <div class="user-data">
        <ul>
          <li><span>姓名</span><input type="text" placeholder="请输入姓名" v-model="card_info.user_name"></li>
          <li><span>省份</span><input type="text" placeholder="请输入省份" v-model="card_info.bank_province"></li>
          <li><span>城市</span><input type="text" placeholder="请输入城市" v-model="card_info.bank_city"></li>
          <li v-if="url == 'dingmaohongsheng.com'"><span>银行名称</span><input type="text" placeholder="请输入银行名称" v-model="card_info.bank_name"></li>
          <li v-else><span>开户行</span><input type="text" placeholder="请输入开户行" v-model="card_info.bank_name"></li>
          <li><span>支行</span><input type="text" placeholder="请输入支行" v-model="card_info.branch_name"></li>
          <li><span>银行卡</span><input type="text" placeholder="请输入卡号" v-model="card_info.bank_card"></li>
          <li><span>金额</span><input type="text" placeholder="请输入提现金额" v-model="card_info.money"></li>
          <li><span>备注</span><input type="text" placeholder="请输入备注" v-model="card_info.comment"></li>
        </ul>
        <div class="balance-submit" @click="onWithdraw">提交</div>
      </div>
      <div class="tops" v-html="tops">{{tops}}</div>
    </div>
    <van-popup v-model="show" position="right">
      <div class="closer" @click="show=false">关闭</div>
      <ul class="historyList">
        <li v-for="(item,index) in historyList" :key="index">
          <p>姓名：{{item.user_name}}</p>
          <p>银行卡号：{{item.bank_card}}</p>
        </li>
      </ul>
    </van-popup>
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
        user_info:{},
        card_info: {
          user_name: '',
          bank_card: '',
          bank_province: '',
          bank_city: '',
          bank_name: '',
          branch_name: '',
          money: null,
          comment: ''
        },
        historyList: [],
        show:false,
        tops:'',
        url:null
      }
    },
    created() {
      const domain = document.domain;
      const firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      this.url = firstDomain;
      this.historyBanks()
      this.userInfo()
    },
    methods:{
      // 个人信息
      userInfo() {
        commonRequest('userInfo', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.user_info=res.data.user_info
          }
          // this.$notify({
          //     message: '通知内容',
          //     duration: 1000,
          //     background: '#1989fa'
          //   });
        })
      },
      // 历史记录
      historyBanks() {
        commonRequest('historyBanks', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.tops = res.data.tip
            this.historyList=res.data.list
            console.log(this.historyList)
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
      },
       onWithdraw () {
        if (!this.card_info.user_name) {
          return this.$notify({
            message: '请填写姓名',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.card_info.bank_province) {
          return this.$notify({
            message: '请填写省份',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.card_info.bank_city) {
          return this.$notify({
            message: '请填写城市',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.card_info.bank_name) {
          if(this.url == 'dingmaohongsheng.com'){
            return this.$notify({
            message: '请填写银行名称',
            duration: 1000,
            background: '#fc5155'
            });
          }else{
            return this.$notify({
            message: '请填写开户行',
            duration: 1000,
            background: '#fc5155'
            });
          }
        }
        if (!this.card_info.branch_name) {
          return this.$notify({
            message: '请填写支行',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.card_info.bank_card) {
          return this.$notify({
            message: '请填写银行卡号',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (!this.card_info.money) {
          return this.$notify({
            message: '请填写提现金额',
            duration: 1000,
            background: '#fc5155'
          });
        }
        if (parseFloat(this.card_info.money) > parseFloat(this.can_bring_money)) {
          return this.$notify({
            message: '提现金额不能大于余额',
            duration: 1000,
            background: '#fc5155'
          });
        }
         commonRequest('outmoney',this.card_info).then(res => {
           if (res.code === 200) {
             this.$router.replace('personal_center')
             this.$notify({
               message: res.msg,
               duration: 1000,
               background: '#fc5155'
             });
           }else {
             this.$notify({
               message: res.msg,
               duration: 1000,
               background: '#fc5155'
             });
           }
         })
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
  .pages-cash-withdrawal{
    color:white;
    font-size: 0;
    .xiangxi{
      display: flex;
      padding: 0.3rem 0.24rem;
      .balance{
        text-indent: 0.28rem;
        font-size: 0.40rem;
        flex: 1;
      }
      .history{
        text-align: right;
        font-size: 0.28rem;
        flex: 1;
      }
    }
    .user-data{
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
            width: 1.58rem;
            height: 0.7rem;
            position: absolute;
            left: 0;
            color:rgba(255,225,49,1);
            z-index: 2;
            font-size:0.32rem;
          }
          input{
            box-sizing: border-box;
            background-color: #181820;;
            padding: 0 0 0 1.68rem;
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
      .historyList{
        margin-top: 1.3rem;
        padding-left: 0.5rem;
        width: 6rem;
        font-size: 0.28rem;
        color: white;
      }
    }
  }
</style>
