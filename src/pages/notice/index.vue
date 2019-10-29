<template>
  <div class="pages-common-problem">
    <div class="header-box"><Header title="公告列表" :goreturn="true"></Header></div>
    <div class="common-problem notice">
          <van-collapse v-model="activeNames" accordion class="children" @change="changeFn">
            <van-collapse-item v-for="(item,index) in list" :title="item.title" :name="''+index" :key="index">
              <p v-if="loading" style="text-align:center;font-size:0.2rem;color:#969696;line-height:1rem;">{{text}}</p>
             <div class="title" v-if="!loading">{{item.title}}</div>
            <div class="textcont" v-html="content" v-if="!loading"></div>
            </van-collapse-item>
          </van-collapse>
    </div>
    <Loading :loading="loadings"></Loading>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import config from '@/api/config-client'
  import Header from '@/components/Header'
  import Loading from '@/components/Loading'
  import {commonRequest} from '@/api/api-home'

  export default {
    components: {
      Header,
      Loading
    },
    data() {
      return {
        // list:[],
        id: this.$route.query.id || '',
        activeNames: '',
        capitalData: [],
        page: 1,
        pageSize: 20,
        list: [],
        loadings: false,
        loading: false,
        content: '',
        text: '加载中...'
      }
    },
    created() {
      this.getdetail()
      this.getlist()
    },
    methods: {
      getlist() {
        commonRequest('list',{
          page: 1,
          page_size: 20,
        }).then(res => {
          if (res.code == '200') {
            this.list = res.data.page_data
            for(let i=0;i<this.list.length;i++){
              if(this.id == this.list[i].id){
                this.activeNames = ""+i
              }
            }
          }
        })
      },
      changeFn(val){
        if(val){
          this.id = this.list[val].id
          this.getdetail()
        }
      },
      getdetail(){
        this.loading = true
        const api = config.api
        const data = {id: this.id}
        axios({
          method: 'post',
          url: api+'/v1_home/content/detail',
          data:qs.stringify(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(res=>{
          if(res.data.code == '200'){
            this.loading = false
            let dataCon = res.data.data.content
            this.content = dataCon
          }else{
            this.text = '加载出错了！'
          }
        })
      },
    },
    name: "index"
  }
</script>

<style scoped lang="scss">
img{
  width:100%;
}
.header-box{
  position:fixed;
  top:0;
  left:50%;
  margin-left:-3.75rem;
  height:1.2rem;
  background:#0E0F19;
  width:7.5rem;
  z-index:10;
  
}
  .pages-common-problem {
    color: white;
    font-size: 0.3rem;
    text-align: left;
    padding-top:1.5rem;
    .title{
      text-align:center;
    }
  }
  .notice .van-collapse-item__content p{
    text-indent:0;
  }
</style>
