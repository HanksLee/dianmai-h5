<template>
  <!-- 加载图标 -->
    <div class="loading-box" v-if="loading">
      <div class="loading-box-icon">
        <van-loading :color="color" />
      </div>
    </div>
</template>
<script>
  export default {
    name: 'Loading',
    props:{
      loading:Boolean
    },
    data () {
    return {
      color: '#FFE131',
    }
    }
  }
</script>
<style scoped>
  
</style>
