<template>
<div class="home">
  <Latest :latest="latest" :top="top"></Latest>
  
  <template v-for="item in history">
    <History :day="item"></History>
  </template>
  
  <button @click="nextDay">Next Day</button>
</div>
</template>

<script>
import Vue from 'vue';
import vueResource from 'vue-resource';
import Latest from '../components/Latest.vue'
import History from '../components/History.vue'
import DateCalc from '../../common/util/date';
Vue.use(vueResource);

export default {
  name: 'home',
  data() {
    return {
      top: [],
      latest: [],
      history: [],
      date: '20161002'
    };
  },
  components: {
    Latest,
    History
  },
  created(){
    this.$http.get('/latest', {}, {
      headers: {
        vary: 'pjax'
      }
    }).then(function(res){
      let latest = res.body;
      let comments = [];

      for(let i=0,len=latest.length;i<len;i++){
        if(latest[i].title) {
          latest[i].top  ? this.top.push(latest[i]) : this.latest.push(latest[i])
        }else {
          comments.push(latest[i])
        }
      }
      for(let i=0,len=comments.length;i<len;i++){
        for(let j=0,length=this.latest.length;j<length;j++){
          if(comments[i].id == this.latest[j].id){
            this.latest[j].comments = comments[i].comments
            this.latest[j].popularity = comments[i].popularity
          }
        }
      }

    }, function(){
      this.latest = [];
    });

    this.nextDay();
  },
  beforeRouteLeave (to, from, next) {
    sessionStorage.setItem('scrollTop', document.body.scrollTop)
    next()
  },
  methods: {
    nextDay: function(){
      this.date = new DateCalc(this.date).before();
      let dtime = `/day/${this.date}`;
      this.$http.get(dtime, {}, {
        headers: {
          vary: 'pjax'
        }
      }).then(function(res){
        let day = {
          month: new DateCalc().monthEN(this.date) + this.date.substr(4,2),
          date: new DateCalc().CHN(this.date),
          data: res.body
        }
        this.history.push(day);
      }, function(){
        this.latest = [];
      });
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
