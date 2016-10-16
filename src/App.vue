<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="stylus">
ul,li {
  padding 0
  margin 0
}
body {
  display flex
  align-items center
  justify-content center
}

#app {
  margin-top 80px
  padding 0 50px
  width 700px
  color #2c3e50
  background-color #fff
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Source Han Sans CN", "Source Han Sans SC", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
  font-size 15px
}
a {
  color #42b983
  text-decoration none
  &:hover {
    text-decoration underline
  }
}

.fade-enter-active, .fade-leave-active {
  transition all .2s ease
}
.fade-enter, .fade-leave-active {
  opacity 0
}
</style>
