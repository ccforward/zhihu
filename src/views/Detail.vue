<template>
  <div class="detail">
    <Articles :article="article"></Articles>
    <button @click="getComments">查看最新点评<i class="icon comments"></i></button>
    <i v-show="showLoading" class="loading"></i>
    <Comments :comments="comments"></Comments>
  </div>
</template>

<script>
import Vue from 'vue';
import Articles from '../components/Articles.vue'
import Comments from '../components/Comments.vue'

const fetchArticle = store => {
  return store.dispatch('FETCH_ARTICLE', store.state.route.query.aid)
}

const fetchComments = store => {
  return store.dispatch('FETCH_COMMENTS', store.state.route.query.aid)
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
    article () {
      return this.$store.state.article
    },
    comments () {
      let cmts = [];
      for(let item of this.$store.state.comments){
        cmts.push(...item.comments)
      }
      this.showLoading = false;
      return cmts
    }
  },
  preFetch: fetchArticle,
  beforeMount () {
    fetchArticle(this.$store)
  },
  mounted(){
    scrollTo(0, 0)
  },
  methods: {
    getComments(){
      let _self = this
      this.showLoading = true;
      setTimeout(function(){
        fetchComments(_self.$store);
      }, 1200)
      Vue.nextTick(function () {
        alert(234)
      })
    }
  }
};
</script>

<style scoped lang="stylus">
  button {
    margin-bottom 15px
    border 0
    color #888
    background #fff
    outline none
    cursor pointer
    i {
      margin-left 5px
    }
  }
</style>
