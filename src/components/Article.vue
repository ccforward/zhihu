<template>
  <div class="article">
    <h1>{{ article.title }}</h1>
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
  mounted(){
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
  color #f06
}
article {
  font-size 15px
}
.view-more {
  display none
}
</style>
