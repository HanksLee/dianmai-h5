<template>
  <div class="pages-common-problem">
    <Header v-if="firstDomain=='huachihk.com'||firstDomain=='huifengstocks.com'||firstDomain=='jungdamarkets.com'" title="服务协议" :goreturn="true"></Header>
    <Header v-else title="合作协议" :goreturn="true"></Header>
    <div class="common-problem">
              <div class="textcont" v-html="textBox"></div>
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
        textBox:'',
        xieyiList:[], // 热门概念
        // xieyiList:[],
        activeNames: this.$route.query.type || '',
        activeNames2: '',
        activeNames3: '',
        capitalData: [],
        page: 1,
        pageSize: 20,
        list: [],
        loadings: true,
        loading: false,
        isEnd: false,
        firstDomain:''
      }
    },
    created() {
      const domain = document.domain;
      this.firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      this.cooperative()
    },
    methods: {
      cooperative() {
        commonRequest('registerrule', {}).then(res => {
          if (res.code === 200) {
            this.loadings=false
            this.xieyiList=res.data;
            this.xieyiList.content= this.xieyiList.content.replace(/pt/g, "").replace(/&nbsp;/g,'')
            this.textBox=this.xieyiList.content
          }
        })
      },
    },
    name: "index"
  }
</script>

<style scoped lang="scss">
  .pages-common-problem {
    color: white;
    font-size: 0.3rem;
    text-align: center;
    .common-problem{
      padding: 0.24rem;
    }
  }
</style>
