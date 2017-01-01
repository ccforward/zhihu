<template>
  <div class="date-container">
    <div class="date-link">
      <router-link class="date-before" :to="{ path: '/date', query: { dtime: date.before }}" replace>前一天 - {{date.beforeCN}}</router-link>
      <router-link class="date-after" :to="{ path: '/date', query: { dtime: date.after }}" replace>{{date.afterCN}} - 后一天</router-link>
    </div>
    <History :day="oneDay" :view="true"></History>
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
    date() {
      fetchHistory(this.$store)
      const date = new DateCalc(this.$store.state.route.query.dtime)
      return {
        before: date.before(),
        beforeCN: date.beforeCN(),
        after: date.after(),
        afterCN: date.afterCN()
      }
    },
    oneDay() {
      return this.$store.state.oneday
    }
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
