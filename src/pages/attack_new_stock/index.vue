<template>
  <div class="attack-new-stock">
    <Header title="新股申购" :goreturn="true"></Header>
    <div class="top">
      <span class="text1">2019年10月30日</span>
      <h2>今日有{{ newStockCount.todayNewStock }}只新股申购</h2>
      <span class="text2">已共计参与64次， 中签4次</span>
    </div>
    <div class="center">
      <div>
        预约打新
      </div>
      <div class="apply-time text-center">
        <!-- 预约每日申购时间 -->
      </div>
      <div class="reserve-info">
        <van-row class="text-center">
          <van-col span="11" class="info-left">
            <div class="font-size1">
              已预约<span class="text-color-y"> {{ newStockCount.allPurchaseRecord }} </span>只品种
            </div>
            <div class="margin-top1 font-size2">
              今日申购{{ newStockCount.todayPurchaseRecord }}只
            </div>
          </van-col>
          <van-col class="vline"></van-col>
          <van-col span="11" class="info-right">
            <div class="font-size1">
              待预约<span class="text-color-y"> {{ newStockCount.allNewStock }} </span>只品种
            </div>
            <div class="margin-top1 font-size2">
              <button type="button" @click="dialogVisible = true">一键预约</button>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="bottom">
      <router-link class="link" to="/attack_new_stock/record">
        <img src="/static/img/zjmx.png">
        <span>查询申购记录</span>
        <img src="/static/img/xyb.png" alt="下一页">
      </router-link>
      <router-link class="link" to="/attack_new_stock">
        <img src="/static/img/zjmx.png">
        <span>打新指南</span>
        <img src="/static/img/xyb.png" alt="下一页">
      </router-link>
    </div>
    <van-dialog class="dialog" v-model="dialogVisible"
      :showCancelButton="true"
      confirmButtonText="一键预约">
      <div class="title">
        一键预约当前
        <span>{{ newStockCount.allNewStock }}</span>
        只待预约品种
      </div>
      <div class="content">
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
            <th style="text-align: left">待约新股</th>
            <th style="text-align: left">发行价</th>
            <th style="text-align: left">申购日期</th>
            <th style="text-align: left;">申购数</th>
          </thead>
        </table>
        <div class="table_con">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="item in preList" :key="item.id">
                <td>{{ item.stock_name }}</td>
                <td class="right-t">
                  <p v-if="item.publish_price">
                    {{ item.publish_price }}
                  </p>
                  <p v-else>暂无</p>
                </td>
                <td class="right-t">{{ item.time_to_offer }}</td>
                <td class="right-t">
                  <template v-if="item.publish_price">
                    <span @click="changeTest(item, 'sub')">-</span>
                    <input type="number" v-model="item.countNum" />
                    <span @click="changeTest(item, 'add')">+</span>
                  </template>
                  <template v-else>
                    ----------
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="dia-btm">
        申购总额: {{ preCount }}
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { commonRequest } from '@/api/api-new_stock'

export default {
  name: 'AttackNewStock',
  components: {
    Header
  },
  data () {
    return {
      msg: 'test',
      dialogVisible: false,
      newStockCount: {},
      preList: [],
      preCount: 0
    }
  },
  created () {
    this.getNewStockCount(1)
    this.getNewStockCount(2)
  },
  methods: {
    /**
     * type 1 count
     * type 2 list
     */
    async getNewStockCount (type) {
      const res = await commonRequest('new_stock', { type })
      console.log(res)
      if (res.code === 200) {
        switch (type) {
          case 1: 
            this.newStockCount = res.data
            break
          case 2:
            for (const key in res.data) {
              if (res.data.hasOwnProperty(key)) {
                if (!isNaN(Number(key))) {
                  // 增加下自定义属性方便计算，此属性绑定数量的input
                  res.data[key].countNum = 0
                  this.preList.push(res.data[key])
                }
              }
            }
            break  
        }
      } else {
        this.$messageFail(res.msg)
      }
    },
    /**
     * input加减
     */
    changeTest (obj, type) {
      if (obj.publish_price) {
        if (type === 'add') {
          obj.countNum += 1
        } else if (type === 'sub') {
          if (obj.countNum > 0) obj.countNum -= 1
        }
        this.count(this.preList)
      }
    },
    count (preList) {
      let result = 0
      for (const item of preList) {
        if (item.publish_price) {
          result += item.publish_price * item.countNum
        }
      }
      this.preCount = result.toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.attack-new-stock {
  color: #ffffff;
  // 可复用的工具类
  .text-center {
    text-align: center;
  }
  .text-color-y {
    font-size: 0.4rem;
    color: rgba(255,225,49,1);
  }
  // 专属于特定区域的类
  .top {
    margin: 0.3rem 0;
    padding: 0 0.27rem;
    span {
      font-size: 0.25rem;
    }
    h2 {
      margin: 0.2rem 0;
    }
  }
  .center {
    padding: 0.27rem;
    // margin: 0 0.3rem;
    border-top: 1px solid rgba(50,50,60,1);
    .apply-time {
      margin-bottom: 0.5rem;
    }
    .reserve-info {
      .font-size1 {
        font-size: 0.32rem;
      }
      .font-size2 {
        font-size: 0.29rem;
      }
      .margin-top1 {
        margin-top: 24px;
      }
      .vline {
        float: left;
        width: 1px;
        height: 0.6rem;
        margin: 0 5px;
        border-left: 1px solid rgb(251, 251, 253);
      }
      .info-right {
        button {
          padding: 0.05rem 0.1rem;
          background-color: #4CAF50;
          border-radius: 4px;
          border: none;
          color: white;
          text-align: center;
          text-decoration: none;
          display: inline-block;
        }
      }
    }
  }
  .bottom {
    margin-top: 0.29rem;
    padding: 0 0.27rem;
    .link {
      margin-bottom: 0.2rem;
      width: 100%;
      display: inline-block;
      height: 0.48rem;
      padding-top: 0.3rem;
      border-top: 1px solid rgba(50,50,60,1);
      position: relative;
      font-size: 0.32rem;
      color: white;
      text-indent: 0.56rem;
      line-height: 0.44rem;
      img{
       position: absolute;
      }
      img:first-child{
        left: 0;
        width: 0.48rem;
      };
      img:last-child{
        right: 0.2rem;
        width: 0.4rem;
      }
    }
  }
  .dialog {
    .title {
      font-size: 0.29rem;
      margin: -0.02rem 0 0.4rem 0;
      text-align: center;
    }
    .table_con {
      max-height: 1.4rem;
      overflow: auto;
    }
    .table_con::-webkit-scrollbar {
      width: 0;
    }
    table {
      width: 100%;
      // table-layout: fixed;
      // word-wrap: break-word;
      thead {
        font-size: 0.27rem;
        color: #969696;
        // background-color: #909399;
        th {
          padding-bottom: 0.14rem;
        }
      }
      tbody {
        font-size: 0.2rem;
        text-align: center;
        td {
          padding-bottom: 0.14rem;
          span {
            font-size: 0.4rem;
          }
        }
        input {
          height: 0.24rem;
          width: 0.4rem;
          color: #606266;
        }
      }
      .left-t {
        text-align: left;
      }
      .center-t {
        text-align: center;
      }
      .right-t {
        text-align: right;
      }
    }
    .dia-btm {
      margin-top: 0.2rem;
      font-size: 0.25rem;
    }
  }
}
</style>