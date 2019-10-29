<script type="text/javascript">
  export default {
    render (createElement) {
      return createElement(
        'script',
        {
          attrs: {type: 'text/javascript', src: this.src},
          ref: 'externalJs'
        }
      )
    },
    props: {
      src: {type: String},
      loadReady: {type: Function}
    },
    mounted () {
      var _t = this
      this.$refs.externalJs.onload = function () {
        if (_t.loadReady) {
          _t.loadReady()
        }
      }
    }
  }
</script>
