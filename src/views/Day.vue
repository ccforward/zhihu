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
