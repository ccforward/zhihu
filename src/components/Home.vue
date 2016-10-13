<template>
<div id="app-home">
  <ul>
    <li v-for="item in latest">
      <p class="title">
        <router-link :to="{path: 'article', query:{aid: item.id}}"> {{item.title}} </router-link>
      </p>
    </li>
  </ul>
</div>
</template>

<script>
import Vue from 'vue';
import vueResource from 'vue-resource';
Vue.use(vueResource);

export default {
  data() {
    return {
      latest: {},
      history: []
    };
  },
  created(){
    this.$http.get('/latest', {}, {
      headers: {
        vary: 'pjax'
      }
    }).then(function(res){
      this.latest = res.body;
    }, function(){
      this.latest = [];
    });
  },
  methods(){
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  color: #42b983;
}
</style>
