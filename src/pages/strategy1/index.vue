<template>
  <div class="pages-con">
    <Header :title="textFn3()" :issearch="true" :searchUrl="searchs"></Header>
    <van-tabs v-model="active" :line-width="width" @click="onClick">
      <van-tab :title="title">
        <van-row class="row1" :class="{active:echartsShow === false}">
          <van-col span="11" style="height:0.74rem;">
            <div class="left" style="float:left;position:relative;top:0.1rem;padding-right:0.1rem;">
              <h3 style="font-size:0.2rem;color:#ffe131;position:relative;top:-0.08rem;" v-if="query.stock_type == '2'">指数</h3>
              <h3 style="font-size:0.2rem;color:#ffe131;position:relative;top:-0.08rem;" v-if="query.stock_type == '1'">指数.</h3>
              <span
                v-if="stockDetail.market_id =='0'||stockDetail.market_id =='11'"
                style="background-color:rgb(255,25,18); padding: 0 0.05rem;font-size: 0.20rem;color:#000;"
              >SH</span>
              <span
                v-if="stockDetail.market_id =='2'||stockDetail.market_id =='1'"
                style="background-color:rgb(255,25,18); padding: 0 0.05rem;font-size: 0.20rem;color:#000;"
              >SZ</span>
              <span
                v-if="stockDetail.market_id =='3'"
                style="background-color:rgb(255,97,46);padding: 0 0.05rem;font-size: 0.20rem;color:#000;"
              >HK</span>
              <span
                v-if="stockDetail.market_id =='4'"
                style="background-color:rgb(52,132,255);padding: 0 0.05rem;font-size: 0.20rem;color:#000;"
              >US</span>
              <span
                v-if="stockDetail.market_id =='5'"
                style="background-color:rgb(255,255,50);padding: 0 0.05rem;font-size: 0.20rem;color:#000;"
              >ETF</span>
            </div>
            <div class="right" style="float:left;">
              <h2 class="subtitle">{{stockDetail.stock_name}}</h2>
              <span class="stock-code">{{stockDetail.stock_code}}</span>
            </div>
          </van-col>
          <van-col span="8">
            <h3
              class="price"
              :class="{active: Number(stockDetail.dif_money) < 0}"
              v-if="query.key == '8' || query.key == '7'"
            >
              <div style="left: -0.4rem;position:relative;">
                <span v-if="stockDetail.suspend_status == 1">0</span>
                <span v-else>{{buy_price || 0}} / {{sell_price || 0}}</span>
              </div>
            </h3>
            <h3 class="price" :class="{active: Number(stockDetail.dif_money) > 0}" v-else>
              <div style="left: -0.4rem;position:relative;">
                <span v-if="stockDetail.suspend_status == 1">0</span>
                <span v-else>{{buy_price || 0}} / {{sell_price || 0}}</span>
              </div>
            </h3>
            <div class="chg">
              <span
                :class="{active: Number(stockDetail.dif_money) < 0}"
                v-if="query.key == '8' || query.key == '7'"
              >{{stockDetail.dif_money}}</span>
              <span
                :class="{active: Number(stockDetail.dif_money) > 0}"
                v-else
              >{{stockDetail.dif_money}}</span>
              <span
                :class="{active: Number(stockDetail.dif_rate) < 0}"
                v-if="query.key == '8' || query.key == '7'"
              >{{Number(stockDetail.dif_rate).toFixed(3) + '%' || 0+'%'}}</span>
              <span
                :class="{active: Number(stockDetail.dif_rate) > 0}"
                v-else
              >{{Number(stockDetail.dif_rate).toFixed(3) + '%' || 0+'%'}}</span>
            </div>
          </van-col>
          <van-col span="5">
            <div class="but-box" @click="seeMarket">查看行情</div>
          </van-col>
        </van-row>
        <div class="echarts-box" v-if="echartsShow">
          <Echarts
            :stock_code="stockDetail.stock_code"
            :stockDetail="stockDetail"
            ref="getEchartsDetail"
          ></Echarts>
        </div>
        <div class="row-box" v-if="isItTradable">
          <dl class="row2 operation-row">
            <dt>手数</dt>
            <dd>
              <van-field v-model="buyingQuantity" placeholder="请输入手数" @input="lotsInput" />
              <p>（可买最小手数{{min_money}}手，最大可买手数{{max_money}}手）</p>
            </dd>
          </dl>
          <dl class="row2 operation-row">
            <dt>止盈价</dt>
            <dd>
              <van-field v-model="tp" placeholder="请输入止盈价" />
            </dd>
          </dl>
         <dl class="row2 operation-row">
            <dt>止损价</dt>
            <dd>
              <van-field v-model="sl" placeholder="请输入止损价" />
            </dd>
          </dl>
          <dl class="row2">
            <dt>手续费</dt>
            <dd>
              <span v-if="stockDetail.market_id == '3'">
                HK${{service_charge}}
              </span>
              <span v-else>
                ￥{{service_charge}}
              </span>
            </dd>
          </dl>
          <dl class="row2">
            <dt>递延费</dt>
            <dd>
              <span v-if="stockDetail.market_id == '3'">
                HK${{delay_money}}/{{delay_money1}}
              </span>
              <span v-else>
                ￥{{delay_money}}/{{delay_money1}}
              </span>
            </dd>
          </dl>
          <!-- <dl class="row2 traders-funds">
            <dt>产品类型</dt>
            <dd>
              <span
                v-for="(item,index) in policy"
                :key="index"
                :class="{active: isActive3 == index}"
                @click="productSwitching(index)"
              >{{item.policy_name}}</span>
            </dd>
          </dl> -->
        </div>
        <div class="row-box1" v-if="isItTradable">
          <dl
            class="row2"
            v-if="open_rate > 0 && stockDetail.market_id == '3' || stockDetail.market_id == '4'"
          >
            <dt>参考汇率</dt>
            <dd>{{open_rate}}</dd>
          </dl>
          <dl class="row2">
            <dt>总计</dt>
            <dd>￥{{total}}/{{total1}}元</dd>
          </dl>
          <!-- <p v-if="policy_time == 0">* 总计=操作资金+服务费</p>
          <p v-else>* 总计=操作资金+服务费+递延费*天数</p> -->
        </div>
        <div v-if="isItTradable">
          <div class="row-box2" v-if="margin_status.length === 2">
            <div
              class="but-box1"
              style="margin-right:0.1rem;"
              @click="submit(0)"
              v-if="url == 'dingmaohongsheng.com'"
            >创建策略</div>
            <div class="but-box1" style="margin-right:0.1rem;" @click="submit(0)" v-else>多头合约</div>
            <div class="but-box1" @click="submit(1)" v-if="url == 'dingmaohongsheng.com'">创建策略</div>
            <div class="but-box1" @click="submit(1)" v-else>空头合约</div>
          </div>
          <div class="row-box2" v-else>
            <div
              class="but-box1"
              style="margin-right:0.1rem;"
              @click="submit(0)"
              v-if="stockDetail.margin_status == '0' && url == 'dingmaohongsheng.com'"
            >创建策略</div>
            <div
              class="but-box1"
              style="margin-right:0.1rem;"
              @click="submit(0)"
              v-if="stockDetail.margin_status == '0' && url !== 'dingmaohongsheng.com'"
            >多头合约</div>
            <div
              class="but-box1"
              @click="submit(1)"
              v-if="stockDetail.margin_status == '1' && url == 'dingmaohongsheng.com'"
            >买跌/做空</div>
            <div
              class="but-box1"
              @click="submit(1)"
              v-if="stockDetail.margin_status == '1' && url !== 'dingmaohongsheng.com'"
            >空头合约</div>
          </div>
        </div>
      </van-tab>
      <van-tab title="持仓">
        <Position></Position>
      </van-tab>
      <van-tab title="结算">
        <Settlement></Settlement>
      </van-tab>
    </van-tabs>
    <van-dialog v-model="show" show-cancel-button @confirm="getBuy">
      <div class="title">确认下单</div>
      <div class="con">请确认是否已详细了解交易所需的费用和可能面临的风险，点击继续提交订单，订单将以市价成交。</div>
    </van-dialog>
    <div class="footer">
      <Footer></Footer>
    </div>
    <Loading :loading="loading"></Loading>
  </div>
