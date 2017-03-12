<template>
  <div class="detail">
    <router-link v-if="showDayLik" class="day-link" :to="{path: '/date?dtime='+article.dtime}">看看这一天的所有文章</router-link>
    <Articles :article="article"></Articles>
    <router-link v-if="showDayLik" class="day-link day-link-bottom" :to="{path: '/date?dtime='+article.dtime}">看看这一天的所有文章</router-link>
    <button @click="getComments">
      <i class="icon comments"></i>
      <span v-if="comments.length==0">点击查看最新点评</span>
      <span v-else>最新点评</span>
    </button>
    <i v-show="showLoading" class="loading"></i>
    <Comments :comments="comments"></Comments>
    <router-link :to="{path: '/'}">返回首页</router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import Articles from '../components/Articles.vue'
import Comments from '../components/Comments.vue'

const API = {
  fetchArticle: store => {
    return store.dispatch('FETCH_ARTICLE', store.state.route.query.aid)
  },
  fetchComments: store => {
    return store.dispatch('FETCH_COMMENTS', store.state.route.query.aid)
  },
  fetchAPIComments: store => {
    return store.dispatch('FETCH_APICOMMENTS', store.state.route.query.aid)
  }
}


export default {
  name: 'detail',
  data() {
    return {
      showLoading: false
    }
  },
  components: {
    Articles,
    Comments
  },
  computed: {
    showDayLik(){
      return this.$store.state.route.name != 'top-detail'
    },
    article () {
      return this.$store.state.article
    },
    comments () {
      const cmts = [];
      // 长评在前
      this.$store.state.comments.sort((a,b) => {
        return a.type < b.type
      })
      for(let item of this.$store.state.comments){
        cmts.push(...item.comments);
      }
      this.showLoading = false;
      document.body.scrollTop = document.body.scrollTop+100
      return cmts
    }
  },
  beforeMount () {
    API.fetchArticle(this.$store)
  },
  mounted(){
    scrollTo(0, 0)
  },
  beforeRouteLeave (to, from, next) {
    this.$store.state.comments.length = 0;
    next()
  },
  methods: {
    getComments(){
      if(this.comments.length == 0){
        let _self = this;
        this.showLoading = true;
        if(this.$store.state.route.name == 'top-detail'){
          API.fetchAPIComments(_self.$store);
        }else {
          setTimeout(function(){
            API.fetchComments(_self.$store);
          }, 1000)
        }

      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .day-link {
    display block
    padding-top 10px
    text-align left
  }
  .day-link-bottom {
    padding-top 0
    padding-bottom 10px
    -webkit-font-smoothing antialiased
  }
  button {
    margin-bottom 15px
    border 0
    color #888
    background #fff
    outline none
    cursor pointer
    i {
      margin-right 10px
    }
  }
</style>
