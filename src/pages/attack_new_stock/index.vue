<template>
  <div class="AttackNewStock">
    <Header title="新股申购" :goreturn="true"></Header>
    <div>
      今日有0只新股申购
    </div>
    <div>
      这里是新股相关信息
    </div>
    <div>
      子Item
    </div>
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