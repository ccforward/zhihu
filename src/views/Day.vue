<template>
  <div class="date-container">
    <div class="date-link">
      <router-link class="date-before" :to="{ path: '/date', query: { dtime: date.before }}" replace>前一天 - {{date.beforeCN}}</router-link>
      <router-link class="date-after" :to="{ path: '/date', query: { dtime: date.after }}" replace>{{date.afterCN}} - 后一天</router-link>
    </div>
    <History :day="oneDay" :view="true"></History>
    <a class="fetch-day" @click.prevent="fetch" v-if="!oneDay.data">刷新数据</a>
    <router-link :to="{path: '/'}" style="display:block;margin:10px 0">返回首页</router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import History from '../components/History.vue'
import DateCalc from '../../spider/util/date'
import axios from 'axios'

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
      const d = new DateCalc(this.dtime)
      return {
        before: d.before(),
        beforeCN: d.beforeCN(),
        after: d.after(),
        afterCN: d.afterCN()
      }
    },
    oneDay() {
      return this.$store.state.oneday
    },
    dtime() {
      return this.$store.state.route.query.dtime
    }
  },
  methods: {
    fetch(){
      const dtime = this.dtime
      axios.post(`/clear-error/${dtime}`)
    }
  }
};
</script>
<style lang="stylus" scoped>
.date-link {
  padding 10px 0
  a {
    font-size .9rem
  }
}
.date-after {
  float right
}
.fetch-day {
  display block
  margin 10px 0
  cursor pointer
  font-size 14px
}
</style>
