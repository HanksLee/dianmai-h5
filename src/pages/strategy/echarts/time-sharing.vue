<template>
  <div>
    <div id="m-line" class="m-line" style="height:5rem"></div>
  </div>
</template>
<script>
import { commonRequest } from '@/api/api-strategy'
var bgColor = "#0E0F19";//背景
var upColor="#FF1E3C";//涨颜色
var downColor="#28F064";//跌颜色
var timer = null;
function ratioCalculate(price,yclose){
	return ((price-yclose)/yclose*100).toFixed(2)
}
export default {
  name: 'timeSharing',
  data () {
    return {
    fiashChart:null,
    fiashData: [],
    query:{}
    }
  },
  watch:{
    stock_code(){
      this.getfiash()
    }
  },
   props:{
    stock_code: String,
    stockDetail: Object
  },
  mounted() {
    this.query = this.$route.query || {};
    this.getfiash()
    timer = setInterval(this.getfiash, 60000)
  },
  beforeDestroy() {
    clearInterval(timer)
  },
  methods: {
    //分时图
    timeharing(data){
      let m_datas = data
      console.log(123)
      console.log(m_datas.volume)
      m_datas.previousClose = []
      m_datas.yestclose =  this.stockDetail.close_price
      if(this.stockDetail.open_price == 0){
        m_datas.price = []
      }
      for(let i=0;i < m_datas.volume.length;i++){
      m_datas.previousClose.push(m_datas.yestclose)
        if(this.stockDetail.open_price == 0){
          m_datas.price.push(this.stockDetail.close_price)
        }
      }
      return {
          tooltip: { 
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross',
            label:{
             formatter:function(val){
               if(typeof(val.value) == 'number'){
                  return val.value.toFixed(2)
               }else{
                 return val.value
               }
             }
            }
          },
          formatter: function(params, ticket, callback) {
            var i = params[0].dataIndex;
            var color ='style="color:#fff"';
            var html;
            if(m_datas.price[i]&& m_datas.volume[i] !== '0'){
              let vol = m_datas.volume[i] || 0
              html = '<div class="commColor" style="width:100px;"><div>时间 <span '+color+' >' + m_datas.time[i] + '</span></div>';
              html += '<div>当前价 <span style="color:#FFE131">' + m_datas.price[i] + '</span></div>';
              // html += '<div>均价 <span style="color:#FFE131">' + m_datas.avgPrice[i] + '</span></div>';
              html += '<div>涨幅 <span  '+color+' >' + ratioCalculate(m_datas.price[i],m_datas.yestclose)+ '%</span></div>';
              html += '<div>成交量 <span  '+color+' >' + vol  + '</span></div></div>'
            }else{
              return
            }
            return html
          }
        },
        legend: {
          show:false,
        },
        axisPointer: {
          show: true,
          link: {xAxisIndex: 'all'},
        },
        grid: [{
            id: 'gd1',
            left: '0%',
            right: '1%',
            height: '67.5%', //主分时线的高度,
            top: '5%'
          },
          {
            id: 'gd2',
            left: '0%',
            right: '1%',
            height: '67.5%', //主分时线的高度,
            top: '5%'
          }, {
            id: 'gd3',
            left: '0%',
            right: '1%',
            top: '73%',
            height: '19%' //交易量图的高度
          }
        ],
        xAxis: [ 
          { 
            gridIndex: 0,
            data: m_datas.time,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false}, 
          },
          {
            gridIndex: 1,
            data: m_datas.time,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false}, 
          }, { 
            splitNumber: 2,
            type: 'category',
            gridIndex: 2,
            data: m_datas.time,
            axisLabel: {
              color: '#969696',
              fontSize: 10
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false
            },
            axisLine: {show: false}, 
          }
        ],
        yAxis: [ 
          { 
            gridIndex: 0,
            scale: true, 
            splitNumber: 3,    
            axisLabel: { 
              inside: true, 
              color:function(val){ 
                if(val==m_datas.yestclose){
                  return '#969696'
                }
                return val>m_datas.yestclose? upColor:downColor;
              }
            },
            z:4,
            splitLine: { 
              show: false,
            },
            axisLine: {show: false}, 
            axisTick: {
              show: false
            }
          }, 
          { 
            scale: true,  
            gridIndex: 1, 
            splitNumber: 3,  
            position: 'right', 
            z:4,
            axisLabel: { 
              color:function(val){ 
                if(val==m_datas.yestclose){
                  return '#969696'
                }
                return val>m_datas.yestclose? upColor:downColor; 
              },
              inside: true,
              formatter:function(val){
                var resul=ratioCalculate(val,m_datas.yestclose);
                return  Number(resul).toFixed(2)+' %'
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#181a23'
              }
            },
            axisPointer:{
              show:true,
              label:{
                formatter:function(params){ //计算右边Y轴对应的当前价的涨幅比例
                  var increase = ratioCalculate(params.value,m_datas.yestclose)
                  return  Number(increase).toFixed(2)+'%';
                }
              }
            },
            axisLine: {show: false}, 
            axisTick: {
              show: false
            }
          },
          { //交易图
            gridIndex: 2,
            z:4,
            splitNumber: 3,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#c7c7c7',
              inside: true,
              fontSize: 8
            },
            axisLine: {show: false}, 
          }
        ],
        animation:true,
        backgroundColor: bgColor,
        blendMode: 'source-over',
        series: [
          {
            name: '当前价',
            type: 'line',
            data: m_datas.price,
            smooth: true,
            symbol: "circle", //中时有小圆点 
            itemStyle:{
              normal:{
                color:'#39afe6',
              }
            },
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 136, 212, 0.7)'
                }, {
                  offset: 0.8,
                  color: 'rgba(0, 136, 212, 0.02)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            }
          },
          // {
          //   name: '均价',
          //   type: 'line',
          //   data: m_datas.avgPrice,
          //   smooth: true,
          //   symbol: "circle",
          //   itemStyle:{
          //     normal:{
          //       color:'rgba(224, 140, 44,1)',
          //     }
          //   },
          //   lineStyle: { 
          //     normal: {
          //       color: 'rgba(224, 140, 44,1)',
          //       width: 1
          //     }
          //   }
          // },
          {  
            name: '昨收价',
            type: 'line', 
            data: m_datas.previousClose,
            symbol: "none",
            smooth: true,
            gridIndex: 2,
            xAxisIndex: 2,
            yAxisIndex: 2,
            lineStyle: { 
              normal: { 
                width: 0,
                type: 'dashed',
                color: '#969696',
              }
            }
          },
          {
            type: 'line', 
            data: m_datas.price,
            smooth: true,
            symbol: "none",
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: { //标线的样式 
              normal: { 
                width: 0
              }
            }
          },
          {
            name: 'Volumn',
            type: 'bar',
            gridIndex: 2,
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: m_datas.volume,
            barWidth: '100%',
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList;
                  if (m_datas.price[params.dataIndex] > m_datas.price[params.dataIndex-1]) {
                    colorList = upColor;
                  } else {
                    colorList = downColor;
                  }
                  return colorList;
                },
              }
            }
          },
         
        ]
      }
    },
    //获取分时
    getfiash(){
      commonRequest('newFiash',{
        keyword: this.stock_code,
        stock_type: this.query.stock_type,
        market_id: this.stockDetail.market_id,
        market: this.stockDetail.market
      }).then(res =>{
        if(res.code == '200'){
          this.fiashData = res.data.data
          this.initChart(this.fiashData)
        }
      })
    },
    //分时图
    initChart(data) {
      this.fiashChart = echarts.init(document.getElementById('m-line'))
      this.fiashChart.setOption(this.timeharing(data))
      this.fiashChart.resize()
    },
  }
}
</script>
<style scoped lang="scss">
 
</style>
