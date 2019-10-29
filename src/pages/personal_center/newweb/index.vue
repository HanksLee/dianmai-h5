<template>
    <div>
      <!--<header class="mui-bar mui-bar-nav">-->
        <!--<a class="mui-icon mui-icon-left-nav mui-pull-left" id="go_back"></a>-->
        <!--<a class="mui-icon mui-icon-forward mui-pull-right" id="go_forward"></a>-->
        <!--<h1 class="mui-title mui-action-back" id="close_page">直接关闭当前页面</h1>-->
      <!--</header>-->
      111
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
          return{
            pay:this.$route.query.id
          }
        },
      // created() {
      //     this.pay=this.$route.query.id
      //     console.log( this.pay)
      //   this.mui.init();
      //   this.mui.plusReady(function() {
      //     var self = plus.webview.currentWebview();
      //     var baiduWV = plus.webview.create(this.pay, "baidu", {
      //       top: "44px",
      //       bottom: 0
      //     });
      //     self.append(baiduWV);
      //     /**
      //      * 重写mui.back()方法
      //      * http://dev.dcloud.net.cn/mui/window/#closewindow
      //      */
      //     /**
      //      * 监听子窗口对象是否可后退
      //      * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.canBack
      //      */
      //     document.getElementById("go_back").addEventListener("tap", function() {
      //       baiduWV.canBack(function(event) {
      //         var canBack = event.canBack;
      //         if(canBack) {
      //           baiduWV.back();
      //         } else {
      //           alert("到头了，不能后退了！");
      //         }
      //       });
      //     });
      //
      //     // 右上角前进icon的事件
      //     document.getElementById("go_forward").addEventListener("tap", function() {
      //       /**
      //        * 监听子窗口对象是否可前进
      //        * http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.canForward
      //        */
      //       baiduWV.canForward(function(event) {
      //         var canForward = event.canForward;
      //         if(canForward) {
      //           baiduWV.forward();
      //         } else {
      //           alert("不能前进！");
      //         }
      //       });
      //     });
      //   });
      // },
    }
</script>
<!--<style src="../../../mui/css/mui.min.css"></style>-->
<style scoped>

</style>