</template>
<script>
//按手数收手续费，每手乘于金额，
//按百分比收手续费，每手的总金额乘于百分比乘于百分比，
//可买手数，投入的操作资金乘于杠杆除于合约百分比除于每手的吨数除于每吨的价格
//买入数量*当前价格*每手的吨数+止盈金额/买入数量*每手的吨数 = 止盈价
import { setStockCodeCookie } from "@/utils/user";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import Position from "../strategy/position/index";
import Settlement from "../strategy/settlement/index";
import Echarts from "../strategy/echarts/index";
import { commonRequest } from "@/api/api-strategy";
var timer = null;
export default {
  name: "strategy",
  components: {
    Header,
    Footer,
    Loading,
    Position,
    Settlement,
    Echarts
  },
  data() {
    return {
      title: null,
      searchs: "/search",
      loading: false,
      echartsShow: false,
      active: 0,
      width: 30,
      query: {},
      stockDetail: {},
      buyfeeData: {},
      policy_money: 0,
      operationFund: 0,
      capita: 0, //记录操盘资金
      buyingQuantity: 1,
      show: false,
      isActive: 0,
      isActive1: 0,
      isActive2: 0,
      isActive3: 0,
      operateData: [],
      customer: {},
      policy: {},
      serviceCharge: 0, //服务费
      serviceCharge1:0,
      deferred_charges: 0, //递延费
      deferred_charges1: 0, //递延费
      policy_time: 0, //持仓时间
      open_rate: 0, //参考汇率
      total: 0, //总计
      total1:0,
      id: null,
      ind: 0,
      margin_status: [],
      tpData: null,
      tpValue: "",
      slData: null,
      slValue: "",
      cmd: 0,
      echartsDetail: false,
      content: "",
      title: "",
      sell_type: null,
      stopCue: null, //止盈提示价
      stopCue1:null,
      url: null,
      userinfo: {},
      market_trade_type_arr: [],
      isItTradable: false,
      text: "",
      tp_sl_witch: 0,
      winStopAt: 0, //多止盈价
      winStopAt1: 0, //空止盈价
      loseStopAt: 0, //多止损价
      loseStopAt1: 0, //空止损价
      lowestStop: 0, //多止损价阀值
      lowestStop1: 0, //空止损价阀值
      tp_limit: "",
      sl_limit: "",
      leverageSelect: 0,
      step: 0.01,
      stock_type: 1,
      buy_price: 0,
      sell_price: 0,
      contract_size: 0,
      service_charge: 0,
      max_money: 0,
      min_money: 0,
      buy_commission: 0,
      tp: 0,
      sl: 0,
      delay_money: 0,
      delay_money1:0,
      delay_days:0,
    };
  },
  mounted() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.market_trade_type_arr = this.userinfo.market_trade_type.split(",");
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url = firstDomain;
    this.title = "策略";
    if(this.url == "boloniasia.com"){
      this.title = "订单";
    }
    this.query = this.$route.query || {};
    this.active = this.$route.query.index;
    setStockCodeCookie(this.query);
    if (this.active == "0") {
      this.getDetail();
      timer = setInterval(this.getDetailTime, 10000);
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  },
  methods: {
    lotsInput(){
      this.service_charge = Number(this.buy_commission * this.buyingQuantity).toFixed(2)
      this.total = Number(Number(this.buy_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge)
      this.total1 = Number(Number(this.sell_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge)
      this.delay_money = Number(this.stockDetail.lots_size * this.buyingQuantity * this.buy_price * this.policy[0].delay_fee).toFixed(2)
      this.delay_money1 = Number(this.stockDetail.lots_size * this.buyingQuantity * this.sell_price * this.policy[0].delay_fee).toFixed(2)
    },
    onClick(index) {
      this.$router.push({
        name: "strategy1",
        query: {
          stock_code: this.query.stock_code,
          sell_type: this.sell_type,
          key: this.query.key,
          index: index,
          stock_type: this.query.stock_type
        }
      });
    },
    //查看行情
    seeMarket() {
      if (this.echartsShow) {
        this.echartsShow = false;
      } else {
        this.echartsShow = true;
      }
    },
    //定时器调getDetailTime
    getDetailTime() {
       const domain = document.domain
      const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
      var stockCode=null
      if(firstDomain == 'huachihk.com'||firstDomain=='huifengstocks.com'){
        stockCode = '00001'
      }else if(firstDomain == 'raytekasia.com' || firstDomain == 'acarpsgroup.com'){
        stockCode ='510500'
      }else{
        stockCode =  '000001';
      }
      commonRequest("detail", {
        stock_code: this.query.stock_code?this.query.stock_code:stockCode,
        type: this.query.key,
        stock_type: this.query.stock_type?this.query.stock_type:1
      }).then(res => {
        if (res.code == "200") {
          this.stockDetail = res.data;
          this.stock_type = this.stockDetail.margin.stock_type;
          this.buy_price = this.stockDetail.margin.buy_price;
          this.sell_price = this.stockDetail.margin.sell_price;
          this.margin_status = this.stockDetail.margin_status.split(",");
        }
      });
    },
    getDetail() {
      this.loading = true;
      var stockCode = null
      const domain = document.domain
      const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
      if(firstDomain == 'huachihk.com'||firstDomain=='huifengstocks.com'){
        stockCode = '00001'
      }else if(firstDomain == 'raytekasia.com' || firstDomain == 'acarpsgroup.com'){
        stockCode ='510500'
      }else{
        stockCode =  '000001';
      }
      commonRequest("detail", {
        stock_code: this.query.stock_code?this.query.stock_code:stockCode,
        type: this.query.key,
        stock_type: this.query.stock_type?this.query.stock_type:1
      }).then(res => {
        if (res.code == "200") {
          this.stockDetail = res.data;
          this.stock_type = this.stockDetail.margin.stock_type;
          this.buy_price = this.stockDetail.margin.buy_price;
          this.sell_price = this.stockDetail.margin.sell_price;
          this.margin_status = this.stockDetail.margin_status.split(",");
          this.getBuyfee(this.query.stock_code, this.query);
          if (
            this.stockDetail.market_id == "3" ||
            this.stockDetail.market_id == "5"
          ) {
            this.step = 0.001;
          } else {
            this.step = 0.01;
          }
          for (let i = 0; i < this.market_trade_type_arr.length; i++) {
            if (this.stockDetail.market_id == this.market_trade_type_arr[i]) {
              this.isItTradable = true;
            }
          }
        }else{
          this.loading = false;
          this.$message(res.msg);
        }
      });
    },
    getBuyfee(val, query) {
      commonRequest("buyfee", {
        stock_code: val,
        demo_flag: 0,
        stock_type: this.query.stock_type
      }).then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.buyfeeData = res.data;
          this.customer = res.data.customer;
          this.policy = res.data.policy;
          this.sell_type = this.policy[0].sell_type;
          this.delay_days = this.policy[0].delay_days
          this.buyingQuantity = this.policy[0].min_money
          this.max_money =   this.policy[0].max_money
          this.min_money =   this.policy[0].min_money
          this.buy_commission = this.policy[0].buy_commission
          this.delay_money = Number(this.stockDetail.lots_size * this.buyingQuantity * this.buy_price * this.policy[0].delay_fee).toFixed(2)
          this.delay_money1 = Number(this.stockDetail.lots_size * this.buyingQuantity * this.sell_price * this.policy[0].delay_fee).toFixed(2)
          this.service_charge = Number(this.buy_commission * this.buyingQuantity).toFixed(2)
          if(this.delay_days == '0'){
            this.total = Number(Number(this.buy_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge)
            this.total1 = Number(Number(this.sell_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge)
          }else{
            this.total = Number(Number(this.buy_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge) + (Number(this.delay_money) * this.delay_days)
            this.total1 = Number(Number(this.sell_price * this.buyingQuantity * this.stockDetail.lots_size * this.stockDetail.margin.margin_rate).toFixed(2)) + Number(this.service_charge) + (Number(this.delay_money1) * this.delay_days)
          }
        } else {
          this.$message(res.msg);
        }
      });
    },
    //产品切换
    productSwitching(index) {
      this.ind = index;
      this.isActive3 = index;
      this.isActive1 = 0;
      this.isActive2 = 0;

      this.max_money =   this.policy[index].max_money
      this.min_money =   this.policy[index].min_money
      this.buy_commission = this.policy[index].buy_commission
      this.delay_money = this.stockDetail.lots_size * this.buyingQuantity * this.buy_price * this.policy[index].delay_fee
      this.sell_type = this.policy[this.ind].sell_type;
    },
    //买卖点击
    submit(val) {
      this.show = true;
      this.cmd = val;
    },
    //买卖确认提交 涨停只能做空不能做多
    getBuy() {
      if (this.tp_sl_witch == "0") {
        this.winStopAt = 0;
        this.loseStopAt = 0;
      }
      if (this.tp_sl_witch == "1") {
        this.tpValue = 0;
        this.slValue = 0;
      }
      //cmd：0为多，1为空
      let tp = 0,
        sl = 0,
        priceVlaue=0,
        buyingQuantityvalue = 0;
      if (this.cmd == "0") {
        tp = this.winStopAt;
        if (this.leverageSelect == "1") {
          sl = 0;
        } else {
          sl = this.loseStopAt;
        }
        priceVlaue = this.buy_price
        buyingQuantityvalue = this.buyingQuantity
      } else {
        tp = this.winStopAt1;
        if (this.leverageSelect == "1") {
          sl = 0;
        } else {
          sl = this.loseStopAt1;
        }
        priceVlaue = this.sell_price
        buyingQuantityvalue = this.buyingQuantity
      }
      commonRequest("buy", {
        stock_code: this.stockDetail.stock_code,
        init_margin: 0,
        leverage: Number(this.capita) / Number(this.operationFund) || 0,
        assign_price: priceVlaue,
        assign_volume: buyingQuantityvalue,
        policy_type: this.policy[0].id,
        tp: this.tp || 0,
        sl: this.sl || 0,
        margin_status: this.query.margin_status,
        sell_type: this.sell_type,
        cmd: this.cmd,
        is_demo: 0,
        coupon_code: "",
        tp_money: 0,
        sl_money: 0,
        tp_sl_witch: this.tp_sl_witch,
        stock_type: this.query.stock_type
      }).then(res => {
        if (res.code == "200") {
          this.$messageSuccess(res.msg);
          this.$router.push({
            name: "strategy1",
            query: {
              stock_code: this.query.stock_code,
              sell_type: this.sell_type,
              key: this.query.key,
              index: 1,
              stock_type: this.query.stock_type
            }
          });
        } else {
          this.$messageFail(res.msg);
        }
      });
    },
    fhFn() {
      this.echartsDetail = false;
    }
  }
};
</script>
<style scoped lang="scss">
.pages-con {
  color: #fff;
  padding-bottom: 1rem;
  height: 100%;
  overflow: auto;
}

.row1 {
  border-bottom: 1px solid #32323c;
  padding-bottom: 0.42rem;
  //  margin-bottom:0.3rem;
}
.row1.active {
  margin-bottom: 0.3rem;
}
.subtitle {
  font-size: 0.32rem;
  color: #fff;
}
.stock-code {
  color: #969696;
  font-size: 0.24rem;
}
.price {
  color: #28f064;
  font-size: 0.36rem;
}
.price.active {
  color: #ff1e3c;
}
.chg {
  font-size: 0;
}
.chg span {
  color: #28f064;
  font-size: 0.24rem;
  position: relative;
  left: -0.3rem;
  display: inline-block;
  padding-right: 0.2rem;
}
.chg span.active {
  color: #ff1e3c;
}
.but-box {
  width: 1.2rem;
  height: 0.5rem;
  border: 1px solid #ffe131;
  font-size: 0.24rem;
  color: #ffe131;
  text-align: center;
  line-height: 0.5rem;
  border-radius: 4px;
  float: right;
  margin-top: 0.18rem;
}
.row-box {
  border-bottom: 1px solid #32323c;
  margin-bottom: 0.3rem;
}
.row2 {
  overflow: hidden;
  margin-bottom: 0.3rem;
  dt {
    color: #969696;
    float: left;
    width: 1.2rem;
    font-size: 0.26rem;
  }
  dd {
    width: 5.66rem;
    float: right;
    border-radius: 6px;
    font-size: 0.26rem;
  }
}
.operation-fund {
  line-height: 0.9rem;
  dd {
    background: #1e1e28;
    height: 0.9rem;
  }
}
.traders-funds {
  font-size: 0;
  margin-bottom: 0.14rem;
  dt {
    line-height: 0.5rem;
  }
  dd {
    height: auto;
    line-height: 0;
    span {
      display: inline-block;
      font-size: 0.24rem;
      min-width: 1.2rem;
      height: 0.5rem;
      line-height: 0.52rem;
      text-align: center;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 1);
      color: #fff;
      margin-bottom: 0.2rem;
      margin-right: 0.2rem;
      padding: 0 3px;
      &.active {
        background: #ffe131;
        border: 1px solid #ffe131;
        color: #000;
      }
    }
  }
}
.row-box1 {
  margin-bottom: 0.8rem;
  dd {
    font-weight: 0.36rem;
    color: #ffe131;
  }
  p {
    color: #969696;
    font-size: 0.24rem;
  }
}
.row-box2 {
  text-align: center;
  margin-bottom: 0.72rem;
  .but-box1 {
    display: inline-block;
    width: 2.5rem;
    height: 0.9rem;
    background: #ffe131;
    color: #000;
    font-size: 0.32rem;
    line-height: 0.9rem;
    border-radius: 6px;
    font-weight: bold;
  }
}
.van-dialog__content {
  .title {
    text-align: center;
    font-size: 0.36rem;
    margin-bottom: 0.28rem;
  }
  .con {
    margin-bottom: 0.08rem;
    text-align: center;
    font-size: 0.26rem;
  }
}
.search-box {
  position: relative;
  background: rgba(30, 30, 40, 1);
  margin: 0.3rem 0;
  border-radius: 6px;
  img {
    width: 0.28rem;
    position: absolute;
    top: 0.17rem;
    left: 0.2rem;
  }
  input {
    height: 0.6rem;
    width: 6rem;
    border: none;
    background: rgba(30, 30, 40, 1);
    font-size: 0.28rem;
    line-height: 0.6rem;
    padding: 0;
    margin-left: 0.6rem;
  }
  ::-webkit-input-placeholder {
    color: #ccc;
    font-size: 0.28rem;
  }
}
.common-problem-top {
  padding-bottom: 0.3rem;
  padding-top: 0.3rem;
  border-bottom: 1px solid #32323c;
  margin-bottom: 0.3rem;
  position: relative;
  h3 {
    position: absolute;
    left: 0;
    top: 0.3rem;
    text-align: Center;
    width: 100%;
    z-index: 2;
    font-size: 0.34rem;
  }
  img {
    width: 0.27rem;
    height: 0.47rem;
    display: block;
    position: relative;
    z-index: 3;
  }
}
.common-problem {
  margin-top: -0.5rem;
  color: #fff;
  padding: 0.5rem 0.3rem;
  .title {
    text-align: center;
    margin-bottom: 0.3rem;
    font-size: 0.26rem;
  }
  .textcont {
    font-size: 0.22rem;
    line-height: 0.42rem;
    p {
      margin-bottom: 0.2rem !important;
    }
  }
}

.form-content input {
  width: 5.66rem;
  float: right;
  border-radius: 6px;
  border: none;
  font-size: 0.26rem;
  color: #fff;
  line-height: 0.9rem;
  background: #1e1e28;
  text-align: center;
}
</style>
