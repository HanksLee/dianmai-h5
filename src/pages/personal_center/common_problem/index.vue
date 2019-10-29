<template>
  <div class="pages-common-problem">
    <Header title="帮助中心" :goreturn="true"></Header>
    <div class="common-problem">
      <van-collapse v-model="activeNames" accordion is-link>
        <van-collapse-item class="xsyd" title="合作协议" name="1">
          <van-collapse v-model="activeNames1" accordion class="children">
            <van-collapse-item v-for="(item,index) in xieyiList" :title="item.title" :name="index+1" :key="index">
            <div class="textcont" v-html="item.content"></div>
            </van-collapse-item>
          </van-collapse>
        </van-collapse-item>
        <van-collapse-item class="xsyd" title="交易规则" name="2" v-if="url == 'dingmaohongsheng.com'">
          <van-collapse v-model="activeNames2" accordion class="children">
            <div class="textcont" v-html="content"></div>
          </van-collapse>
        </van-collapse-item>
        <van-collapse-item class="cjwt" title="常见问题" name="3">
          <van-collapse v-model="activeNames3" accordion class="children">
            <van-collapse-item title="Q：什么是点买人，什么是投资人？" name="1">
              <p>
                点买人是指{{textFn2()}}提供人。通过平台发布股票买卖{{textFn2()}}，如选择什么股票、买多少股、止盈点和止损点分别是多少、何时买入、何时卖出；投资人是指实际购买股票的自然人或者法人。投资人提供资金，证券账号，自由选择平台上的股票{{textFn2()}}，根据实际情况匹配，并严格近日{{textFn2()}}要求买卖股票。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是点买交易？什么是点卖交易？" name="2">
              <p>点买：指点买人向投资人发出买入指令，平台为点买人撮合投资人。成功后，投资人接受点买人指令并买入点买股。</p>
              <p>点卖：点买人向投资人发出卖出指令，投资人接受点买人指令卖出点买股。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：点买时间" name="3">
              <div v-if="domainFn()">
                <p>周一到周五09：30～11：30，13：00～14：57</p>
              </div>
              <div v-else>
              <p>A股：周一至周五 9:30-11:30,13:00-15:00；</p>
              <p>ETF：周一至周五 9:30-11:30,13:00-15:00；</p>
              <p>港股：周一至周五 9:30-12:00，13:00-16:00；</p>
              </div>
            </van-collapse-item>
            <van-collapse-item title="Q：股票交易规则" name="4">
              <div v-if="domainFn()">
                <p>T+1交易规则，即当天买入不可当天卖出</p>
              </div>
              <div v-else>
              <p>A股：T+1交易规则。即当天买入，不可以当天卖出。</p>
              <p>ETF：T+0交易规则。即当天买入，可以当天卖出。</p>
              <p>港股：T+0交易规则。即可当天买卖，不限次数。</p>
              </div>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是止盈？" name="5">
              <p>止盈是该条{{textFn2()}}的盈利线，当达到预设的止盈点的时候，系统会自动发起卖出指令给投资人。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是止损？" name="6">
              <p>止损是该条{{textFn2()}}的亏损线，当达到预设的止损点的时候，系统会自动发起卖出指令给投资人。</p>
            </van-collapse-item>
            <van-collapse-item :title="title" name="7">
              <p v-if="domainFn()">
                因未履行追加操作资金义务而强行平仓。根据鼎茂宏升{{textFn2()}}规则，股票交易实行操作资金制度，每一笔交易均须交纳一定比例的操作资金，当市场发生不利变化，也就是说，市场发生行情逆转，朝相反方向变化时，{{textFn2()}}人还应根据交易规则和合约的约定，存入追加操作资金。如果{{textFn2()}}人未在被要求的时间内履行追加操作资金的义务， 鼎茂宏升{{textFn2()}}就有权对{{textFn2()}}人所持有的仓位实施强行平仓。</p>           
              <p v-else>
                因未履行追加操作资金义务而强行{{textFn()}}。根据交易所规则，期货交易实行操作资金制度，每一笔交易均须交纳一定比例的操作资金，当市场发生不利变化，也就是说，市场发生行情逆转，朝相反方向变化时，会员或客户还应根据交易规则和合约的约定，存入追加操作资金。如果会员或客户未在被要求的时间内履行追加操作资金的义务，经纪公司就有权对客户所持有的仓位实施强行{{textFn()}}。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：交易股票会产生哪些费用？" name="8">
              <div v-if="domainFn()">
                <p>建仓费：按买入股票市值收取</p>
                <p>平仓费：按卖出股票市值收取</p>
                <p>印花税：按卖出股票市值收取</p>
                <p>递延费：T+1不收取，节假日不收取，14：40过后即按股票市值收取</p>
              </div>
              <div v-else>
              <p>印花税：卖出股票时收取，按成交金额的0.1%；</p>
              <p>过户费：买入、卖出时都收取，按成交金额的0.02%；</p>
              <p>交易规费：买入、卖出时都收取，按成交价格的0.00487%</p>
              <p>证券监管费：创业板收取，买入、卖出时都收取，按成交价格的0.002%；</p>
              <p>买入手续费：最低5元；</p>
              <p>卖出手续费：最低5元。</p>
              </div> 
            </van-collapse-item>
            <van-collapse-item title="Q：什么是交易综合费？" name="9">
              <p v-if="domainFn()">交易综合费是指当{{textFn2()}}第一次发起时，{{textFn2()}}人要支付给平台的费用。</p>
              <p v-else>交易综合费是指当{{textFn2()}}第一次发起时，点买人要支付给平台的费用。只在当天收取，包括印花税、过户费、佣金、下个交易日递延费。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是履约操作资金？" name="10">
              <p v-if="domainFn()">履约操作资金为{{textFn2()}}人委托平台冻结用于履行交易亏损赔付义务的操作资金，用于{{textFn2()}}亏损时的赔付金额。如盈利，金额全数反还；如亏损，按实际亏损赔付，且履约操作资金为赔付上限，超出亏损部分由投资人承担。</p>
              <p v-else>履约操作资金为点买人委托平台冻结用于履行交易亏损赔付义务的操作资金，用于{{textFn2()}}亏损时的赔付金额。如盈利，金额全数返还；如亏损，按实际亏损赔付，且履约操作资金为赔付上限，超出亏损部分由投资人承担。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是递延费？递延条件是什么？" name="11">
              <p v-if="domainFn()">递延费是{{textFn2()}}人延期交收发生的资金。保持平台馀额充足（{{textFn2()}}需要持仓过夜，递延费需要在本交易日进行扣款，如果发现{{textFn2()}}人馀额不足，系统将平仓{{textFn2()}}人的所有持仓股票。）</p>
              <p v-else>递延费是客户延期交收发生的资金。保持平台余额充足({{textFn2()}}需要持仓过夜，递延费需要在本交易日进行扣款，如果发现点买人余额不足，系统将{{textFn()}}点买人的所有持仓股票。)</p>
            </van-collapse-item>
            <van-collapse-item title="Q：递延费扣除时间" name="12">
              <div v-if="domainFn()">
                <p>交易日的14：40，非交易日则不收取</p>
              </div>
              <div v-else>
              <h4>长期持有：</h4>
              <p>A股：{{textFn2()}}持仓当天14:40；</p>
              <p>ETF：{{textFn2()}}持仓当天14:40；</p>
              <p>港股：{{textFn2()}}持仓当天15:40；</p>
              <h4>非长期持有：</h4>
              <p>开仓时，根据可持仓天数一次性冻结所需的所有递延费用。</p>
              </div>
            </van-collapse-item>
            <van-collapse-item title="Q：递延费的计算" name="13">
              <div v-if="domainFn()">
                <p>停牌计算：按买入股票市值收取</p>
                <p>非停牌计算：按买入股票市值收取</p>
              </div>
              <div v-else>
              <p>停牌计算 ：（买入价格 * 交易数量 * 停牌递延费用万分比 / 10000）*递延天数。</p>
              <p>非停牌计算 ：（买入价格 * 交易数量 * 递延费用万分比 / 10000 ）*递延天数。</p>
              </div>
            </van-collapse-item>
            <!-- <van-collapse-item title="Q：买入费用、卖出费用的计算" name="14">
              <div v-if="domainFn()">
                <p>买入手续费：（买入价格*股数*0.0004）</p>
                <p>卖出手续费：（卖出手续费*股数*0.0004）</p>
                <p>印花税：（卖出手续费*股数*0.001）</p>
              </div>
              <div v-else>
              <h4>创业板</h4>
              <p>买入手续费：max(买入价格 * 买入股数 * 买入佣金百分比, 最低交易价格) ，不足5元按5元收取。</p>
              <p>券商代扣=（过户费+交易规费+证券监管费）*买入价格*买入数量。</p>
              <p>管理费=买入价格×买入股数×账户管理费百分比。</p>
              <p><span>买入费用</span>=手续费+券商代扣+管理费。</p>
              <p>卖出手续费：max(卖出价格 * 卖出股数 * 卖出佣金百分比, 最低交易价格)。</p>
              <p>券商代扣=（过户费+交易规费+证券监管费+印花税）*卖出价格*卖出数量。</p>
              <p><span>卖出费用</span>=手续费+券商代扣。</p>
              <h4>沪市、深市、港股、ETF</h4>
              <p>买入手续费：max(买入价格 * 买入股数 * 买入佣金百分比, 最低交易价格) ，不足5元按5元收取。</p>
              <p>券商代扣=（过户费+交易规费）*买入价格*买入数量。</p>
              <p>管理费=买入价格×买入股数×账户管理费百分比。</p>
              <p><span>买入费用</span>=手续费+券商代扣+管理费。</p>
              <p>卖出手续费：max(卖出价格 * 卖出股数 * 卖出佣金百分比, 最低交易价格)。</p>
              <p>券商代扣=（过户费+交易规费+印花税）*卖出价格*卖出数量。</p>
              <p><span>卖出费用</span>=手续费+券商代扣。</p>
              </div>
            </van-collapse-item> -->
            <van-collapse-item title="Q：什么是买入佣金百分比、卖出佣金百分比？" name="15" v-if="!domainFn()">
              <p>
                股票佣金，是投资者在委托买卖股票成交后按成交金额一定比例支付的费用。根据国家相关政策规定：A股、B股、证券投资基金的交易佣金实行最高上限向下浮动制度，证券公司向客户收取的佣金(包括代收的证券交易监管费和证券交易所手续费等)不得高于证券交易金额的3‰。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：什么是风险值？" name="16">
              <p>风险值，是一种风险指数。用来衡量整支股票相对于整个股市的价格波动情况。值越高，意味着股票相对安全，反之亦然。</p>
            </van-collapse-item>
            <van-collapse-item title="Q：风险值的计算公式" name="17">
              <p>风险值 = 净资产/冻结资金（操作资金）。</p>
            </van-collapse-item>
            <van-collapse-item :title="title1" name="18">
              <p>可能因为{{textFn2()}}订单爆仓导致系统强制{{textFn()}}。</p>
            </van-collapse-item>
          </van-collapse>
        </van-collapse-item>
      </van-collapse>
    </div>
    <Loading :loading="loadings"></Loading>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Loading from '@/components/Loading'
  import {commonRequest} from '@/api/api-authentication'

  export default {
    components: {
      Header,
      Loading
    },
    data() {
      return {
        xieyiList:JSON.parse(sessionStorage.getItem("xieyiList"))||[], // 热门概念
        // xieyiList:[],
        activeNames: this.$route.query.type || '',
        activeNames1:'',
        activeNames2: '',
        activeNames3: '',
        capitalData: [],
        page: 1,
        pageSize: 20,
        list: [],
        loadings: false,
        loading: false,
        isEnd: false,
        title:"",
        content:"",
        url:null,
        title1: '',
      }
    },
    created() {
      const domain = document.domain
      let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
      this.url = firstDomain
      if(firstDomain == 'ruthinks.com'){
          this.title = "Q：什么是强制终止合约？"
      }else{
          this.title = "Q：什么是强制平仓？"
      }
      if(firstDomain == 'liangrong-fund.com'){
        this.title1 = "Q：为什么“我的交易”中找不到已买入的交易订单？"
      }else{
        this.title1 = "Q：为什么“我的策略'”中找不到已买入的策略订单？"
      }
      this.cooperative()
      this.gettradingrule()
    },
    methods: {
      cooperative() {
        commonRequest('cooperative', {}).then(res => {
          if (res.code === 200) {
            this.xieyiList=res.data.cooperative;
            for (var i=0;i<this.xieyiList.length;i++) {
              this.xieyiList[i].content= this.xieyiList[i].content.replace(/pt/g, "").replace(/&nbsp;/g,'')
            }
          }
          sessionStorage.setItem("xieyiList",JSON.stringify(this.xieyiList))
        })
      },
      loadMore() {
        if (this.isEnd) return
        this.loading = true
        this.customerDetail()
      },
      gettradingrule(){
        commonRequest('tradingrule').then(res=>{
          if(res.code == '200'){
            this.content = res.data.content
          }
        })
      }
    },
    name: "index"
  }
</script>

<style scoped lang="scss">
  .pages-common-problem {
    color: white;
    font-size: 0.3rem;
    text-align: center;
  }
  .van-collapse-item__content h4{
        color: #a79f9f
  }
</style>
