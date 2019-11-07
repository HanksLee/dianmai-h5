<template>
  <div class="pages-home">
    <Header title="行情" :issearch="true" :searchUrl="searchs"></Header>
    <van-tabs v-model="active" :line-width="width" @change="switchShares">
      <van-tab title="沪深" v-if="ft1">
        <van-notice-bar mode="closeable" left-icon="volume-o" @click="clickFn" v-if="list.length>0">
          <span @click="clickSpan(0)">一. {{title1}}</span>
          <span @click="clickSpan(1)">二. {{title2}}</span>
          <span @click="clickSpan(2)">三. {{title3}}</span>
          <span @click="clickSpan(3)">四. {{title4}}</span>
          <span @click="clickSpan(4)">五. {{title5}}</span>
        </van-notice-bar>
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index" @click="indexMarketFn(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{parseFloat(item.dif_rate).toFixed(2) }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code" :stockDetail="stockDetail" v-if="isSwitch"></timeSharing>
          <kLine :stock_code="stock_code" v-if="!isSwitch"></kLine>
        </div>
        <div class="host-shares">
          <h3>热门概念<img src="/static/img/jt.png" alt="箭头" @click="sharesList('1')"></h3>
          <ul class="flex-around host-shares-page">
            <li v-for="(item,index) in notionList" @click="sharestype(item)" :key="index">
              <p class="shares-name">{{item.plate_name}}</p>
              <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #28F064">{{parseFloat(item.dif_rate).toFixed(2)}}%</p>
              <p class="shares-upsdows" style="color: #969696">{{item.top_stock_name}}</p>
            </li>
          </ul>
        </div>
        <div class="host-shares">
          <h3>热门行业<img src="/static/img/jt.png" alt="箭头" @click="sharesList('0')"></h3>
          <ul class="flex-around host-shares-page">
            <li v-for="(item,index) in tradeList" @click="sharestype(item)" :key="index">
              <p class="shares-name">{{item.plate_name}}</p>
              <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #28F064">{{parseFloat(item.dif_rate).toFixed(2)}}%</p>
              <p class="shares-upsdows" style="color: #969696">{{item.top_stock_name}}</p>
            </li>
          </ul>
        </div>
        <div class="host-shares">
          <h3 class="flex-around agts">
            <p><span :style="updowns=='1' ? 'color:#FFE131;' : ''" style="margin-right: 0.3rem" @click="switchupdows('1')">涨幅榜</span><span :style="updowns=='2' ? 'color:#FFE131;' : ''" @click="switchupdows('2')">跌幅榜</span></p>
            <p>价格</p>
            <p>涨跌</p>
          </h3>
          <ul class="agt">
            <li  class="flex-between" v-for="(item,index) in agtLists" :key="index" @click="tianzhuan(item)">
              <p class="type">
                <span v-if="item.market_id =='0'||item.market_id =='11'" style="background-color:rgb(255,25,18)">SH</span>
                <span v-if="item.market_id =='2'||item.market_id =='1'" style="background-color:rgb(255,25,18)">SZ</span>
                <span v-if="item.market_id =='3'" style="background-color:rgb(255,97,46)">HK</span>
                <span v-if="item.market_id =='4'" style="background-color:rgb(52,132,255)">US</span>
                <span v-if="item.market_id =='5'" style="background-color:rgb(255,255,50)">ETF</span>
              </p>
              <p class="namecode">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="price">{{parseFloat(item.now_price).toFixed(2)}}</p>
              <p class="updown" :style="item.dif_rate<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" style="color: #28F064">{{parseFloat(item.dif_rate).toFixed(2)}}%</p>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="港股" v-if="ft2">
          <van-notice-bar mode="closeable" left-icon="volume-o" @click="clickFn" v-if="list.length>0">
          <span @click="clickSpan(0)">一. {{title1}}</span>
          <span @click="clickSpan(1)">二. {{title2}}</span>
          <span @click="clickSpan(2)">三. {{title3}}</span>
          <span @click="clickSpan(3)">四. {{title4}}</span>
          <span @click="clickSpan(4)">五. {{title5}}</span>
        </van-notice-bar>
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in hongkongData" :key="index" @click="indexMarketFn1(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money>0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money>0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape1">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code1" :stockDetail="stockDetail" v-if="isSwitch1"></timeSharing>
          <kLine :stock_code="stock_code1" v-if="!isSwitch1"></kLine>
        </div>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in HongKongList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price || 0 }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)<0" style="color:#FF0A0A">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,8,0)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,8,0)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="ETF" v-if="ft3">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index" @click="indexMarketFn2(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape2">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code2" :stockDetail="stockDetail" v-if="isSwitch2"></timeSharing>
          <kLine :stock_code="stock_code2" v-if="!isSwitch2"></kLine>
        </div>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in etfproductList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,6,0)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,6,0)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="期货" v-if="ft4">
         <van-notice-bar mode="closeable" left-icon="volume-o" @click="clickFn" v-if="list.length>0">
          <span @click="clickSpan(0)">一. {{title1}}</span>
          <span @click="clickSpan(1)">二. {{title2}}</span>
          <span @click="clickSpan(2)">三. {{title3}}</span>
          <span @click="clickSpan(3)">四. {{title4}}</span>
          <span @click="clickSpan(4)">五. {{title5}}</span>
        </van-notice-bar>
        <van-tabs v-model="futureActive" @change="switchfutureType">
          <van-tab v-for="item in markettypeData" :key="item.key" :title="item.name"></van-tab>
        </van-tabs>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong" v-if="futureList.length>0">
            <li class="flex-between" v-for="(item,index) in futureList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,9,0)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,9,0)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
          <div class="no-data" v-else>暂无数据</div>
        </div>
      </van-tab>
      <!-- 点差，cfd -->
      <van-tab title="指数" v-if="ft5">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index" @click="indexMarketFn3(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape3">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code3" :stockDetail="stockDetail" v-if="isSwitch3"></timeSharing>
          <kLine :stock_code="stock_code3" v-if="!isSwitch3"></kLine>
        </div>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">买价/卖价</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in cfdproductList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.buy_price }}/<br />{{ item.sell_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,12,2)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,12,2)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <!-- 原为指数. -->
      <van-tab title="指数" v-if="ft6">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index" @click="indexMarketFn3(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape3">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code3" :stockDetail="stockDetail" v-if="isSwitch3"></timeSharing>
          <kLine :stock_code="stock_code3" v-if="!isSwitch3"></kLine>
        </div>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">买价/卖价</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in cfdproductList1" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.buy_price }}/{{ item.sell_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,12,1)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,12,1)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="科创板" v-if="ft7">
        <ul class="shares-top flex-between">
          <li v-for="(item, index) in marketData" :key="index" @click="indexMarketFn2(item,index)">
            <!--<p :style="aa == '1' ? 'color: rgba(64, 158, 255, 0.56);' : 'color:rgba(140, 147, 157, 0.31)'"></p>-->
            <p class="shares-name">{{ item.stock_name }}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-quotation" style="color: #FF1E3C">{{parseFloat(item.now_price).toFixed(2)}}</p>
            <p :style="item.dif_money<0 ? 'color:rgba(40,240,100,1);' : 'color:rgba(255,30,60,1)'" class="shares-upsdows" style="color: #FF1E3C"><span>{{ item.dif_money }}</span><span>{{ item.dif_rate }}%</span></p>
          </li>
        </ul>
        <div v-if="onTheTape2">
          <p style="font-size:0.34rem;padding:0.14rem 0.2rem;">{{title_stock}}行情
            <strong @click="retractFn" style="float:right;font-size:0.3rem;font-weight:100;">收起</strong>
          </p>
          <div class="tab-box">
            <span v-for="(item,index) in tabData" :key="index" :class="{active:isActive === index}" @click="tabFn(index)">{{item.value}}</span>
          </div>
          <timeSharing :stock_code="stock_code2" :stockDetail="stockDetail" v-if="isSwitch2"></timeSharing>
          <kLine :stock_code="stock_code2" v-if="!isSwitch2"></kLine>
        </div>
        <div class="hong-kong-stocks">
          <h3 class="flex-between">
            <span class="hong-kong-name">股票名称</span>
            <span class="hong-kong-price">最新价格</span>
            <span class="hong-kong-updouws">涨跌幅</span>
            <span class="hong-kong-operation" style="text-align: right">操作</span>
          </h3>
          <ul class="hong-kong">
            <li class="flex-between" v-for="(item,index) in stibproductList" :key="index">
              <p class="hong-kong-name">
                <span>{{item.stock_name}}</span>
                <span>{{item.stock_code}}</span>
              </p>
              <p class="hong-kong-price">{{ item.now_price }}</p>
              <div class="hong-kong-updouws">
                <span v-if="Number(item.dif_rate)>0" style="color:#FF0A0A">+{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
                <span v-else style="color: #28F064">{{Number(item.dif_rate).toFixed(2) || 0}}%</span>
              </div>
              <div class="hong-kong-operation business">
                <button @click="goStrategy(item,11,0)" v-if="url == 'zggjcenter.com'">交易</button>
                <button @click="goStrategy(item,11,0)" v-else>{{textFn3()}}</button>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
    <Footer></Footer>
  </div>
</template>
<script>
  import Header from '../../components/Header'
  import Footer from '../../components/Footer'
  import timeSharing from '../strategy/echarts/time-sharing'
  import kLine from '../strategy/echarts/k-line'
  import {commonRequest} from '../../api/api-home'
  import { compare } from 'semver'
  export default {
    name: 'strategy',
    components: {
      Header,
      Footer,
      timeSharing,
      kLine
    },
    data () {
      return {
        navListData:[],
        ft1: false,
        ft2: false,
        ft3: false,
        ft4: false,
        ft5: false,
        ft6: false,
        ft7: false,
        list:[],
        title1: '',
        title2: '',
        title3: '',
        title4: '',
        title5: '',
        updowns:'1',
        active:sessionStorage.getItem('activeIndex')||0,
        quoteDownList:JSON.parse(sessionStorage.getItem("quoteDownList"))||[],
        timer:'',
        hongkongData:[],
        marketData: [],
        searchs: '/search', // 查询
        HongKongList: JSON.parse(sessionStorage.getItem("HongKongList"))||[], // 港股列表
        etfproductList: JSON.parse(sessionStorage.getItem("etfproductList"))||[], //ETF列表
        stibproductList: [],//科创板列表
        cfdproductList: [],//指数列表
        cfdproductList1: [],//指数.列表
        width:30,
        sharesup: 0,
        pricesrc: '/static/img/px.png',
        updouwsrc: '/static/img/px.png',
        notionList:JSON.parse(sessionStorage.getItem("notionList"))||[], // 热门概念
        tradeList:JSON.parse(sessionStorage.getItem("tradeList"))||[], // 热门行业
        agtList:JSON.parse(sessionStorage.getItem("agtList"))||[],
        agtLists:JSON.parse(sessionStorage.getItem("agtList"))||[],
        title_stock: '',
        isSwitch:true,
        onTheTape:false,
        stock_code: '',
        isSwitch1:true,
        onTheTape1:false,
        stock_code1: '',
        isSwitch2:true,
        onTheTape2:false,
        stock_code2: '',
        isSwitch3:true,
        onTheTape3:false,
        stock_code3: '',
        isActive: 0,
        tabData:[{
            id: 1,
            value: '分时'
          },{
            id: 2,
            value: '日K'
        }],
        stockDetail:{
          close_price:0
        },
        futureList:[],
        markettypeData:[],
        futureActive:0,
        m_id: 6,
        market_open_type_arr:[],
        url:null
      }
    },
    created () {
      const domain = document.domain;
      const firstDomain = domain.substring(
      domain.indexOf(".") + 1,
      domain.length
    );
    this.url = firstDomain;
      this.getnavList()
      this.hot()
      this.hksearch()
      this.etfproduct()
      this.stibproduct()
      this.cfdproduct()
      this.cfdproduct1()
      // if(this.active == '0'){
      //   this.hot()
      // }else if(this.active == '1'){
      //   this.hksearch()
      // }else {
      //   this.etfproduct()
      // }
      this.updateMarketIndex()
      this.getList()
      this.timer1 = setInterval(this.updateMarketIndex, 5000)
      this.timer2 = setInterval(this.hot, 180000)
      this.timer3 = setInterval(this.hksearch, 180000)
      this.timer4 = setInterval(this.etfproduct, 180000)
    },
    beforeDestroy() {
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      clearInterval(this.timer3)
      clearInterval(this.timer4)
    },
    methods: {
      //获取tab导航列表
      getnavList(){
        commonRequest('navList').then(res=>{
          if(res.code == '200'){
             this.navListData = res.data.value.split(',');
             this.market_open_type_arr = res.data.market_open_type.split(',');
             localStorage.setItem('market_open_type',this.market_open_type_arr[0])
             for(let i=0;i<this.market_open_type_arr.length;i++){
              //  console.log(this.market_open_type_arr[i])
               if(this.market_open_type_arr[i] == '6'){
                  this.markettypeData.push({key:this.market_open_type_arr[i],name:'上期所'})
               }
               if(this.market_open_type_arr[i] == '7'){
                  this.markettypeData.push({key:this.market_open_type_arr[i],name:'大商所'})
               }
               if(this.market_open_type_arr[i] == '8'){
                  this.markettypeData.push({key:this.market_open_type_arr[i],name:'郑商所'})
               }
               if(this.market_open_type_arr[i] == '9'){
                  this.markettypeData.push({key:this.market_open_type_arr[i],name:'中金所'})
               }
               if(this.market_open_type_arr[i] == '10'){
                  this.markettypeData.push({key:this.market_open_type_arr[i],name:'上期能源'})
               }
             } 
             for(let i=0;i<this.navListData.length;i++){
                if(this.navListData[i] == '10' ){
                  this.ft1 = true   //沪深
                }
                if(this.navListData[i] == '8' ){
                  this.ft2 = true   //港股
                }
                if(this.navListData[i] == '6' ){
                  this.ft3 = true   //ETF
                }
                if(this.navListData[i] == '9' ){
                  this.ft4 = true   //期货
                }
                if(this.navListData[i] == '12' ){
                  this.ft5 = true    //指数
                }
                if(this.navListData[i] == '13' ){
                  this.ft6 = true
                }
                if(this.navListData[i] == '11' ){
                  this.ft7 = true //科创板
                }
             }
             if(this.markettypeData.length>0){
              this.m_id = this.markettypeData[0].key
              this.getfuture()
             }
          }
        })
      },
      //获取公告
      getList(){
        commonRequest('list',{
          page: 1,
          page_size: 5,
        }).then(res=>{
          if(res.code == '200'){
             this.list = res.data.page_data
             this.title1 = this.list[0].title
             this.title2 = this.list[1].title
             this.title3 = this.list[2].title
             this.title4 = this.list[3].title
             this.title5 = this.list[4].title
          }
        })
      },
      clickSpan(val){
        this.$router.push({path:'notice',query:{id:this.list[val].id}})
      },
      switchupdows(type){
        if (type== '1'){
         this.updowns='1'
          this.agtLists=this.agtList
        } else {
          this.updowns='2'
          this.agtLists=this.quoteDownList
        }
      },
      // 跳转
      tianzhuan(item){
        this.$router.push({name:'strategy', query: {stock_code: item.stock_code, key: item.market_id,index:0,stock_type:0}})
      },
      // 股票分类页面
      sharestype(a) {
        this.$router.push({name: 'sharesType',query:{type: a.plate_name,plate_type:a.plate_type,plate_code:a.plate_code}})
      },
      // 热门概念分类
      hot() {
        commonRequest('hot', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("notionList",JSON.stringify(res.data.notion))
            sessionStorage.setItem("tradeList",JSON.stringify(res.data.trade))
            sessionStorage.setItem("agtList",JSON.stringify(res.data.quote))
            sessionStorage.setItem("quoteDownList",JSON.stringify(res.data.quote))
            this.notionList=res.data.notion
            this.tradeList=res.data.trade
            this.agtList=res.data.quote
            this.quoteDownList=res.data.quoteDown
            this.agtLists=this.agtList
          }
        })
      },
      // 获取大盘数据
      updateMarketIndex () {
        let indexData = []
        let hongkongData = []
        let sc = document.createElement('script')
        sc.onload = () => {
          document.getElementsByTagName('head')[0].removeChild(sc)
          sc = null
          if (window.hq_str_s_sh000001) {
            let t = window.hq_str_s_sh000001.split(',')
            indexData.push({stock_code: 'sh000001', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          if (window.hq_str_s_sz399001) {
            let t = window.hq_str_s_sz399001.split(',')
            indexData.push({stock_code: 'sz399001', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          if (window.hq_str_s_sz399006) {
            let t = window.hq_str_s_sz399006.split(',')
            indexData.push({stock_code: 'sz399006', stock_name: t[0], now_price: t[1], dif_money: parseFloat(t[2]).toFixed(2), dif_rate: parseFloat(t[3]).toFixed(2)})
          }
          if (window.hq_str_rt_hkHSI) {
            let t = window.hq_str_rt_hkHSI.split(',')
            hongkongData.push({stock_code: 'HSI', stock_name: t[1], now_price: t[6], dif_money: parseFloat(t[7]).toFixed(2), dif_rate: parseFloat(t[8]).toFixed(2)})
          }
          if (window.hq_str_rt_hkHSCEI) {
            let t = window.hq_str_rt_hkHSCEI.split(',')
            hongkongData.push({stock_code: 'HSCEI', stock_name: '恒生国企指数', now_price: t[6], dif_money: parseFloat(t[7]).toFixed(2), dif_rate: parseFloat(t[8]).toFixed(2)})
          }
          if (window.hq_str_rt_hkHSCCI) {
            let t = window.hq_str_rt_hkHSCCI.split(',')
            hongkongData.push({stock_code: 'HSCCI', stock_name: '红筹指数', now_price: t[6], dif_money: parseFloat(t[7]).toFixed(2), dif_rate: parseFloat(t[8]).toFixed(2)})
          }
          this.marketData = indexData
          this.hongkongData= hongkongData
        }
        sc.src = 'https://bd-hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sz399006,rt_hkHSI,rt_hkHSCEI,rt_hkHSCCI'
        document.getElementsByTagName('head')[0].appendChild(sc)
      },
      // 判断搜索类型
      switchShares(index,title) {
        sessionStorage.setItem('activeIndex',index);
        this.onTheTape = false
        this.onTheTape1 = false
        this.onTheTape2 = false
        this.onTheTape3 = false
        // if(this.active == '0'){
        //   this.onTheTape = false
        //   this.onTheTape1 = false
        //   this.onTheTape2 = false
        //   this.onTheTape3 = false
        // }
        // else if(this.active == '1'){
        //   this.onTheTape = false
        //   this.onTheTape2 = false
        //   this.onTheTape3 = false
        // }else if(this.active == '2'){
        //   this.onTheTape1 = false
        //   this.onTheTape = false
        //   this.onTheTape3 = false
        // }else if(this.active == '3'){
        //   this.onTheTape = false
        //   this.onTheTape1 = false
        //   this.onTheTape2 = false
        //   this.onTheTape3 = false
        // }else if(this.active == '4'){
        //   this.onTheTape = false
        //   this.onTheTape1 = false
        //   this.onTheTape2 = false
        // }
      },
      // 股票点买点卖sell_type，1是T+0,0是其他的
      goStrategy(stock,key,stock_type) {
        if(stock_type == '0'){
          this.$router.push({name:'strategy', query: {stock_code: stock.stock_code, key: key,index:0,stock_type: stock_type}})
        }else{
          this.$router.push({name:'strategy1', query: {stock_code: stock.stock_code, key: key,index:0,stock_type: stock_type}})
        }
      },
      // 港股列表
      hksearch() {
        commonRequest('hksearch', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("HongKongList",JSON.stringify(res.data.page_data))
            this.HongKongList = res.data.page_data
          }
        })
      },
      // ETF列表
      etfproduct() {
        commonRequest('etfproduct', {}).then(res => {
          if (res.code === 200 && res.data) {
            sessionStorage.setItem("etfproductList",JSON.stringify(res.data.page_data))
            this.etfproductList = res.data.page_data
          }
        })
      },
      //科创板列表
      stibproduct() {
        commonRequest('stibproduct', {}).then(res => {
          if (res.code === 200 && res.data) {
            this.stibproductList = res.data.page_data
          }
        })
      },
      // 指数 列表
      cfdproduct(){
        commonRequest('cfdproduct',{
          stock_type: 2,
        }).then(res=>{
          if(res.code == '200'){
             this.cfdproductList = res.data.page_data
          }
        })
      },
      // 指数. 列表
      cfdproduct1(){
        commonRequest('cfdproduct',{
          stock_type: 1,
        }).then(res=>{
          if(res.code == '200'){
             this.cfdproductList1 = res.data.page_data
          }
        })
      },
      // 热门概念列表
      sharesList(a) {
        this.$router.push({name: 'hostShaares',query:{type: a}})
      },
      // 排序
      rsortKey(array, key) {
        // 价格
        if(key == 'price'){
          if(this.pricesrc == '/static/img/px.png'|| this.pricesrc == '/static/img/jpx.png'){
            this.pricesrc = '/static/img/spx.png'
            this.updouwsrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x = a[key]
              var y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.pricesrc == '/static/img/spx.png'){
            this.pricesrc = '/static/img/jpx.png'
            this.updouwsrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x = b[key]
              var y = a[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
        }else {
          if(this.updouwsrc == '/static/img/px.png'|| this.updouwsrc == '/static/img/jpx.png'){
            this.updouwsrc = '/static/img/spx.png'
            this.pricesrc = '/static/img/px.png'
            // 升序
            return array.sort(function (a, b) {
              var x = a[key]
              var y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
          else if(this.updouwsrc == '/static/img/spx.png'){
            this.updouwsrc = '/static/img/jpx.png'
            this.pricesrc = '/static/img/px.png'
            // 降序
            return array.sort(function (a, b) {
              var x = b[key]
              var y = a[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
            })
          }
        }
        return array.sort(function (a, b) {
          var x = b[key]
          var y = a[key]
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        })
      },
      //查看指数行情
      indexMarketFn(val,index){
         this.onTheTape = true
         this.isSwitch = true
         this.isActive = 0
         this.stock_code = val.stock_code
         this.title_stock = val.stock_name
         this.stockDetail.close_price = Number(Number(val.now_price).toFixed(2)) - Number(Number(val.dif_money).toFixed(2))
      },
      //查看港股指数行情
      indexMarketFn1(val,index){
         this.onTheTape1 = true
         this.isSwitch1 = true
         this.isActive = 0
         this.stock_code1 = val.stock_code
         this.title_stock = val.stock_name
         this.stockDetail.close_price = Number(Number(val.now_price).toFixed(2)) - Number(Number(val.dif_money).toFixed(2))
      },
      //查看etf指数行情
      indexMarketFn2(val,index){
         this.onTheTape2 = true
         this.isSwitch2 = true
         this.isActive = 0
         this.stock_code2 = val.stock_code
         this.title_stock = val.stock_name
         this.stockDetail.close_price = Number(Number(val.now_price).toFixed(2)) - Number(Number(val.dif_money).toFixed(2))
      },
      //查看指数.行情
      indexMarketFn3(val,index){
         this.onTheTape3 = true
         this.isSwitch3 = true
         this.isActive = 0
         this.stock_code3 = val.stock_code
         this.title_stock = val.stock_name
         this.stockDetail.close_price = Number(Number(val.now_price).toFixed(2)) - Number(Number(val.dif_money).toFixed(2))
      },
      retractFn(){
        this.onTheTape = false
        this.onTheTape1 = false
        this.onTheTape2 = false
        this.onTheTape3 = false
      },
      //分时日k切换
     tabFn(index){
      this.isActive = index
      if(index === 0){
        this.isSwitch = true
        this.isSwitch1 = true
        this.isSwitch2 = true
        this.isSwitch3 = true
      }else{
        this.isSwitch = false
        this.isSwitch1 = false
        this.isSwitch2 = false
        this.isSwitch3 = false
      }
    },
    //获取期货
    getfuture(){
      commonRequest('future',{
        market_id: this.m_id
      }).then(res=>{
        if(res.code == '200'){
           this.futureList = res.data.page_data
        }
      })
    },
    //获取期货分类tab
    // getmarkettype(){
    //   commonRequest('markettype').then(res=>{
    //     if(res.code == '200'){
    //        for(let i=0;i<res.data.length;i++){
    //          for(let k=0;k<this.market_open_type_arr.length;k++){
    //             if(res.data[i].key == this.market_open_type_arr[k]){

    //             }
    //          }
    //           if(res.data[i].key == '6'){
    //            this.markettypeData.push({key:res.data[i].key,name:'上期所'})
    //           }
    //           if(res.data[i].key == '7'){
    //            this.markettypeData.push({key:res.data[i].key,name:'大商所'})
    //           }
    //           if(res.data[i].key == '8'){
    //            this.markettypeData.push({key:res.data[i].key,name:'郑商所'})
    //           }
    //           if(res.data[i].key == '9'){
    //            this.markettypeData.push({key:res.data[i].key,name:'中金所'})
    //           }
    //           if(res.data[i].key == '10'){
    //            this.markettypeData.push({key:res.data[i].key,name:'上期能源'})
    //           }
    //        }
    //        console.log(this.markettypeData)
    //     }
    //   })
    // },
    switchfutureType(val){
      console.log(val)
      this.m_id = this.markettypeData[val].key
      console.log(this.markettypeData[val].key)
      this.getfuture()
    },
    clickFn(){}
    },
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
  .pages-home{
    height: 100%;
    overflow: auto;
    padding-bottom: 1rem;
    font-size: 0;
    color: white;
    .shares-top{
      margin-top: 0.2rem;
      font-size: 0.28rem;
      li{
        box-sizing: border-box;
        width:2.22rem;
        height:1.9rem;
        padding: 0.3rem 0.2rem;
        background:rgba(24,24,32,1);
        border-radius:0.12rem;
        .shares-name{
          font-size:0.28rem;
          color:rgba(255,255,255,1);
          line-height:0.40rem;
        }
        .shares-quotation{
          font-size:0.36rem;
          margin: 0.1rem 0;
          color:rgba(255,30,60,1);
          line-height:0.42rem;
        }
        .shares-upsdows{
          font-size:0.24rem;
          color:rgba(255,30,60,1);
          line-height:0.28rem;
          span:nth-child(1){
            margin-right: 0.12rem;
          }
        }
      }
    }
    .host-shares{
      border-radius: 0.12rem;
      padding: 0 0.2rem;
      background:rgba(24,24,32,1);
      h3{
        font-size:0.24rem;
        font-weight:400;
        color:rgba(150,150,150,1);
        line-height:0.34rem;
        border-bottom: 1px solid rgba(50,50,60,1);
        margin: 0.2rem 0;
        padding: 0.2rem 0;
        img{
          float: right;
          width: 0.4rem;
        }
      }
      >.agts{
        p:nth-child(3),p:nth-child(2){
          text-align: right;
          flex: 1;
        }
     p:nth-child(1){
       width: 2.88rem;
       text-align: left

     }
      }
      .host-shares-page{
        li{
          flex: 1;
          padding-bottom: 0.3rem;
          .shares-name{
            font-size:0.28rem;
            color:rgba(255,255,255,1);
            line-height:0.4rem;
          }
          .shares-quotation{
            font-size:0.28rem;
            margin: 0.1rem 0 0.18rem;
            color:rgba(40,240,100,1);
            line-height:0.32rem;
          }
          .shares-upsdows{
            font-size: 0.22rem;
            color:rgba(150,150,150,1);
            line-height:0.32rem;
          }
        }
      }
    }
    .hong-kong-stocks{
      h3{
        padding: 0.4rem 0 0.2rem 0;
        border-bottom: 1px solid rgba(50,50,60,1);
        margin-bottom: 0.32rem;
        span{
          position: relative;
          color:rgba(150,150,150,1);
          font-size: 0.24rem;
          line-height: 0.34rem;
        }
        .hong-kong-name{
          width: 2rem;
        }
        .hong-kong-price{
          width: 1.8rem;
          text-align: center;
          margin-right: 0.4rem;
        }
        .hong-kong-updouws{
          width: 1.2rem;
          text-align: right;
        }
        .hong-kong-operation{
          flex: 1;
        }
        img{
          position: absolute;
          width: 0.24rem;
          top: 0.04rem;
          z-index: 20;
        }
      }
      .hong-kong{
        li{
          font-size: 0.28rem;
          margin-bottom: 0.7rem;
          .hong-kong-name{
            width: 2rem;
            span:nth-child(1){
              display: block;
              line-height: 0.4rem;
              margin-bottom: 0.08rem;
            }
            span:nth-child(2){
              display: block;
              font-size: 0.24rem;
              line-height:0.28rem;
              color:rgba(150,150,150,1);
            }
          }
          .hong-kong-price{
            width: 2rem;
            margin-right: 0.4rem;
            text-align: center;
            font-size: 0.32rem;
          }
          .hong-kong-updouws{
            position: relative;
            width: 1.2rem;
            text-align: right;
            font-size: 0.32rem;
            line-height: 0.38rem;
            span{
              display: inline-block;
              width: 1.2rem;
              text-align: right;
              color:rgba(255,10,10,1);
            }
          }
          .hong-kong-operation{
            position: relative;
            flex: 1;
            button{
              position: absolute;
              padding: 0;
              width:1.1rem;
              height:0.5rem;
              color:rgba(255,225,49,1);
              font-size: 0.24rem;
              text-align: center;
              border-radius:0.08rem;
              border:1px solid rgba(255,225,49,1);
              background-color: #0E0F19;
            }
            button:nth-child(1){
              right: 0;
              top:-0.12rem;
            }
            button:nth-child(2){
              right: 0;
              top:0.5rem;
            }
          }
        }
      }
    }
    .agt{
      margin-top: 0.5rem;
      li{
        align-items: center;
        font-size: 0.28rem;
        margin-bottom: 0.5rem;
        .type{
          width: 0.5rem;
          margin-right: 0.1rem;
          text-align: left;
          span{
            padding: 0 0.05rem;
            font-size: 0.20rem;
            color: #1e1e28;
          }
        }
        .namecode{
          width: 2.28rem;
          span:first-child{
            display: block;
            line-height: 0.4rem;
            margin-bottom: 0.08rem;
          }
          span:last-child{
            display: block;
            font-size: 0.24rem;
            line-height: 0.28rem;
            color: #969696;
          }
        }
        .price,.updown{
          text-align: right;
          flex:1
        }
      }
      li:last-child{
        margin-bottom: 0;
      }
    }
  }
  .tab-box{
    padding:0.2rem 0 0.2rem;
    position:relative;
    z-index:100;
    span{
      color:#969696;
      display:inline-block;
      padding:0 0.3rem;
      font-size:0.2rem;
    }
    span.active{
      color:#FFE131;
    }
  }
  .tab-ul{
    padding:0.2rem 0;
    font-size:0;
    border-bottom:1px solid rgba(50,50,60,1);
    li{
      text-align:Center;
      width: 20%;
      color:#969696;
      font-size:0.26rem;
      display:inline-block;
    }
  }
  .no-data{
    padding:0.3rem 0;
    text-align:center;
    color:#969696;
    font-size:0.24rem;
  }
</style>
