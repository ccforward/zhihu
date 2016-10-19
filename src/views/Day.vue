<template>
<div class="home">
    <History :day="oneDay"></History>
</div>
</template>

<script>
import Vue from 'vue';
import History from '../components/History.vue'
import DateCalc from '../../common/util/date';

const fetchHistory = store => {
  return store.dispatch('FETCH_ONEDAY', store.state.route.query.dtime);
}

export default {
  name: 'oneday',
  components: {
    History
  },
  preFetch: fetchHistory,
  computed: {
    oneDay() {
      return this.$store.state.oneday
    }
  },
  beforeMount () {
    fetchHistory(this.$store);
  }
};
</script>

<style lang="stylus">

.home {
  li {
    width 100%
    padding 8px 0
    overflow hidden
    border-bottom 1px solid #ccc;
    .title {
      display inline-block
      margin 10px 0 0 10px
      width 80%
      font-size 16px
      line-height 1.5
    }
    img {
      float right
      margin-right 10px
      width 70px
      height 70px
    }
  }
  button {
    position relative
    display block
    margin 20px auto
    height 100px
    width 100px
    border 0
    outline none
    color #42b983
    border-radius 50%
    background #fff
    cursor pointer
    &::before,
    &::after {
      position absolute
      left 0
      top 0
      height 100px
      width 100px
      border-radius 50%
      border-style solid
      border-width 2px
      box-sizing border-box
      content ''
    }
    &::before{
      border-color #c7c7c7
    }
    &::after {
      border-radius 50%
      border-style solid
      border-width 4px
      box-sizing border-box
      content ''
      left 0
      position absolute
      top 0
      animation MoreLoadingAnimation 2s infinite ease
      border-color #42b983 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
      transform-origin 50%
    }
  }
}

@keyframes MoreLoadingAnimation{
  0%{
    transform rotate(0deg)
  }
  to{
    transform rotate(360deg)
  }
}
</style>
