<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
import {commonRequest} from '@/api/api-home'
export default {
  name: 'App',
  data () {
  return {
    
  }
 },
 created () {
   commonRequest('indexbg').then(res =>{
    if(res.code == '200'){
      document.title = res.data.data.head
    }
   })
 }
}
</script>
<style src="../static/social-share/css/share.min.css"></style>
<style lang="scss">
@import 'style/normalize.scss';// normalize.css 样式格式化
@import 'style/index.scss';//初始化Vant默认样式
html,body{
  font-size:16px;
  //background-color: #0E0F19;;
  background:#0E0F19;
}
 #app{
   max-width:750px;
   width:100%;
   margin:0 auto;
   background:#0E0F19;
   //overflow:hidden;
   min-width:320px;
 }
//  .header{
//   position:fixed;
//   top: 0;
//   left:50%;
//   margin-left:-3.75rem;
//   height:1.1rem;
//   width:100%;
//   background:#0E0F19;
//   text-align:center;
//   max-width:750px;
//   z-index:100;
//  }
</style>
