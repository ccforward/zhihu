<template>
  <Articles :article="article"></Articles>
</template>

<script>
import Vue from 'vue';
import vueResource from 'vue-resource';
import Articles from '../components/Articles.vue'
Vue.use(vueResource);

const fetchArticle = store => {
  return store.dispatch('FETCH_ARTICLE', store.state.route.query.aid)
}


export default {
  name: 'detail',
  components: {
    Articles
  },
  computed: {
    article () {
      return this.$store.state.article
    }
  },
  preFetch: fetchArticle,
  beforeMount () {
    fetchArticle(this.$store)
  }
};
</script>
