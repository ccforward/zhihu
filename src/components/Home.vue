<template>
<div id="app-home">
  <ul>
    <li v-for="item in latest">
      <p class="title">
        <router-link to='/article' query={aid: item.id}> {{item.title}} <router-link>
      </p>
    </li>
  </ul>
  <div class="history" v-for="day in history">
    <p class="dtime">{{ day.dtime }}</p>
    <ul>
      <li v-for="d in day.data">
        <img :src="d.image">
        <a v-link="{ path: '/article', query:{aid: d.id} }">{{ d.title }}</a>
      </li>
    </ul>
  </div>
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1 {
  color: #42b983;
}
</style>
