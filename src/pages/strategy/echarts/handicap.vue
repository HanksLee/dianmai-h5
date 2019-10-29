<template>
  <div>
    <div id="m-handicap" class="m-handicap" style="height:5rem"></div>
    <div class="handicap-text">
      <van-row><div class="title">主力、散户资金流向</div></van-row>
      <van-row style="border-top:1px solid #32323C;">
          <van-col span="8"></van-col>
          <van-col span="4">主力买入</van-col>
          <van-col span="4">主力卖出</van-col>
          <van-col span="4">散户买入</van-col>
          <van-col span="4" style="border:none;">散户卖出</van-col>
      </van-row>
      <van-row style="border-top:1px solid #32323C;">
          <van-col span="8">金额(万元)</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.zhu_in) / 10000)}}</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.zhu_out) / 10000)}}</van-col>
          <van-col span="4">{{Math.floor(Number(capitalData1.san_in) / 10000)}}</van-col>
          <van-col span="4" style="border:none;">{{Math.floor(Number(capitalData1.san_out) / 10000)}}</van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import { commonRequest } from "@/api/api-strategy";
export default {
  name: "handicap",
  data() {
    return {
      handicapChart:null,
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
            text: "主力、散户资金流向",
            x: "center",
            textStyle:{
              color:'#969696',
              fontSize:12
            }
          },
          tooltip: {
            trigger: "item",
            position: ['10%', '0'],
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            left: "left",
            top:'12%',
            itemWidth:15,
            itemHeight:10,
            textStyle:{
              color:'#969696',
              fontSize:12
            },
            data: ["主力买入", "主力卖出", "散户买入", "散户卖出"]
          },
          color:['#28F064','#FF1E3C','#FFE131','#39afe6'],
          series: [
            {
              name: "资金流向",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: Math.floor(Number(data.zhu_in) / 10000), name: "主力买入" },
                { value: Math.floor(Number(data.zhu_out) / 10000), name: "主力卖出" },
                { value: Math.floor(Number(data.san_in) / 10000), name: "散户买入" },
                { value: Math.floor(Number(data.san_out) / 10000), name: "散户卖出" },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        }
    },
    //获取饼图数据
    getData(){
      this.capitalData1 = this.capitalData
      this.initChart(this.capitalData)
    },
    //分时图
    initChart(data) {
      this.handicapChart = echarts.init(document.getElementById("m-handicap"));
      this.handicapChart.setOption(this.timeharing(data));
      this.handicapChart.resize();
    }
  }
};
</script>
<style scoped lang="scss">

.handicap-text{
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
