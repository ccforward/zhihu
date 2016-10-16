<template>
  <div class="article">
    <h1>{{ article.title }}</h1>
    <img :src="article.image">
    <article v-html="article.body"></article>
    <router-link to='/'> 返回首页 </router-link>
  </div>
</template>

<script>
import Vue from 'vue';
import vueResource from 'vue-resource';
Vue.use(vueResource);

export default {
  data() {
    return {
      article: {}
    };
  },
  created(){
    this.$http.get('/article/8660483', {}, {
      headers: {
        vary: 'pjax'
      }
    }).then(function(res){
      this.article = res.body;
    }, function(){
      // error
    })
  }
};
</script>

<style scoped lang="stylus">
h1 {
  color #42b983
}
.article {
  img {
    width 100%
  }
}
article 
  font-size 15px
  p 
    line-height 1.3

.view-more {
  display none
}
</style>
