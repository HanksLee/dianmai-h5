<template>
  <div class="pages-con">
    <Header title="交易" :issearch="true" :searchUrl="searchs" v-if="url == 'zggjcenter.com'"></Header>
    <Header :title="textFn3()" :issearch="true" :searchUrl="searchs" v-else></Header>
    <van-tabs v-model="active" :line-width="width" @click="onClick">
      <van-tab :title="title">
        <van-row class="row1" :class="{active:echartsShow === false}">
          <van-col span="11" style="height:0.74rem;">
            <div class="left" style="float:left;position:relative;top:0.1rem;padding-right:0.1rem;">
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
              <span v-if="stockDetail.suspend_status == 1">{{stockDetail.close_price}}</span>
              <span v-else>{{now_price || 0}}</span>
            </h3>
            <h3 class="price" :class="{active: Number(stockDetail.dif_money) > 0}" v-else>
              <span v-if="stockDetail.suspend_status == 1">{{stockDetail.close_price}}</span>
              <span v-else>{{now_price || 0}}</span>
            </h3>
            <div
              class="chg"
              v-if="stockDetail.suspend_status == 1"
              style="color:rgb(255, 25, 18);font-size:0.18rem;"
            >停牌</div>
            <div class="chg" v-else>
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
            :seeEchartsDetail="seeEchartsDetail"
            ref="getEchartsDetail"
          ></Echarts>
        </div>
        <div class="row-box" v-if="isItTradable">
          <dl class="row2 operation-fund">
            <dt>{{bond_name}}</dt>
            <dd>
              <van-stepper
                v-model="operationFund"
                :min="0"
                :step="100"
                @change="changeOperationFund"
              />
            </dd>
          </dl>
          <dl class="row2 traders-funds">
            <dt>操盘资金</dt>
            <dd>
              <span
                v-for="(item,index) in operateData"
                :key="index"
                :class="{active:isActive === index}"
                @click="capitaFn(index,ind)"
              >{{item * operationFund}}</span>
            </dd>
          </dl>
          <dl class="row2">
            <dt>买入数量</dt>
            <dd>
              <span>{{buyingQuantity}}</span>
            </dd>
          </dl>
          <dl class="row2 traders-funds" v-if="tpData && tp_sl_witch == '0'">
            <dt>触发止盈</dt>
            <dd v-if="stockDetail.market_id == '3'">
              <span
                v-for="(item,index) in tpData"
                :key="index"
                :class="{active: isActive1 === index}"
                @click="selectionTp(item,index)"
              >HK${{Math.floor(item*operationFund)}}</span>
            </dd>
            <dd v-else>
              <span
                v-for="(item,index) in tpData"
                :key="index"
                :class="{active: isActive1 === index}"
                @click="selectionTp(item,index)"
              >￥{{Math.floor(item*operationFund)}}</span>
            </dd>
          </dl>
          <dl class="row2 traders-funds" v-if="slData && tp_sl_witch == '0'">
            <dt>触发止损</dt>
            <dd v-if="stockDetail.market_id == '3'">
              <span
                v-for="(item,index) in slData"
                :key="index"
                :class="{active: isActive2 === index}"
                @click="selectionSl(item,index)"
              >HK$-{{Math.floor(item*operationFund)}}</span>
            </dd>
            <dd v-else>
              <span
                v-for="(item,index) in slData"
                :key="index"
                :class="{active: isActive2 === index}"
                @click="selectionSl(item,index)"
              >￥-{{Math.floor(item*operationFund)}}</span>
            </dd>
          </dl>
          <!-- 这里是止盈↓ -->
          <div v-if="margin_status.length === 2">
            <div v-if="margin_status[0] == '0' || margin_status[1] == '0'">
              <dl class="row2 operation-fund" v-if="Number(tp_limit) !== 0 && tp_sl_witch == '1'">
                <dt>多头止盈</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="winStopAt"
                      :min="0"
                      @minus="minuswinStopAtFn(0)"
                      @plus="pluswinStopAtFn(0)"
                    />
                  </div>
                </dd>
              </dl>
            </div>
            <div v-if="margin_status[0] == '1' || margin_status[1] == '1'">
              <dl class="row2 operation-fund" v-if="Number(tp_limit) !== 0 && tp_sl_witch == '1'">
                <dt>空头止盈</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="winStopAt1"
                      :min="0"
                      @minus="minuswinStopAtFn(1)"
                      @plus="pluswinStopAtFn(1)"
                    />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div v-else>
            <div v-if="margin_status[0] == '0'">
              <dl class="row2 operation-fund" v-if="Number(tp_limit) !== 0 && tp_sl_witch == '1'">
                <dt>多头止盈</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="winStopAt"
                      :min="0"
                      @minus="minuswinStopAtFn(0)"
                      @plus="pluswinStopAtFn(0)"
                    />
                  </div>
                </dd>
              </dl>
            </div>
            <div v-if="margin_status[0] == '1'">
              <dl class="row2 operation-fund" v-if="Number(tp_limit) !== 0 && tp_sl_witch == '1'">
                <dt>空头止盈</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="winStopAt1"
                      :min="0"
                      @minus="minuswinStopAtFn(1)"
                      @plus="pluswinStopAtFn(1)"
                    />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <!-- 这里是止盈↑ -->

          <!-- 这里是止损↓ -->
          <div v-if="margin_status.length === 2 && leverageSelect > 1">
            <div v-if="margin_status[0] == '0' || margin_status[1] == '0'">
              <dl class="row2 operation-fund" v-if="Number(sl_limit) !== 0 && tp_sl_witch == '1'">
                <dt>多头止损</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="loseStopAt"
                      :min="lowestStop"
                      :max="Number(stockDetail.now_price)"
                      @minus="minusloseStopAtFn(0)"
                      @plus="plusloseStopAtFn(0)"
                      @change="changeLoseStopAt"
                    />
                  </div>
                </dd>
              </dl>
            </div>
            <div v-if="margin_status[0] == '1' || margin_status[1] == '1'">
              <dl class="row2 operation-fund" v-if="Number(sl_limit) !== 0 && tp_sl_witch == '1'">
                <dt>空头止损</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="loseStopAt1"
                      :min="Number(stockDetail.now_price)"
                      :max="lowestStop1"
                      @minus="minusloseStopAtFn(1)"
                      @plus="plusloseStopAtFn(1)"
                      @change="changeLoseStopAt1"
                    />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div v-if="margin_status.length === 1 && leverageSelect > 1">
            <div v-if="margin_status[0] == '0'">
              <dl class="row2 operation-fund" v-if="Number(sl_limit) !== 0 && tp_sl_witch == '1'">
                <dt>多头止损</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="loseStopAt"
                      :min="lowestStop"
                      :max="Number(stockDetail.now_price)"
                      @minus="minusloseStopAtFn(0)"
                      @plus="plusloseStopAtFn(0)"
                      @change="changeLoseStopAt"
                    />
                  </div>
                </dd>
              </dl>
            </div>
            <div v-if="margin_status[0] == '1'">
              <dl class="row2 operation-fund" v-if="Number(sl_limit) !== 0 && tp_sl_witch == '1'">
                <dt>空头止损</dt>
                <dd class="form-content">
                  <div class="amount-select">
                    <van-stepper
                      v-model="loseStopAt1"
                      :min="Number(stockDetail.now_price)"
                      :max="lowestStop1"
                      @minus="minusloseStopAtFn(1)"
                      @plus="plusloseStopAtFn(1)"
                      @change="changeLoseStopAt1"
                    />
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <!-- 这里是止损↑ -->

          <dl class="row2">
            <dt>服务费</dt>
            <dd>
              <span v-if="stockDetail.market_id == '3'">
                HK${{serviceCharge}}
                <em>（{{text}}）</em>
              </span>
              <span v-else>
                ￥{{serviceCharge}}
                <em>（{{text}}）</em>
              </span>
            </dd>
          </dl>
          <dl class="row2">
            <dt>递延费</dt>
            <dd>
              <span v-if="stockDetail.market_id == '3'">
                HK${{deferred_charges}}
                <em>（港元/交易日）</em>
              </span>
              <span v-else>
                ￥{{deferred_charges}}
                <em>（元/交易日）</em>
              </span>
            </dd>
          </dl>
          <dl class="row2 traders-funds">
            <dt>产品类型</dt>
            <dd>
              <span
                v-for="(item,index) in policy"
                :key="index"
                :class="{active: isActive3 == index}"
                @click="productSwitching(index)"
              >{{item.policy_name}}</span>
            </dd>
          </dl>
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
            <dd v-if="url=='huifengstocks.com'||url=='huachihk.com'">HK${{total}}港元</dd>
            <dd v-else>￥{{total}}元</dd>
          </dl>
          <p v-if="policy_time == 0">
            <span v-if="url=='huifengstocks.com'||url=='huachihk.com'">* 总计=冻结资金+服务费</span>
            <span v-else>* 总计=操作资金+服务费</span>
          </p>
          <p v-else>
            <span v-if="url=='huifengstocks.com'||url=='huachihk.com'">* 总计=冻结资金+服务费+递延费*天数</span>
            <span v-else-if="freeze_delayfee==1">* 总计=操作资金+服务费</span>
            <span v-else>* 总计=操作资金+服务费+递延费*天数</span>
          </p>
        </div>
        <div v-if="isItTradable">
          <div class="row-box2" v-if="margin_status.length === 2">
            <div
              class="but-box1"
              style="margin-right:0.1rem;"
              @click="submit(0)"
              v-if="url == 'dingmaohongsheng.com'"
            >创建策略</div>
            <div
              class="but-box1"
              style="margin-right:0.1rem;"
              @click="submit(0)"
              v-else
            >{{text_con.text1}}</div>
            <div class="but-box1" @click="submit(1)" v-if="url == 'dingmaohongsheng.com'">创建策略</div>
            <div class="but-box1" @click="submit(1)" v-else>{{text_con.text2}}</div>
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
            >{{text_con.text1}}</div>
            <div
              class="but-box1"
              @click="submit(1)"
              v-if="stockDetail.margin_status == '1' && url == 'dingmaohongsheng.com'"
            >买跌/做空</div>
            <div
              class="but-box1"
              @click="submit(1)"
              v-if="stockDetail.margin_status == '1' && url !== 'dingmaohongsheng.com'"
            >{{text_con.text2}}</div>
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
    <!-- 研报精选详细 -->
    <div class="common-problem-box">
      <van-popup v-model="echartsDetail" position="right" :overlay="false">
        <div class="common-problem">
          <div class="common-problem-top">
            <img class="go-return" src="/static/img/fh.png" @click="fhFn" />
            <h3>研报精选详细</h3>
          </div>
          <div class="title">{{title}}</div>
          <div class="textcont" v-html="content" v-if="!loading"></div>
        </div>
      </van-popup>
    </div>
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
import Position from "./position/index";
import Settlement from "./settlement/index";
import Echarts from "./echarts/index";
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
    Echarts,
    bond_name:'操作资金'
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
      buyingQuantity: 0,
      show: false,
      isActive: 0,
      isActive1: 0,
      isActive2: 0,
      isActive3: 0,
      operateData: [],
      customer: {},
      policy: {},
      serviceCharge: 0, //服务费
      deferred_charges: 0, //递延费
      policy_time: 0, //持仓时间
      //policy_time_text: null,
      open_rate: 0, //参考汇率
      total: 0, //总计
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
      text_con: {},
      now_price: 0,
      freeze_delayfee:0,
    };
  },
  mounted() {
    this.text_con = this.textFn1();
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.market_trade_type_arr = this.userinfo.market_trade_type.split(",");
    const domain = document.domain;
    const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url = firstDomain;
    if (this.url == "zggjcenter.com" || this.url == "liangrong-fund.com") {
      this.title = "交易";
    } else if (this.url == "boloniasia.com") {
      this.title = "订单";
    } else {
      this.title = "策略";
    }
    if(this.url=='huachihk.com'||this.url=='huifengstocks.com'){
        this.bond_name='冻结资金'
    }else{
        this.bond_name='操作资金'
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
    onClick(index) {
      this.$router.push({
        name: "strategy",
        query: {
          stock_code: this.query.stock_code,
          sell_type: this.sell_type,
          key: this.query.key,
          index: index,
          stock_type:this.query.stock_type
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
    //操作资金加减
    changeOperationFund(val) {
      this.capitaFn(this.isActive, this.ind);
    },
    //选中操盘资金
    capitaFn(val, index) {
      this.isActive = val;
      // this.operationFund = Number(this.policy[index].policy_money) * 10000
      // this.operateData = this.policy[index].policy_leverage.split(',')
      // this.capita = Math.floor(this.operateData[this.isActive] * this.operationFund)
      // this.buyingQuantity = Math.floor(this.capita / Number(this.stockDetail.now_price) / Number(this.stockDetail.lots_size)) * Number(this.stockDetail.lots_size)
      this.id = this.policy[index].id;
      this.profitCalculation(this.policy[index].tp_rate);
      this.stopLossCalculation(this.policy[index].sl_rate);
      this.leverageSelect = this.operateData[val];
      //默认进来股数计算
      this.capita = Math.floor(this.operateData[val] * this.operationFund);
      if (
        this.stockDetail.market_id == "6" ||
        this.stockDetail.market_id == "7" ||
        this.stockDetail.market_id == "8" ||
        this.stockDetail.market_id == "9" ||
        this.stockDetail.market_id == "10"
      ) {
        if (
          Number(this.stockDetail.now_price) === 0 ||
          Number(this.stockDetail.lots_size) === 0
        ) {
          this.buyingQuantity = 0;
        } else {
          if (Number(this.stockDetail.margin.margin_rate) !== 0) {
            this.buyingQuantity = Math.floor(
              Number(this.capita) /
                Number(this.stockDetail.margin.margin_rate) /
                Number(this.stockDetail.now_price) /
                Number(this.stockDetail.lots_size)
            );
          }
          //可买手数，投入的操作资金乘于杠杆除于合约百分比除于每手的吨数除于每吨的价格
        }
      } else {
        if (
          Number(this.stockDetail.now_price) !== 0 &&
          Number(this.stockDetail.lots_size) !== 0
        ) {
          this.buyingQuantity =
            Math.floor(
              this.capita /
                Number(this.stockDetail.now_price) /
                Number(this.stockDetail.lots_size)
            ) * Number(this.stockDetail.lots_size);
        }
      }
      //服务费计算
      let value = Number(this.stockDetail.now_price * this.buyingQuantity), //股数*现价
        service_fee = Number(this.policy[index].service_fee),
        guohu_fee = Number(this.policy[index].guohu_fee),
        gui_fee = Number(this.policy[index].gui_fee),
        jianguan_fee = Number(this.policy[index].jianguan_fee),
        buy_commission = Number(this.policy[index].buy_commission),
        guanglifei =
          (1 + Number(this.customer.add_service)) * service_fee * value,
        juanshangdaikou = Number((guohu_fee + gui_fee + jianguan_fee) * value),
        shouxufei =
          (1 + Number(this.customer.add_buy_commission)) *
          buy_commission *
          value;
      if (Number(this.stockDetail.market_id) !== 2) {
        juanshangdaikou = Number((guohu_fee + gui_fee) * value);
      }
      //this.serviceCharge = Number(guanglifei + shouxufei + juanshangdaikou).toFixed(2)
      // //递延费计算
      // let delay_fee = Number(this.policy[index].delay_fee)
      // this.deferred_charges = Number((1 + Number(this.customer.add_delay_fee)) * delay_fee *  this.stockDetail.now_price * this.buyingQuantity).toFixed(2)
      //持仓时间
      this.policy_time = this.policy[index].policy_time;
      //this.policy_time_text = this.policy[index].policy_time_text;
      this.open_rate = Number(this.stockDetail.open_rate);
      let delay_days = Number(this.policy[index].delay_days),
        fee_time = Number(this.policy[index].fee_time);
      //交易规费+过户费+监管费为0时，券商代收不显示
      var sumFee=Number(this.policy[index].gui_fee)+Number(this.policy[index].guohu_fee)+Number(this.policy[index].jianguan_fee)
      var strTemp="券商代收+"
      if(sumFee==0){
        strTemp=" "
      }
      //期货服务费计算market_id等于6，7，8，9，10
      if (
        this.stockDetail.market_id == "6" ||
        this.stockDetail.market_id == "7" ||
        this.stockDetail.market_id == "8" ||
        this.stockDetail.market_id == "9" ||
        this.stockDetail.market_id == "10"
      ) {
        let gmv =
          this.buyingQuantity *
          Number(this.stockDetail.now_price) *
          Number(this.stockDetail.lots_size);
        if (this.stockDetail.margin.commis_type == "1") {
          juanshangdaikou =
            this.buyingQuantity * Number(this.stockDetail.margin.commission);
        } else {
          juanshangdaikou = gmv * this.stockDetail.margin.commission;
        }
        shouxufei =
          gmv *
          Number(this.stockDetail.margin.margin_rate) *
          Number(this.policy[index].buy_commission);
        this.serviceCharge = Number(shouxufei + juanshangdaikou).toFixed(2);
        this.text = strTemp+"手续费";

        //递延费计算
        this.deferred_charges = (
          gmv *
          Number(this.stockDetail.margin.margin_rate) *
          Number(this.policy[index].delay_fee)
        ).toFixed(2);
        //总计计算
        if (this.open_rate > 0) {
          if (Number(delay_days - fee_time) > 0) {
            if(this.freeze_delayfee==1){
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge)
              ).toFixed(2);
            }else{
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge) +
                Number(delay_days - fee_time) *
                  this.deferred_charges *
                  this.open_rate
              ).toFixed(2);
            }
          } else {
            this.total = (
              (Number(this.operationFund) + Number(this.serviceCharge)) *
              this.open_rate
            ).toFixed(2);
          }
        } else {
          if (Number(delay_days - fee_time) > 0) {
            if(this.freeze_delayfee==1){
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge)
              ).toFixed(2);
            }else{
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge) +
                this.deferred_charges * Number(delay_days - fee_time)
              ).toFixed(2);
            }
          } else {
            this.total = (
              Number(this.operationFund) + Number(this.serviceCharge)
            ).toFixed(2);
          }
        }
      } else {
        this.serviceCharge = Number(
          guanglifei + shouxufei + juanshangdaikou
        ).toFixed(2);
        if (guanglifei == "0") {
          this.text = strTemp+"手续费";
        } else {
          this.text = "管理费+"+strTemp+"手续费";
        }
        //递延费计算
        let delay_fee = Number(this.policy[index].delay_fee);
        this.deferred_charges = Number(
          (1 + Number(this.customer.add_delay_fee)) *
            delay_fee *
            this.stockDetail.now_price *
            this.buyingQuantity
        ).toFixed(2);
        //总计计算
        if (this.open_rate > 0) {
          if (Number(delay_days - fee_time) > 0) {
            if(this.freeze_delayfee==1){
              this.total = (
                (Number(this.operationFund) +
                  Number(this.serviceCharge)) *
                this.open_rate
              ).toFixed(2);
            }else{
              this.total = (
                (Number(this.operationFund) +
                  Number(this.serviceCharge) +
                  Number(this.deferred_charges) * Number(delay_days - fee_time)) *
                this.open_rate
              ).toFixed(2);
            }
          } else {
            this.total = (
              (Number(this.operationFund) + Number(this.serviceCharge)) *
              this.open_rate
            ).toFixed(2);
          }
        } else {
          if (Number(delay_days - fee_time) > 0) {
            if(this.freeze_delayfee==1){
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge)
              ).toFixed(2);
            }else{
              this.total = (
                Number(this.operationFund) +
                Number(this.serviceCharge) +
                Number(this.deferred_charges) * Number(delay_days - fee_time)
              ).toFixed(2);
            }
          } else {
            this.total = (
              Number(this.operationFund) + Number(this.serviceCharge)
            ).toFixed(2);
          }
        }
      }
      this.tpReckoning();
      // 递延费=（总交易金额*最低操作资金比例）* ss_stock_policy表中的递延费比例
    },
    //定时器调getDetailTime
    getDetailTime() {
      var stockCode = null
      const domain = document.domain
      const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
      if(firstDomain == 'huachihk.com'||firstDomain == 'huifengstocks.com'){
        stockCode = '00001'
      }else if(firstDomain == 'raytekasia.com' || firstDomain == 'acarpsgroup.com'){
        stockCode ='510500'
      }else{
        stockCode =  '000001';
      }
      commonRequest("detail", {
        stock_code: this.query.stock_code?this.query.stock_code:stockCode,
        type: this.query.key,
        stock_type:this.query.stock_type?this.query.stock_type:0
      }).then(res => {
        if (res.code == "200") {
          this.stockDetail = res.data;
          this.margin_status = this.stockDetail.margin_status.split(",");
          this.now_price = this.stockDetail.now_price;
          this.tpReckoning();
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
        stock_type:this.query.stock_type?this.query.stock_type:0
      }).then(res => {
        if (res.code == "200") {
          this.stockDetail = res.data;
          this.now_price = this.stockDetail.now_price;
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
        } else {
          this.loading = false;
        }
      });
    },
    getBuyfee(val, query) {
      commonRequest("buyfee", {
        stock_code: val,
        demo_flag: 0,
        stock_type:this.query.stock_type
      }).then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.buyfeeData = res.data;
          this.customer = res.data.customer;
          this.policy = res.data.policy;
          this.operateData = this.policy[this.ind].policy_leverage.split(",");
          this.sell_type = this.policy[this.ind].sell_type;
          this.tp_sl_witch = res.data.organ.tp_sl_witch;
          this.freeze_delayfee=res.data.organ.freeze_delayfee;
          this.leverageSelect = this.policy[0].policy_leverage[0];
          if (
            this.stockDetail.market_id == "6" ||
            this.stockDetail.market_id == "7" ||
            this.stockDetail.market_id == "8" ||
            this.stockDetail.market_id == "9" ||
            this.stockDetail.market_id == "10"
          ) {
            let num = Number(this.policy[this.ind].policy_money) * 10000;
            this.operationFund =
              Math.ceil(
                (Number(this.stockDetail.now_price) *
                  Number(this.stockDetail.lots_size) *
                  Number(this.stockDetail.margin.margin_rate)) /
                  this.operateData[0] /
                  100
              ) * 100; //操作资金
            if (this.operationFund < num) {
              this.operationFund = num;
            }
          } else {
            this.operationFund =
              Number(this.policy[this.ind].policy_money) * 10000; //操作资金
          }
          this.capitaFn(0, 0); //传0默认第一次进页面值得计算
          this.tpReckoning();
        } else {
          this.$message(res.msg);
        }
      });
    },
    //止盈价计算
    tpReckoning() {
      this.sl_limit = Number(this.policy[this.ind].sl_limit);
      this.tp_limit = Number(this.policy[this.ind].tp_limit);
      this.stockDetail.now_price = parseFloat(this.stockDetail.now_price);
      if (this.margin_status.length == 2) {
        //止盈价
        if (this.margin_status[0] == "0") {
          //点买
          if (this.policy[this.ind].tp_limit == "0") {
            ////止盈线等于0的时候
            this.winStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].tp_limit == "0") {
            this.winStopAt1 = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        }
        //止盈价
        if (this.margin_status[0] == "1") {
          //点买
          if (this.policy[this.ind].tp_limit == "0") {
            ////止盈线等于0的时候
            this.winStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].tp_limit == "0") {
            this.winStopAt1 = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        }
        //当止损线不等于0的时候，需要这里计算sl_limit_value拿去于loseStopAt做比较，点买那个大止损价取大的值，点卖则取小的值
        //止损价
        if (this.margin_status[0] == "0") {
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(2);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            if (Number(this.loseStopAt) >= Number(this.sl_limit_value)) {
              this.loseStopAt = Number(this.loseStopAt);
            } else {
              this.loseStopAt = Number(this.sl_limit_value);
              this.lowestStop = Number(this.sl_limit_value);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt1 = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(2);

              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            if (Number(this.loseStopAt1) >= Number(this.sl_limit_value)) {
              this.loseStopAt1 = Number(this.sl_limit_value);
              this.lowestStop1 = Number(this.sl_limit_value);
            } else {
              this.loseStopAt1 = Number(this.loseStopAt1);
            }
          }
        }
        //止损价
        if (this.margin_status[1] == "0") {
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(2);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            if (Number(this.loseStopAt) >= Number(this.sl_limit_value)) {
              this.loseStopAt = Number(this.loseStopAt);
            } else {
              this.loseStopAt = Number(this.sl_limit_value);
              this.lowestStop = Number(this.sl_limit_value);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt1 = 0;
          } else {
            console.log(2345);
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(2);
              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            if (Number(this.loseStopAt1) >= Number(this.sl_limit_value)) {
              this.loseStopAt1 = Number(this.sl_limit_value);
              this.lowestStop1 = Number(this.sl_limit_value);
            } else {
              this.loseStopAt1 = Number(this.loseStopAt1);
            }
          }
        }
      } else {
        if (this.margin_status[0] == "0") {
          //点买
          if (this.policy[this.ind].tp_limit == "0") {
            ////止盈线等于0的时候
            this.winStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt = parseFloat(
                this.stockDetail.now_price *
                  (1 + parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].tp_limit == "0") {
            this.winStopAt1 = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(3);
            } else {
              this.winStopAt1 = parseFloat(
                this.stockDetail.now_price *
                  (1 - parseFloat(this.policy[this.ind].tp_limit))
              ).toFixed(2);
            }
          }
        }
        //止损价
        if (this.margin_status[0] == "0") {
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price * (1 - this.sl_limit)
              ).toFixed(2);
              this.loseStopAt = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop = parseFloat(
                this.stockDetail.now_price * (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            console.log("loseStopAt:" + this.loseStopAt);
            console.log("sl_limit_value:" + this.sl_limit_value);
            if (Number(this.loseStopAt) >= Number(this.sl_limit_value)) {
              this.loseStopAt = Number(this.loseStopAt);
            } else {
              this.loseStopAt = Number(this.sl_limit_value);
              this.lowestStop = Number(this.sl_limit_value);
            }
          }
        } else {
          //点卖
          if (this.policy[this.ind].sl_limit == "0") {
            this.loseStopAt1 = 0;
          } else {
            if (
              this.stockDetail.market_id == "3" ||
              this.stockDetail.market_id == "5"
            ) {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(3);
              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(3);
            } else {
              this.sl_limit_value = Number(
                this.stockDetail.now_price / (1 - this.sl_limit)
              ).toFixed(2);
              this.loseStopAt1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
              this.lowestStop1 = parseFloat(
                this.stockDetail.now_price / (1 - 1 / this.leverageSelect)
              ).toFixed(2);
            }
            console.log("loseStopAt1:" + this.loseStopAt1);
            console.log("sl_limit_value:" + this.sl_limit_value);
            if (Number(this.loseStopAt1) >= Number(this.sl_limit_value)) {
              this.loseStopAt1 = Number(this.sl_limit_value);
              this.lowestStop1 = Number(this.sl_limit_value);
            } else {
              this.loseStopAt1 = Number(this.loseStopAt1);
            }
          }
        }
      }
    },
    //止盈加
    pluswinStopAtFn(val) {
      if (
        this.stockDetail.market_id == "3" ||
        this.stockDetail.market_id == "5"
      ) {
        if (val == "0") {
          this.winStopAt = Number((Number(this.winStopAt) + 0.001).toFixed(3));
        } else {
          this.winStopAt1 = Number(
            (Number(this.winStopAt1) + 0.001).toFixed(3)
          );
        }
      } else {
        if (val == "0") {
          this.winStopAt = Number((Number(this.winStopAt) + 0.01).toFixed(2));
        } else {
          this.winStopAt1 = Number((Number(this.winStopAt1) + 0.01).toFixed(2));
        }
      }
    },
    //止盈减
    minuswinStopAtFn(val) {
      if (
        this.stockDetail.market_id == "3" ||
        this.stockDetail.market_id == "5"
      ) {
        if (val == "0") {
          this.winStopAt = Number((Number(this.winStopAt) - 0.001).toFixed(3));
        } else {
          this.winStopAt1 = Number(
            (Number(this.winStopAt1) - 0.001).toFixed(3)
          );
        }
      } else {
        if (val == "0") {
          this.winStopAt = Number((Number(this.winStopAt) - 0.01).toFixed(2));
        } else {
          this.winStopAt1 = Number((Number(this.winStopAt1) - 0.01).toFixed(2));
        }
      }
    },
    //止损加
    plusloseStopAtFn(val) {
      if (
        this.stockDetail.market_id == "3" ||
        this.stockDetail.market_id == "5"
      ) {
        if (val == "0") {
          this.loseStopAt = Number(
            (Number(this.loseStopAt) + 0.001).toFixed(3)
          );
        } else {
          this.loseStopAt1 = Number(
            (Number(this.loseStopAt1) + 0.001).toFixed(3)
          );
        }
      } else {
        if (val == "0") {
          this.loseStopAt = Number((Number(this.loseStopAt) + 0.01).toFixed(2));
        } else {
          this.loseStopAt1 = Number(
            (Number(this.loseStopAt1) + 0.01).toFixed(2)
          );
        }
      }
    },
    //止损减
    minusloseStopAtFn(val) {
      if (
        this.stockDetail.market_id == "3" ||
        this.stockDetail.market_id == "5"
      ) {
        if (val == "0") {
          this.loseStopAt = Number(
            (Number(this.loseStopAt) - 0.001).toFixed(3)
          );
        } else {
          this.loseStopAt1 = Number(
            (Number(this.loseStopAt1) - 0.001).toFixed(3)
          );
        }
      } else {
        if (val == "0") {
          this.loseStopAt = Number((Number(this.loseStopAt) - 0.01).toFixed(2));
        } else {
          this.loseStopAt1 = Number(
            (Number(this.loseStopAt1) - 0.01).toFixed(2)
          );
        }
      }
    },
    //产品切换
    productSwitching(index) {
      this.ind = index;
      this.isActive3 = index;
      this.isActive1 = 0;
      this.isActive2 = 0;
      this.operateData = this.policy[index].policy_leverage.split(",");
      this.leverageSelect = this.policy[this.ind].policy_leverage[0];
      if (
        this.stockDetail.market_id == "6" ||
        this.stockDetail.market_id == "7" ||
        this.stockDetail.market_id == "8" ||
        this.stockDetail.market_id == "9" ||
        this.stockDetail.market_id == "10"
      ) {
        let num = Number(this.policy[this.ind].policy_money) * 10000;
        this.operationFund =
          Math.ceil(
            (Number(this.stockDetail.now_price) *
              Number(this.stockDetail.lots_size) *
              Number(this.stockDetail.margin.margin_rate)) /
              this.operateData[0] /
              100
          ) * 100; //操作资金
        if (this.operationFund < num) {
          this.operationFund = num;
        }
      } else {
        this.operationFund = Number(this.policy[this.ind].policy_money) * 10000; //操作资金
      }
      this.capitaFn(0, this.ind); //传0默认第一次进页面值得计算
      this.sell_type = this.policy[this.ind].sell_type;
      this.tpReckoning();
    },
    //触发止盈计算
    profitCalculation(val) {
      if (val) {
        this.tpData = val.split(",");
        this.tpValue = Math.floor(
          this.tpData[this.isActive1] * this.operationFund
        );
        if (this.tpData.length === 1) {
          if (this.tpData[0] == 0) {
            this.tpData = null;
          }
        }
      } else {
        this.tpData = null;
        this.tpValue = 0;
      }
    },
    //选中止盈
    selectionTp(val, index) {
      this.isActive1 = index;
      this.tpValue = Math.floor(val * this.operationFund);
      let num =
        Number(this.buyingQuantity) *
          Number(this.stockDetail.now_price) *
          Number(this.stockDetail.lots_size) +
        Number(val * this.operationFund);
      let num1 =
        Number(this.buyingQuantity) * Number(this.stockDetail.lots_size);
      this.stopCue = Number(num / num1).toFixed(3);
      // alert(this.stopCue)
      //点击止盈提示，买入数量*当前价格*每手的吨数+止盈金额/买入数量*每手的吨数 = 止盈价
    },
    //触发止损计算
    stopLossCalculation(val) {
      if (val) {
        this.slData = val.split(",");
        this.slValue = Math.floor(
          this.slData[this.isActive2] * this.operationFund
        );
        if (this.slData.length === 1) {
          if (this.slData[0] == 0) {
            this.slData = null;
          }
        }
      } else {
        this.slData = null;
        this.slValue = 0;
      }
    },
    //选中止损
    selectionSl(val, index) {
      this.isActive2 = index;
      this.slValue = Math.floor(val * this.operationFund);
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
        sl = 0;
      if (this.cmd == "0") {
        tp = this.winStopAt;
        if (this.leverageSelect == "1") {
          sl = 0;
        } else {
          sl = this.loseStopAt;
        }
      } else {
        tp = this.winStopAt1;
        if (this.leverageSelect == "1") {
          sl = 0;
        } else {
          sl = this.loseStopAt1;
        }
      }
      commonRequest("buy", {
        stock_code: this.stockDetail.stock_code,
        init_margin: this.operationFund,
        leverage: Number(this.capita) / Number(this.operationFund),
        assign_price: this.stockDetail.now_price,
        assign_volume: this.buyingQuantity,
        policy_type: this.id,
        tp: tp,
        sl: sl,
        margin_status: this.query.margin_status,
        sell_type: this.sell_type,
        cmd: this.cmd,
        is_demo: 0,
        coupon_code: "",
        tp_money: this.tpValue,
        sl_money: this.slValue,
        tp_sl_witch: this.tp_sl_witch,
        stock_type:this.query.stock_type
      }).then(res => {
        if (res.code == "200") {
          this.$messageSuccess(res.msg);
          this.$router.push({
            name: "strategy",
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
    //研报精选详细
    seeEchartsDetail(id) {
      this.echartsDetail = this.$refs.getEchartsDetail.isDetitle;
      this.loading = true;
      commonRequest("greathit", {
        id: id
      }).then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.content = res.data.article;
          this.title = res.data.title;
        }
      });
    },
    fhFn() {
      this.echartsDetail = false;
    },
    // 止损提示
    changeLoseStopAt(val) {
      if (val < this.lowestStop) {
        this.$messageFail("止损价不能小于" + this.lowestStop);
      }
      if (val > this.stockDetail.now_price) {
        this.$messageFail("止损价不能大于" + this.stockDetail.now_price);
      }
    },
    // 止损提示
    changeLoseStopAt1(val) {
      if (val < this.stockDetail.now_price) {
        this.$messageFail("止损价不能小于" + this.stockDetail.now_price);
      }
      if (val > this.lowestStop1) {
        this.$messageFail("止损价不能大于" + this.lowestStop1);
      }
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
