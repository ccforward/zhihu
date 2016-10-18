<template>
<div class="home">
  <Latest :data="latest.latest"></Latest>

  <template v-for="item in histories">
    <History :day="item"></History>
  </template>
  
  <button @click="previousDay">Previous Day</button>
</div>
</template>

<script>
import Vue from 'vue';
import Latest from '../components/Latest.vue'
import History from '../components/History.vue'
import DateCalc from '../../common/util/date';

const fetchLatest = store => {
  return store.dispatch('FETCH_LATEST')
}
const fetchHistory = (store, dtime) => {
  return store.dispatch('FETCH_HISTORY', dtime)
}

export default {
  name: 'home',
  data() {
    return {
      date: '20161002',
      histories: [],
      h: []
    };
  },
  components: {
    Latest,
    History
  },
  preFetch: fetchLatest,
  computed: {
    latest(){
      let data = {
        top: [],
        latest:[]
      };
      let comments = [];
      let d = this.$store.state.latest

      for(let i=0,len=d.length;i<len;i++){
        if(d[i].title) {
          d[i].top ? data.top.push(d[i]) : data.latest.push(d[i])
        }else {
          comments.push(d[i])
        }
      }
      for(let i=0,len=comments.length;i<len;i++){
        for(let j=0,length=data.latest.length;j<length;j++){
          if(comments[i].id == data.latest[j].id){
            data.latest[j].comments = comments[i].comments
            data.latest[j].popularity = comments[i].popularity
          }
        }
      }
      return data;
    },
    histories() {
      return this.$store.state.day
    }
  },
  mounted(){
    if(this.$store.state.day.length == 0){
      this.previousDay();
    }
  },
  beforeMount () {
    fetchLatest(this.$store);
  },
  methods: {
    previousDay: function(){
      this.date = new DateCalc(this.date).before();
      fetchHistory(this.$store, `${this.date}`);
    }
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
