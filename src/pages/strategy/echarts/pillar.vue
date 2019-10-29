<template>
  <div>
    <div id="m-pillar" class="m-pillar" style="height:5rem"></div>
    <div class="handicap-text">
      <van-row><div class="title">分类资金净流入额</div></van-row>
      <van-row style="border-top:1px solid #32323C;">
          <van-col span="8"></van-col>
          <van-col span="4">散单</van-col>
          <van-col span="4">小单</van-col>
          <van-col span="4">大单</van-col>
          <van-col span="4" style="border:none;">特大单</van-col>
      </van-row>
      <van-row style="border-top:1px solid #32323C;">
          <van-col span="8">净流入(万元)</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.sandan_flow) / 10000)}}</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.xiaoda_flow) / 10000)}}</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.dadan_flow) / 10000)}}</van-col>
          <van-col span="4" style="border:none;">{{Math.floor(Number(capitalData1.teda_flow) / 10000)}}</van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import { commonRequest } from "@/api/api-strategy";
export default {
  name: "pillar",
  data() {
    return {
      pillarChart: null,
      capitalData1: {}
    };
  },
  props: {
    stock_code: String,
    capitalData: Object
  },
  watch:{
    capitalData(){
      this.getData()
    }
  },
  methods: {
    //饼图
    timeharing(data) {
      return {
        title: {
            text: "分类资金净流入额",
            x: "center",
            textStyle:{
              color:'#969696',
              fontSize:12
            }
          },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" 
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "27%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["散单", "小单", "大单", "特大单"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: { 
              color: '#9b9da9',
              fontSize: 12
            },
            // axisLine: {
            //   show: false
            // },
            axisTick: {
              show: false
            },
            splitLine: {
                show: false 
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false 
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "70%",
            data: [Math.floor(Number(data.sandan_flow) / 10000), Math.floor(Number(data.xiaoda_flow) / 10000), Math.floor(Number(data.dadan_flow) / 10000), Math.floor(Number(data.teda_flow) / 10000)],
            itemStyle: {
						normal: {
							color: function(params) {
                let upColor = ''
								if (params.data>0 ) {
                  upColor = '#FF1E3C'
									return upColor
								} else {
                  upColor = '#28F064'
									return upColor
								}
							},
						}
					}
          }
        ]
      };
    },
    //获取饼图数据
    getData() {
      console.log(this.capitalData)
      this.capitalData1 = this.capitalData
      this.initChart(this.capitalData)
    },
    //分时图
    initChart(data) {
      this.pillarChart = echarts.init(document.getElementById("m-pillar"));
      this.pillarChart.setOption(this.timeharing(data));
      this.pillarChart.resize();
    }
  }
};
</script>
<style scoped lang="scss">
.handicap-text{
    margin-bottom:0.7rem;
    border:1px solid #32323C;
  .title{
    background:#1E1E28;
    padding:0.2rem 0;
    text-align:center;
    font-size:0.26rem;
  }
  .van-col--8{
    width:24%;
  }
  .van-col--4{
    width:18%;
    padding:0 1%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .van-col{
    height:0.7rem;
    line-height:0.7rem;
    text-align:center;
    font-size:0.26rem;
    color:#fff;
    border-right:1px solid #32323C;
  }
}
</style>
