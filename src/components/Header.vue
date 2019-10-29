<template>
  <div class="header-title">
    <img v-if="goreturn" class="go-return" src="/static/img/fh.png" alt="返回" @click="goReturn">
    <header>{{title}}</header>
    <img class="search" v-if="issearch" src="/static/img/title-search.png" @click="search" alt="搜索">
    <img class="signOut" v-if="signOut" src="/static/img/signOut.png" @click="signOutFn" alt="退出登录">
  </div>
</template>
<script>
import { clearUserCookie } from '@/utils/user'
import { commonRequest } from '@/api/api-login'
  export default {
    name: 'Header',
    props: {
      searchUrl: {
        default:'/search'
      },
      goreturn: Boolean,
      title: String,
      issearch: Boolean,
      signOut: Boolean
    },
    methods: {
      search() {
        this.$router.push(this.searchUrl)
      },
      goReturn() {
        this.$router.go(-1);
      },
      signOutFn(){
        commonRequest('logout').then(res =>{
          if(res.code == '200'){
             clearUserCookie()
            localStorage.setItem('activeIndex','');
             this.$router.push('/login')
          }
        })
      }
    }
  }
</script>
<style scoped>
  .header-title {
    position: relative;
    border-bottom:1px solid #32323c;
  }

  header {
    padding: 0.44rem 0 0.22rem;
    font-size: 0.34rem;
    color: #fff;
    text-align: center;
  }

  .go-return {
    position: absolute;
    width: 0.24rem;
    bottom: 0.22rem;
    left: 0.14rem;
  }

  .search {
    position: absolute;
    top: 0.38rem;
    right: 0.24rem;
    width: 0.56rem;
  }
  .signOut{
    position: absolute;
    top: 0.44rem;
    right: 0.24rem;
    width: 0.5rem;
  }
</style>
