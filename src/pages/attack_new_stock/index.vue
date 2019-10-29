<template>
  <div class="AttackNewStock">
    <Header title="新股申购" :goreturn="true"></Header>
    Hello World
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'AttackNewStock',
  components: {
    Header
  },
  data () {
    return {
      msg: 'test'
    }
  },
  created () {

  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.AttackNewStock {
  color: #ffffff
}
</style>