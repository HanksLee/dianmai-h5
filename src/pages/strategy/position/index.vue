<template>
  <div class="position" style="height:100vh;">
    <van-pull-refresh v-model="loading1" @refresh="onRefresh">
      <div class="asset-box">
        <div class="net-asset" style="overflow: hidden">
          <div class="left" style="width:60%;float:left;">
            <div class="item-100" v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'">净资产(港元)</div>
            <div class="item-100" v-else>净资产(元)</div>
            <h4>{{assetData.zichan}}</h4>
          </div>
          <div class="right" style="width:40%;float:right;">
            <div class="item-100" @click="tipsFn">
              风险值
              <i
                style="position:relative;top:-0.02rem;left:0.1rem;font-size:0.24rem;padding:0 0.1rem;border-radius:50%;border: 1px solid #FFE131;color:#FFE131;display:inline-block;"
              >?</i>
            </div>
            <h4
              v-if="(parseFloat(assetData.fengxian)*100)>100"
              style="color:#28f064;font-size:0.4rem;"
            >{{(parseFloat(assetData.fengxian)*100).toFixed(2)}}%</h4>
            <h4 v-else style="color:#FF1E3C;">{{(parseFloat(assetData.fengxian)*100).toFixed(2)}}%</h4>
          </div>
        </div>
        <div class="asset-list">
          <dl>
            <dd>
              <div class="item-100" v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'">可用资金(港元)</div>
              <div class="item-100" v-else>可用资金(元)</div>
              <h4>{{assetData.real_wallet}}</h4>
            </dd>
            <dd>
              <div class="item-100" v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'">持有盈亏(港元)</div>
              <div class="item-100" v-else>持有盈亏(元)</div>
              <h4>{{assetData.yingkui}}</h4>
            </dd>
            <dd>
              <div class="item-100" v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'">冻结资金(港元)</div>
              <div class="item-100" v-else>冻结资金(元)</div>
              <h4>{{assetData.frozen_money}}</h4>
            </dd>
          </dl>
        </div>
      </div>
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="50"
        infinite-scroll-immediate-check="false"
      >
        <li
          style="border-bottom:none;text-align:center;color:#969696;font-size:0.26rem;"
          v-if="myListData.length === 0"
        >
          <p>没有持仓订单</p>
        </li>
        <li v-for="(item,index) in myListData" :key="index" @click="clickLi(index)">
          <div class="title" v-if="firstDomain == 'dingmaohongsheng.com'">
            <i
              style="width:0.6rem;height:0.6rem;text-align:center;line-height:0.6rem;display: inline-block;font-size:0.32rem;border-radius:50%;background:#FFE131;color:#000;"
            >{{index+1}}</i>
            {{item.stock_name}}({{item.stock_code}})
            <!-- <em v-if="item.cmd == '0'">创建策略</em>
            <em v-else>创建策略</em> -->
            <span v-if="item.suspend_status == 1" style="color:rgb(255, 30, 60);float:none;">(停牌)</span>
          </div>
          <div class="title" v-else>
            <i
              style="width:0.6rem;height:0.6rem;text-align:center;line-height:0.6rem;display: inline-block;font-size:0.32rem;border-radius:50%;background:#FFE131;color:#000;"
            >{{index+1}}</i>
            {{item.stock_name}}({{item.stock_code}})
            <em v-if="item.cmd == '0'">({{text_con.text1}})</em>
            <em v-else>({{text_con.text2}})</em>
            <em v-if="item.stock_type == '1'" style="color:rgb(255, 225, 49);">(指数.)</em>
            <em v-if="item.stock_type == '2'" style="color:rgb(255, 225, 49);">(指数)</em>
            <span v-if="item.suspend_status == 1" style="color:rgb(255, 30, 60);float:none;">(停牌)</span>
          </div>
          <div class="position-con">
            <van-row>
              <van-col span="12">
                <strong>订单号</strong>
                <span>{{item.id}}</span>
              </van-col>
            </van-row>
            <van-row>
              <!-- <van-col span="12">
                <strong>盈亏</strong>
                <span :style="{ color: item.valueColor}">{{ Number(item.yk_value).toFixed(2)}}/{{item.yingkui}}</span>
              </van-col> -->
              <van-col span="12" v-if="item.market_id == '3' || item.market_id == '4'">
                <strong>盈亏</strong>
                <span
                  v-if="Number(item.yk_value) > 0 || Number(item.yingkui) > 0"
                  style="color:#28F064;"
                >{{ Number(item.yk_value).toFixed(2)}}/{{item.yingkui}}</span>
                <span
                  v-else
                  style="color:#FF1E3C;"
                >{{ Number(item.yk_value).toFixed(2)}}/{{item.yingkui}}</span>
              </van-col>
              <van-col span="12" v-else>
                <strong>盈亏</strong>
                <span
                  v-if="Number(item.yk_value) > 0 || Number(item.yingkui) > 0"
                  style="color:#FF1E3C;"
                >{{ Number(item.yk_value).toFixed(2)}}/{{item.yingkui}}</span>
                <span
                  v-else
                  style="color:#28F064;"
                >{{ Number(item.yk_value).toFixed(2)}}/{{item.yingkui}}</span>
              </van-col>
              <van-col span="12">
                <strong>开仓价</strong>
                <span v-if="item.market_id == '3'">HK${{item.open_price}}</span>
                <span v-else>￥{{item.open_price}}</span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="12">
                <strong>持有数</strong>
                <span>{{item.left_volume}}</span>
              </van-col>
              <van-col span="12">
                <strong>现价</strong>
                <span v-if="item.market_id == '3'">HK${{item.now_price}}</span>
                <span v-else>￥{{item.now_price}}</span>
              </van-col>
            </van-row>
            <div v-if="tp_sl_witch == '0'">
              <van-row v-if="Number(item.tp_money) > 0 || Number(item.sl_money) > 0">
                <van-col span="12" v-if="Number(item.tp_money) > 0">
                  <strong>止盈金额</strong>
                  <span v-if="item.market_id == '3'">HK${{item.tp_money}}</span>
                  <span v-else>￥{{item.tp_money}}</span>
                </van-col>
                <van-col span="12" v-if="Number(item.sl_money) > 0">
                  <strong>止损金额</strong>
                  <span v-if="item.market_id == '3'">HK$-{{item.sl_money}}</span>
                  <span v-else>￥-{{item.sl_money}}</span>
                </van-col>
              </van-row>
            </div>
            <div v-else>
              <van-row>
                <van-col span="12" v-if="Number(item.tp) > 0 ">
                  <strong>止盈价</strong>
                  <span v-if="item.market_id == '3'">HK${{item.tp}}</span>
                  <span v-else>￥{{item.tp}}</span>
                </van-col>
                <van-col span="12" v-if="Number(item.sl) > 0">
                  <strong>止损价</strong>
                  <span v-if="item.market_id == '3'">HK${{item.sl}}</span>
                  <span v-else>￥{{item.sl}}</span>
                </van-col>
              </van-row>
            </div>
            <div class="info" v-if="firstDomain == 'ftstrategy.net' || firstDomain == 'liangrong-fund.com'">
              <div v-if="Number(item.policy_time) === 0">
                <p v-if="Number(item.aoto_delay) !== 0 && item.market_id == '3'">* 每天15:59扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
                <p v-if="Number(item.aoto_delay) !== 0 && item.market_id !== '3'">* 每天14:59扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
                <p v-if="Number(item.aoto_delay) === 0">*{{item.policy_delay_time}}</p>
              </div>
              <div v-else>
                <p v-if="Number(item.aoto_delay) === 0">*{{item.policy_delay_time}}</p>
              </div>
              <!-- 长期持有的不关闭递延的提示信息：* 每天14:40扣除递延费，如可用金额不足，订单将被强制平仓。
              长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出
              不是长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出-->
            </div>
            <div class="info" v-else-if="firstDomain='jungdamarkets.com'">
              <div v-if="freeze_delayfee===1">
                <p v-if="item.market_id == '3'">* 每天15:40扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
                <p v-if="item.market_id !== '3'">* 每天14:40扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
              </div>
              <div>
                <p v-if="Number(item.aoto_delay) === 0">*{{item.policy_delay_time}}</p>
              </div>
              <!-- 长期持有的不关闭递延的提示信息：* 每天14:40扣除递延费，如可用金额不足，订单将被强制平仓。
              长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出
              不是长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出-->
            </div>
            <div class="info" v-else>
              <div v-if="Number(item.policy_time) === 0">
                <p v-if="Number(item.aoto_delay) !== 0 && item.market_id == '3'">* 每天15:40扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
                <p v-if="Number(item.aoto_delay) !== 0 && item.market_id !== '3'">* 每天14:40扣除递延费，如可用金额不足，订单将被强制{{textFn()}}。</p>
                <p v-if="Number(item.aoto_delay) === 0">*{{item.policy_delay_time}}</p>
              </div>
              <div v-else>
                <p v-if="Number(item.aoto_delay) === 0">*{{item.policy_delay_time}}</p>
              </div>
              <!-- 长期持有的不关闭递延的提示信息：* 每天14:40扣除递延费，如可用金额不足，订单将被强制平仓。
              长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出
              不是长期持有关闭递延的提示信息：*2019-05-06 14:50 自动卖出-->
            </div>
          </div>
          <div class="position-but" v-if="butShow === index">
            <van-row gutter="11" v-if="item.suspend_status == 1">
              <van-col span="12">
                <div
                  class="but-box"
                  v-if="item.cmd == '0'"
                  @click.stop="business(index,item.id,1,item.suspend_status)"
                >停牌赎回</div>
                <div
                  class="but-box"
                  v-if="item.cmd == '1'"
                  @click.stop="business(index,item.id,2,item.suspend_status)"
                >停牌赎回</div>
              </van-col>
              <van-col span="12">
                <div class="but-box" @click="seeDetails(item.id)">订单详情</div>
              </van-col>
            </van-row>
            <van-row gutter="11" v-else>
              <van-col span="12">
                <div
                  class="but-box"
                  v-if="item.cmd == '0'"
                  @click.stop="business(index,item.id,1,item.suspend_status)"
                >{{textX()}}</div>
                <div
                  class="but-box"
                  v-if="item.cmd == '1'"
                  @click.stop="business(index,item.id,2,item.suspend_status)"
                >{{textX()}}</div>
              </van-col>
              <van-col span="12" v-if="item.aoto_delay == '1'">
                <div class="but-box" @click.stop="deferredClosure(item.id,index)">关闭递延</div>
              </van-col>
              <van-col span="12">
                <div class="but-box" @click.stop="adjustment(item,index)">止盈止损</div>
              </van-col>
              <van-col span="12">
                <div class="but-box" @click="seeDetails(item.id)">订单详情</div>
              </van-col>
            </van-row>
          </div>
        </li>
      </ul>
    </van-pull-refresh>
    <!-- 卖出，买入 -->
    <van-dialog v-model="show" show-cancel-button @confirm="confirm">
      <div
        class="title"
        style="text-align:center;border-bottom:1px solid #32323C;padding-bottom:0.4rem;"
      >{{title}}</div>
      <div class="con">
        <van-row>
          <van-col span="7">股票名称/代码：</van-col>
          <van-col span="14">{{stock_name}} / {{stock_code}}</van-col>
        </van-row>
        <van-row>
          <van-col span="7">卖出数量：</van-col>
          <van-col span="14">
            <input type="text" v-model="sell_Count" disabled="disabled">
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">最新价格：</van-col>
          <van-col span="14">{{now_price}}</van-col>
        </van-row>
      </div>
    </van-dialog>
    <!-- 调整止盈止损金额 -->
    <van-dialog v-model="showA" show-cancel-button @confirm="confirmA">
      <div
        class="title"
        style="text-align:center;border-bottom:1px solid #32323C;padding-bottom:0.4rem;"
      >调整止盈止损</div>
      <div class="con">
        <van-row>
          <van-col span="7">股票名称/代码：</van-col>
          <van-col span="14">{{stock_name}} / {{stock_code}}</van-col>
        </van-row>
        <van-row>
          <van-col span="7">止盈金额：</van-col>
          <van-col span="14">
            <input type="text" v-model="tp_money" v-on:input="inputFunc">
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">止损金额：</van-col>
          <van-col span="14">
            <input type="text" v-model="sl_money" v-on:input="inputFunc">
          </van-col>
        </van-row>
      </div>
    </van-dialog>
    <!-- 调整止盈止损价格 -->
    <van-dialog v-model="showA1" show-cancel-button @confirm="confirmX">
      <div
        class="title"
        style="text-align:center;border-bottom:1px solid #32323C;padding-bottom:0.4rem;"
      >调整止盈止损</div>
      <div class="con">
        <van-row>
          <van-col span="7">股票名称/代码：</van-col>
          <van-col span="14">{{stock_name}} / {{stock_code}}</van-col>
        </van-row>
        <van-row>
          <van-col span="7">止盈价格：</van-col>
          <van-col span="14">
            <van-stepper
              v-model="winStopAt"
              :min="0"
              @minus="minuswinStopAtFn"
              @plus="pluswinStopAtFn"
            />
          </van-col>
        </van-row>
        <van-row>
          <van-col span="7">止损价格：</van-col>
          <van-col span="14" v-if="cmd=='0'">
            <div class="amount-select">
              <van-stepper
                v-model="loseStopAt"
                :min="0"
                @minus="minusloseStopAtFn"
                @plus="plusloseStopAtFn"
              />
            </div>
          </van-col>
          <van-col span="14" v-if="cmd=='1'">
            <div class="amount-select">
              <van-stepper
                v-model="loseStopAt"
                :min="0"
                @minus="minusloseStopAtFn"
                @plus="plusloseStopAtFn"
              />
            </div>
          </van-col>
        </van-row>
      </div>
    </van-dialog>
    <!-- 风险值弹框 -->
    <van-dialog
      v-model="showB"
      showCancelButton
      :showConfirmButton="false"
      cancelButtonText="关闭"
      class="van-dialog1"
    >
      <div class="con" style="color:#fff;font-size:0.26rem;">
        <p>风险值=净资产/冻结资金（操作资金）*100%</p>
        <p v-if="firstDomain !== 'aaclplus.com' && firstDomain !== 'zxcnmarkets.com' && firstDomain !== 'gplrds.com'">
          a、当风险值达到
          <em style="color:#FF1E3C;">{{parseFloat(assetData.risk_margin_warning)*100}}%</em>，会有风险值预警提醒
        </p>
        <p v-if="firstDomain !== 'aaclplus.com' && firstDomain !== 'zxcnmarkets.com' && firstDomain !== 'gplrds.com'">
          b、当风险值达到
          <em style="color:#FF1E3C;">{{parseFloat(assetData.risk_margin_limit)*100}}%</em>，系统强平所有单子
        </p>
        <p v-if="firstDomain == 'aaclplus.com' || firstDomain == 'zxcnmarkets.com' || firstDomain == 'gplrds.com'">
          a、当风险值达到
          <em style="color:#FF1E3C;">{{parseFloat(assetData.risk_margin_limit)*100}}%</em>，系统强平所有单子
        </p>
      </div>
    </van-dialog>
    <!-- 关闭递延-->
    <van-dialog v-model="showY" show-cancel-button @confirm="confirmY">
      <div
        class="title"
        style="text-align:center;padding-bottom:0.3rem;border-bottom:1px solid #32323C;"
      >关闭递延</div>
      <div class="con">
        <van-row>
          <van-col span="24" style="text-align:Center;">将会在{{policy_delay_time}}</van-col>
        </van-row>
      </div>
    </van-dialog>
    <!-- 调整止盈止损提示-->
    <van-dialog v-model="showX" show-cancel-button @confirm="confirmX">
      <div
        class="title"
        style="text-align:center;padding-bottom:0.3rem;border-bottom:1px solid #32323C;"
      >调整止盈止损确认</div>
      <div class="con">
        <van-row>
          <van-col span="24" style="font-size:0.28rem">当前价:{{now_price}}</van-col>
          <van-col span="24" style="font-size:0.28rem">
            止盈金额:{{tp_money}}
            <em v-if="tp_money>0">，止盈价:{{tp_price.toFixed(3)}}</em>
          </van-col>
          <van-col span="24" style="font-size:0.28rem">
            止损金额:{{sl_money}}
            <em v-if="sl_money>0">，止损价:{{sl_price.toFixed(3)}}</em>
          </van-col>
        </van-row>
      </div>
    </van-dialog>
    <!-- 加载图标 -->
    <Loading :loading="loading"></Loading>
  </div>
