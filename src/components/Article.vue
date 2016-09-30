<template>
  <div class="article">
    <img class="logo" src="../assets/logo.png">
    <h1>{{ article.title }}</h1>
    <article>{{{ article.body }}}</article>
    <a v-link="{ path: '/' }"> Home </a>
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
  ready(){
    this.$http.get('/article/8809959', {}, {
      headers: {
        vary: 'pjax'
      }
    }).then(function(res){
      this.article = res.body;
      console.log(this.article)
    }, function(){
      // error
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  color: #9c0
}
</style>
