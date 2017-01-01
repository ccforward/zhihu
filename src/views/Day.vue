<template>
  <div class="date-container">
    <div class="date-link">
      <router-link class="date-before" :to="{ path: '/date', query: { dtime: before }}" replace>前一天 - {{before}}</router-link>
      <router-link class="date-after" :to="{ path: '/date', query: { dtime: after }}" replace>{{after}} - 后一天</router-link>
    </div>
    <History :day="oneDay"></History>
    <router-link :to="{path: '/'}" style="display:block;margin:10px 0">返回首页</router-link>
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
    before(){
      const d = new DateCalc(this.$store.state.route.query.dtime).before()
      this.$store.state.date = d
      fetchHistory(this.$store)
      return d
    },
    after(){
      const d = new DateCalc(this.$store.state.route.query.dtime).after()
      this.$store.state.date = d
      fetchHistory(this.$store)
      return d
    },
    oneDay() {
      return this.$store.state.oneday
    }
  },
  beforeMount () {
    fetchHistory(this.$store);
  }
};
</script>
<style lang="stylus" scoped>
.date-link {
  padding 10px 0
}
.date-after {
  float right
}
</style>