</template>
<script>
//关闭递延，递延今天到期，今天关闭，就今天自动平仓，不然今天关闭递延，隔一天就自动平仓
import { commonRequest } from "@/api/api-strategy";
import Loading from "@/components/Loading";
var timer = null
export default {
  name: "Position",
  components: {
    Loading
  },
  data() {
    return {
      firstDomain: null,
      loading: false,
      loading1: false,
      myListData: [],
      show: false,
      title: "",
      sell_Count: 0,
      index: 0,
      stock_name: "",
      stock_code: "",
      now_price: "",
      id: "",
      assetData: {},
      showA: false,
      tp_money: "",
      sl_money: "",
      butShow: false,
      show: false,
      busy: false,
      page: 1,
      isEnd: false,
      page_count: 1,
      pageSize: 10,
      index: 0,
      showB: false,
      suspend_status: 0,
      showY: false,
      policy_delay_time: null,
      ind: 0,
      left_volume: 0,
      open_price: 0,
      tp_price: 0,
      sl_price: 0,
      cmd: 0,
      showX: false,
      winStopAt: 0,
      loseStopAt: 0,
      showA1: false,
      tp_sl_witch: 0,
      freeze_delayfee:0,
      text_con: {},
      timer:null
    };
  },
  watch: {},
  mounted() {
    this.text_con = this.textFn1()
    const domain = document.domain;
    this.firstDomain = domain.substring(domain.indexOf(".") + 1, domain.length);
    this.query = this.$route.query || {};
    this.getMylist(true);
    this.getuserMoney();
    var self = this
    var time_t = 10000
    if(this.firstDomain == 'liangrong-fund.com' || this.firstDomain == 'boloniasia.com' || this.firstDomain == 'raytekasia.com'|| this.firstDomain == 'acarpsgroup.com'){
      //更新两融国际，ray，bolo，aca数据
       self.getRefreshTime()
    }else{
       //更新其他平台数据
       self.refreshOtherData()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    refreshOtherData(){
        var self=this
        var count=0;
        this.timer = setInterval(function(){
          count++;
          self.getuserMoney()
          self.updateData()
          if(count>200){
            //当更新次数达到200，重新获取mylist，并且重新更新数据
            count=0;
            clearInterval(this.timer)
            self.getMylist()
            self.refreshOtherData()
          }
      }, 10000);
    },
    clickLi(index) {
      if (this.butShow !== index) {
        this.butShow = index;
      } else {
        this.butShow = false;
      }
    },
    onRefresh() {
      this.page = 1;
      this.isEnd = false;
      this.myListData = [];
      this.getMylist(true);
      this.getuserMoney();
    },
    //点击风险值问号
    tipsFn() {
      this.showB = true;
    },
    //获取持仓策略
    getMylist(val) {
      this.loading = val;
      commonRequest("mylist", {
        page_no: this.page,
        page_size: this.pageSize
      }).then(res => {
        if (res.code == "200") {
          this.page += 1;
          this.page_count = res.data.page.page_count;
          this.loading1 = false;
          this.tp_sl_witch = res.data.organ.tp_sl_witch;
          this.freeze_delayfee=res.data.organ.freeze_delayfee
          if (this.page > this.page_count) {
            this.isEnd = true;
          }
          let myListData = res.data.page_data;
          this.myListData = [...this.myListData, ...myListData];
          this.stock_key=''
          for(var i=0;i<this.myListData.length;i++){
            this.stock_key+=this.myListData[i].stock_key+','
            this.myListData[i].valueColor=this.getValueColor(this.myListData[i],this.myListData[i].yk_value,this.myListData[i].yingkui)
          }
          this.loading = false;
          this.busy = false;
        } else {
          this.loading1 = false;
          this.loading = false;
          this.busy = false;
        }
      });
    },
    getValueColor(data,yk_value,yingkui){
          if(data.market_id==3||data.market_id==4){
            if(Number(yk_value) > 0 || Number(yingkui) > 0){
              return '#28F064'
            }
            else{
              return '#FF1E3C'
            }
          }else{
            if(Number(yk_value) > 0 || Number(yingkui) > 0){
              return '#FF1E3C'
            }
            else{
              return '#28F064'
            }
          }
    },
    getRefreshTime(){
      commonRequest('list',{

      }).then(res=>{
        if(res.code==200){
          var time=Number(res.data.time_t)*1000
          var self=this
          var count=0;
          this.timer = setInterval(function(){
            count++;
            self.getuserMoney()
            self.updateData()
            if(count>200){
              //当更新次数达到200次，重新获取mylist（全部数据），与及刷新参数。并更新。
              count=0;
              clearInterval(this.timer)
              self.getMylist()
              self.getRefreshTime()
            }
          }, time);
        }
      })
    },
    updateData(){
      // this.myListData = []
      //  commonRequest("mylist", {
      //   page_no: 1,
      //   page_size: this.pageSize
      // }).then(res => {
      //   if (res.code == "200") {
      //      this.myListData = res.data.page_data
      //   }
      // })
     commonRequest("price",{
        stock_key:this.stock_key
      }).then(res=>{
        if(res.code==200){
           var temp=0
           for(var i=0;i<res.data.length;i++){
             for(var j=0;j<this.myListData.length;j++){
               if(this.myListData[j].stock_name==res.data[i].stock_name){
                 //更新盈亏,更新盈亏百分比
                  if(this.myListData[j].cmd==0){
                    this.myListData[j].yk_value=(Number(res.data[i].now_price)-Number(this.myListData[j].open_price))*Number(this.myListData[j].left_volume)*Number(this.myListData[j].pip_value)
                    temp=(Number(res.data[i].now_price) - Number(this.myListData[j].open_price))/Number(this.myListData[j].open_price)*100
                    this.myListData[i].yingkui=temp.toFixed(2)+'%'
                  }else{
                    this.myListData[j].yk_value=(Number(this.myListData[j].open_price)-Number(res.data[i].now_price))*Number(this.myListData[j].left_volume)*Number(this.myListData[j].pip_value)
                    temp=(Number(this.myListData[j].open_price-Number(res.data[i].now_price)))/Number(this.myListData[j].open_price)*100
                    this.myListData[i].yingkui=temp.toFixed(2)+'%'
                  }
                 //更新现价
                 this.myListData[j].now_price=res.data[i].now_price
                 this.myListData[j].valueColor=this.getValueColor(this.myListData[j],this.myListData[j].yk_value,this.myListData[j].yingkui)
                 break;
               }
             }
           }
        }
      })
    },
    //上拉加载
    loadMore() {
      if (this.isEnd) return;
      this.busy = true;
      this.getMylist(true);
    },
    seeDetails(id) {
      this.$router.push({ name: "orderDetails", query: { id: id, type: 1 } });
    },
    //关闭递延
    confirmY() {
      commonRequest("closeaotodelay", {
        id: this.id
      }).then(res => {
        if (res.code == "200") {
          this.showY = false;
          //this.$messageSuccess(this.myListData[index].policy_delay_time);
          //this.getMylist()
          this.myListData[this.ind].aoto_delay = "0";
        } else {
          this.$message(res.msg);
        }
      });
    },
    deferredClosure(id, index) {
      this.showY = true;
      this.id = id;
      this.ind = index;
      this.policy_delay_time = this.myListData[index].policy_delay_time;
    },
    //调整止盈止损
    adjustment(val, index) {
      if (this.tp_sl_witch == "0") {
        this.showA = true;
      } else {
        this.showA1 = true;
      }
      this.stock_name = val.stock_name;
      this.stock_code = val.stock_code;
      this.tp_money = Number(val.tp_money);
      this.sl_money = Number(val.sl_money);
      this.open_price = Number(val.open_price);
      this.left_volume = Number(val.left_volume);
      this.winStopAt = Number(val.tp);
      this.loseStopAt = Number(val.sl);
      this.now_price = Number(val.now_price);
      this.id = val.id;
      this.index = index;
      this.cmd = val.cmd;
      if (this.cmd == "0") {
        console.log(this.left_volume * this.open_price + this.tp_money);
        this.tp_price =
          (this.left_volume * this.open_price + this.tp_money) /
          this.left_volume;
        this.sl_price =
          (this.left_volume * this.open_price - this.sl_money) /
          this.left_volume;
      } else {
        this.tp_price =
          (this.left_volume * this.open_price - this.tp_money) /
          this.left_volume;
        this.sl_price =
          (this.left_volume * this.open_price + this.sl_money) /
          this.left_volume;
      }
    },
    //止盈加
    pluswinStopAtFn() {
      if (
        this.myListData[this.index].market_id == "3" ||
        this.myListData[this.index].market_id == "5"
      ) {
        this.winStopAt = Number((Number(this.winStopAt) + 0.001).toFixed(3));
      } else {
        this.winStopAt = Number((Number(this.winStopAt) + 0.01).toFixed(2));
      }
    },
    //止盈减
    minuswinStopAtFn() {
      if (
        this.myListData[this.index].market_id == "3" ||
        this.myListData[this.index].market_id == "5"
      ) {
        this.winStopAt = Number((Number(this.winStopAt) - 0.001).toFixed(3));
      } else {
        this.winStopAt = Number((Number(this.winStopAt) - 0.01).toFixed(2));
      }
    },
    //止损加
    plusloseStopAtFn() {
      if (
        this.myListData[this.index].market_id == "3" ||
        this.myListData[this.index].market_id == "5"
      ) {
        this.loseStopAt = Number((Number(this.loseStopAt) + 0.001).toFixed(3));
      } else {
        this.loseStopAt = Number((Number(this.loseStopAt) + 0.01).toFixed(2));
      }
    },
    //止损减
    minusloseStopAtFn() {
      if (
        this.myListData[this.index].market_id == "3" ||
        this.myListData[this.index].market_id == "5"
      ) {
        this.loseStopAt = Number((Number(this.loseStopAt) - 0.001).toFixed(3));
      } else {
        this.loseStopAt = Number((Number(this.loseStopAt) - 0.01).toFixed(2));
      }
    },
    inputFunc() {
      if (this.cmd == "0") {
        this.tp_price =
          (this.left_volume * this.open_price + Number(this.tp_money)) /
          this.left_volume;
        this.sl_price =
          (this.left_volume * this.open_price - Number(this.sl_money)) /
          this.left_volume;
      } else {
        this.tp_price =
          (this.left_volume * this.open_price - Number(this.tp_money)) /
          this.left_volume;
        this.sl_price =
          (this.left_volume * this.open_price + Number(this.sl_money)) /
          this.left_volume;
      }
    },
    //调整止盈止损确认
    confirmA() {
      this.showX = true;
    },
    //调整止盈止损确认
    confirmX() {
      commonRequest("updatetpsl", {
        tp_money: this.tp_money,
        sl_money: this.sl_money,
        tp: this.winStopAt,
        sl: this.loseStopAt,
        tp_sl_witch: this.tp_sl_witch,
        id: this.id
      }).then(res => {
        if (res.code == "200") {
          this.myListData[this.index].tp_money = this.tp_money;
          this.myListData[this.index].sl_money = this.sl_money;
          this.myListData[this.index].tp = this.winStopAt;
          this.myListData[this.index].sl = this.loseStopAt;
          this.$messageSuccess(res.msg);
        } else {
          this.$messageFail(res.msg);
        }
      });
    },
    business(index, id, type, suspend_status) {
      if (type === 1) {
        this.title = this.textFn() + "确认";
      } else {
        this.title = this.textFn() + "确认";
      }
      this.show = true;
      this.index = index;
      this.sell_Count = this.myListData[index].left_volume;
      this.stock_name = this.myListData[index].stock_name;
      this.stock_code = this.myListData[index].stock_code;
      this.now_price = this.myListData[index].now_price;
      this.id = id;
      this.suspend_status = suspend_status;
    },
    //卖出买入确认
    confirm() {
      commonRequest("sell", {
        policy_id: this.id,
        volume: this.sell_Count,
        suspend_status: this.suspend_status
      }).then(res => {
        if (res.code == "200") {
          this.myListData.splice(this.index, 1);
          this.$messageSuccess(res.msg);
        } else {
          this.$messageFail(res.msg);
        }
      });
    },
    //获取净资产等
    getuserMoney() {
      commonRequest("userMoney").then(res => {
        if (res.code == "200") {
          this.assetData = res.data;
        }
      });
    },
    //
  }
};
</script>
<style scoped lang="scss">
.title {
  font-size: 0.32rem;
  margin-bottom: 0.42rem;
}
.position {
  li {
    border-bottom: 1px solid #32323c;
    margin-bottom: 0.5rem;
    width: 100%;
  }
  .position-con {
    border-bottom: 1px solid #32323c;
    padding-bottom: 0.4rem;
    margin-bottom: 0.4rem;
  }
  .van-row {
    margin-bottom: 0.3rem;
  }
  strong {
    font-size: 0.26rem;
    font-weight: normal;
    color: #969696;
    //width:1.2rem;
    float: left;
    margin-right: 0.16rem;
  }
  span {
    font-size: 0.26rem;
    float: left;
    line-height: 0.39rem;
  }
  .info {
    color: #969696;
    font-size: 0.24rem;
  }
  .but-box {
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    border-radius: 4px;
    color: #ffe131;
    border: 1px solid #ffe131;
    font-size: 0.32rem;
    margin-bottom: 0.3rem;
    a {
      color: #ffe131;
    }
  }
}
.van-dialog {
  width: 100%;
  top: 100%;
  -webkit-transform: translate3d(-50%, -100%, 0);
  transform: translate3d(-50%, -100%, 0);
  .van-col {
    font-size: 0.26rem;
    line-height: 0.6rem;
    input {
      border: none;
      height: 0.6rem;
      color: #000;
      padding-left: 0.2rem;
      font-size: 0.26rem;
      border-radius: 4px;
    }
  }
  .van-col--7 {
    width: 2.1rem;
    text-align: right;
  }
}
.van-dialog {
  top: 50%;
  width: 6rem;
  p {
    margin-bottom: 0.15rem;
    line-height: 0.4rem;
  }
}
</style>
