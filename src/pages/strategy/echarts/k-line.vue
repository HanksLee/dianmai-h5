<template>
  <div class="echarts">
		<div class="ma-box" v-if="ma5||ma10||ma20||ma30">
			<span style="color:#FFE131;">MA5：{{ma5}}</span>
			<span style="color:#fff;">MA10：{{ma10}}</span>
			<span style="color:#ffab42;">MA20：{{ma20}}</span>
			<span style="color:rgba(255,0,71,1);">MA30：{{ma30}}</span>
		</div>
      <div id="k-line" class="k-line" style="height:5rem"></div>
  </div>
</template>
<script>
import { commonRequest } from '@/api/api-strategy'
var bgColor = "#0E0F19";//背景
var upColor="#FF1E3C";//涨颜色
var downColor="#28F064";//跌颜色
// ma  颜色
var ma5Color = "#FFE131";
var ma10Color = "#fff";
var ma20Color = "#ffab42";
var ma30Color = "rgba(255,0,71,1)";
var timer = null;
function ratioCalculate(price,yclose){
	return ((price-yclose)/yclose*100).toFixed(2)
}
//================================MA计算公式
function calculateMA(dayCount,data) {
	var result = [];
	for (var i = 0, len = data.time.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			sum += data.data[i - j][1];
		}
		result.push((sum / dayCount).toFixed(2));
	}
	return result;
}
export default {
  name: 'kLine',
  data () {
    return {
			kChart:[],
			ma5: '',
			ma10: '',
			ma20: '',
			ma30: '',
			query:{}
    }
  },
  watch:{
    stock_code(){
      this.getkline()
    }
  },
  props:{
    stock_code: String,
    stockDetail: Object
  },
  mounted() {
	  this.query = this.$route.query || {};
    this.getkline()
    timer = setInterval(this.getkline, 300000)
  },
  beforeDestroy() {
    clearInterval(timer)
  },
  methods: {
     chartKline(data){
			 let that = this
			 console.log(calculateMA(30,data))
			 that.ma5 = calculateMA(5,data)[5]
			 that.ma10 = calculateMA(10,data)[10]
			 that.ma20 = calculateMA(20,data)[20]
			 that.ma30 = calculateMA(30,data)[30]
      return {
			tooltip: { //弹框指示器
				trigger: 'axis',
				confine: true,
				axisPointer: {
					type: 'cross',
        },
        formatter:function(params, ticket, callback){
            var color ='style="color:#fff"';
            var html;
            if(params[0].seriesName == 'price' ){
                html = '<div class="commColor" style="padding:5px;"><div>时间 <span '+color+' >' + params[0].name + '</span></div>';
                html += '<div>开盘价 <span style="color:#FFE131">' + params[0].value[1] + '</span></div>';
                html += '<div>收盘价 <span style="color:#FFE131">' + params[0].value[2] + '</span></div>';
                html += '<div>最低价 <span  '+color+' >' +params[0].value[3]+ '</span></div>';
								html += '<div>最高价 <span  '+color+' >' + params[0].value[4] + '</span></div>';
								html += '<div>成交量 <span  '+color+' >' + params[5].value + '</span></div></div>'
								that.ma5 = params[1].value  
								that.ma10 = params[2].value  
								that.ma20 = params[3].value  
								that.ma30 = params[4].value  		
            }else{
                html = '<div class="commColor" style="padding:5px;"><div>时间 <span '+color+' >' + params[0].name + '</span></div>';
                html += '<div>开盘价 <span style="color:#FFE131">' + params[1].value[1] + '</span></div>';
                html += '<div>收盘价 <span style="color:#FFE131">' + params[1].value[2] + '</span></div>';
                html += '<div>最低价 <span  '+color+' >' +params[1].value[3]+ '</span></div>';
								html += '<div>最高价 <span  '+color+' >' + params[1].value[4] + '</span></div>';
								html += '<div>成交量 <span  '+color+' >' + params[0].value + '</span></div></div>'
								that.ma5 = params[2].value  
						    that.ma10 = params[3].value  
						    that.ma20 = params[4].value  
						    that.ma30 = params[5].value 
            }
            return html;
        }
			},
			legend: { //图例控件,点击图例控制哪些系列不显示
			 show:false,
			},
			color: [ma5Color, ma10Color, ma20Color, ma30Color],
			axisPointer: {
        show: true,
        link: {xAxisIndex: 'all'},
			},
			grid: [{
				id: 'gd1',
				left: '2%',
				right: '2%',
				height: '67.5%', //主K线的高度,
				top: '5%'
			}, {
				left: '2%',
				right: '2%',
				top: '73%',
				height: '19%' //交易量图的高度
			}],
			xAxis: [
				{
					type: 'category',
					data: data.time,
					scale: true,
					boundaryGap: false,
					axisLine: {
            onZero: false,
            show: false
					},
					axisLabel: { 
						show: false
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: '#3a3a3e'
						}
					},
					splitNumber: 20,
					min: 'dataMin',
          max: 'dataMax',
          axisTick: {
              show: false
					},
				}, { 
					type: 'category',
					gridIndex: 1,
					data: data.time,
					axisLabel: { 
						color: '#9b9da9',
						fontSize: 10
          },
          axisLine: {
            show: false
					},
          axisTick: {
              show: false
          },
				}
			],
			yAxis: [ 
				{
					scale: true,
					z:4,
					axisLabel: { 
						color: '#c7c7c7',
						inside: true,
					},
					splitLine: { 
						show: false,
						lineStyle: {
							color: '#181a23'
						}
          },
          axisLine: {
            show: false
					},
          axisTick: {
              show: false
          },
				}, { 
					min:Math.min.apply(null, data.volume),
					gridIndex: 1, 
					splitNumber: 3, 
					z:4,
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
          axisLine: {
            show: false
					},
          axisTick: {
              show: false
          },
				}
			],
			animation: true, 
			backgroundColor: bgColor,
			blendMode: 'source-over',
			series: [{
					name: 'price',
					type: 'candlestick',
					data: data.data,
					barWidth: '60%',
					large: true,
					largeThreshold: 100,
					itemStyle: {
						normal: {
							color: upColor, 
							color0: downColor,
							borderColor: upColor,
							borderColor0: downColor,
						}
					},
				},
				{
					name: 'MA5',
					type: 'line',
					data: calculateMA(5,data),
					smooth: true,
					symbol: "none", //隐藏选中时有小圆点
					lineStyle: {
						normal: {
							opacity: 0.8,
							color: ma5Color,
							width: 1
						}
					},
				},
				{
					name: 'MA10',
					type: 'line',
					data: calculateMA(10,data),
					smooth: true,
					symbol: "none",
					lineStyle: { //标线的样式
						normal: {
							opacity: 0.8,
							color: ma10Color,
							width: 1
						}
					}
				},
				{
					name: 'MA20',
					type: 'line',
					data: calculateMA(20,data),
					smooth: true,
					symbol: "none",
					lineStyle: {
						opacity: 0.8,
						width: 1,
						color: ma20Color
					}
				},
				{
					name: 'MA30',
					type: 'line',
					data: calculateMA(30,data),
					smooth: true,
					symbol: "none",
					lineStyle: {
						normal: {
							opacity: 0.8,
							width: 1,
							color: ma30Color
						}
					}
				},
				{
					name: 'volume',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: data.volume,
					barWidth: '60%',
					itemStyle: {
						normal: {
							color: function(params) {
								var colorList;
								if (data.data[params.dataIndex][1] > data.data[params.dataIndex][0]) {
									colorList = upColor
								} else {
									colorList = downColor
								}
								return colorList
							},
						}
					}
				}
			]
		}	
    },
    //获取k线
    getkline(){
		let market_id = null
		if(this.stockDetail){
          market_id = this.stockDetail.market_id
		}
      commonRequest('kline',{
		keyword: this.stock_code,
		stock_type: this.query.stock_type,
		market_id: market_id
      }).then(res =>{
        if(res.code == '200'){
          this.initkChart(res.data)
        }
      })
    },
    //K线图
    initkChart(data) {
			let that = this
			this.kChart = echarts.init(document.getElementById('k-line'))
			this.kChart.setOption(this.chartKline(data))
			this.kChart.on('globalout',function (params) {
        that.ma5 = calculateMA(5,data)[5]
				that.ma10 = calculateMA(10,data)[10]
				that.ma20 = calculateMA(20,data)[20]
				that.ma30 = calculateMA(30,data)[30]
      });
      this.kChart.resize()
    },
  }
}
</script>
<style scoped lang="scss">
.echarts{
	position:relative;
	padding-top:0.6rem;
}
 .ma-box{
	 position:absolute;
	 top:0;
	 right:0;
	 span{
		 padding:0 0.02rem;
		 font-size:0.16rem;
	 }
 }
  @media only screen and (min-width: 414px){
	 .ma-box{
		 span{
			 padding:0 0.03rem;
			 font-size:0.18rem;
		 }
	 }
 }
</style>
