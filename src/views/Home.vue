<template>
<div class="home">
  <div class="date-pick">
    <input type="date" min="2013-05-19" :value="now" @change="changeDate">
    <p class="date-desc">搜索知乎日报的某一天</p>
  </div>
  <p class="statis-link"><a href="/statistics">去看看知乎日报的数据统计</a></p>
  <Latest :data="latest.latest"></Latest>

  <template v-for="item in histories">
    <History :day="item"></History>
  </template>
  
  <i class="loading"><span>Previous Day</span></i>
</div>
</template>

<script>
import Vue from 'vue'
import Latest from '../components/Latest.vue'
import History from '../components/History.vue'
import DateCalc from '../../common/util/date'

const fetchLatest = store => {
  return store.dispatch('FETCH_LATEST')
}
const fetchHistory = (store, dtime) => {
  return store.dispatch('FETCH_HISTORY', dtime)
}
const throttle = function(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export default {
  name: 'home',
  data() {
    return {
      loading: false,
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
    now(){
      const d = new DateCalc().now()
      return d.substr(0,4) +'-'+ d.substr(4,2) +'-'+ d.substr(6,2)
    },
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
  created(){
    this.scrollEvent = throttle(e => {
      if (window.innerHeight + document.body.scrollTop + 150 >= document.body.offsetHeight) {
        this.previousDay()
      }
    }, 200)
  },
  beforeMount () {
    if(this.histories.length == 0){
      this.previousDay()
    }
    if(this.$store.state.latest.length == 0){
      fetchLatest(this.$store)
    }
  },
  mounted(){
    scrollTo(0, sessionStorage.getItem('scrollTop'))
    window.addEventListener('scroll',  this.scrollEvent)
  },
  beforeRouteLeave (to, from, next) {
    if(to.name == 'detail'){
      // TODO use cache to store articles
      this.$store.state.article = {}
    }
    window.removeEventListener('scroll', this.scrollEvent)
    sessionStorage.setItem('scrollTop', document.body.scrollTop)
    next()
  },
  methods: {
    changeDate(e){
      const date = e.target.value.replace(/-/g, '')
      date && this.$router.push(`date?dtime=${date}`);
    },
    previousDay(){
      this.$store.state.date = new DateCalc(this.$store.state.date).before();
      fetchHistory(this.$store, this.$store.state.date);
    }
  }
};
</script>

<style lang="stylus">
.date-pick {
  position relative
  &:hover {
    .date-desc {
      opacity 0
    }
  }
  input{
    margin 10px 0
    width 30%
    height 25px
    border 1px solid #42b983
    outline 0
    color #42b983
    line-height 25px
    text-indent 6px
    font-size 13px
  }
  .date-desc {
    position absolute
    top 14px
    left 3px
    margin 0
    height 20px
    background #fff
    color #42b983
    font-size 12px
    text-indent 11px
  }
}
.statis-link {
  text-align center
}
.history {
  a {
    display block
    overflow hidden
  }
  li {
    width 100%
    padding 8px 0
    overflow hidden
    border-bottom 1px solid #ccc;
    .title {
      display inline-block
      margin 10px 0 0 10px
      width auto
      max-width 70%
      font-size 15px
      line-height 1.5
    }
    img,
    .img {
      float right
      margin-right 5px
      width 90px
      height 90px
      background-size 100%
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

@media (max-width: 650px) {
  .date-pick {
    display none
  }
}

@media (max-width: 500px) {
  .home{
    li .title {
      font-size 13px
    }
    button {
    margin 10px auto
    height 50px
    width 50px
    span {
      display none
    }
    &::before,
    &::after {
      height 50px
      width 50px
      border-width 2px
    }
    &::after {
      border-width 2px
    }
  }
    
  }
}
</style>
