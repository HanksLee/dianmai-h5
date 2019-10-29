<template>
  <div class="pages-about-us">
    <Header title="关于我们" :goreturn="true"></Header>
    <div class="about-us-content">
      <div class="about-us-con" v-html="about_us_con"></div>
      <div class="bottom-text">{{aboutData.copyright}}</div>
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
      return{
        capitalData: [],
        page: 1,
        pageSize: 20,
        list: [],
        loadings: false,
        loading: false,
        isEnd: false,
        aboutData:{},
        about_us_con:''
      }
    },
    created(){
      // this.customerDetail()
      commonRequest('about_us').then(res=>{
        if(res.code == '200'){
          this.aboutData = res.data
          this.about_us_con = this.aboutData.about_us.replace(/"true"/g,"false") || res.data.about_us
        }
      })
    },
    methods:{
      customerDetail() {
        this.loadings=true
        commonRequest('customerDetail', {
          page_no:  this.page,
          page_size: this.pageSize
        }).then(res => {
          if (res.code === 200 && res.data) {
            this.page += 1
            let pageData = res.data.page_data
            if (pageData.length < this.pageSize) {
              this.isEnd = true
            }
            this.capitalData = [...this.capitalData, ...pageData]
            this.loading = false
            this.loadings=false
          }
        })
      },
      loadMore () {
        if (this.isEnd) return
        this.loading = true
        this.customerDetail()
      }
    },
    name: "index"
  }
</script>

<style scoped lang="scss">
  .pages-about-us{
    color: white;
    font-size: 0.3rem;
    //text-align: center;
  }
  .about-us-con{
    padding:0.3rem 0.2rem;
  }
  .bottom-text{
    border-top:1px solid #32323c;
    padding:0.3rem 0.1rem;
    position:fixed;
    bottom:0;
    left:50%;
    width:7.5rem;
    margin-left:-3.75rem;
  }
</style>
