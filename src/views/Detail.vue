<template>
  <div class="detail">
    <Articles :article="article"></Articles>
  </div>
</template>

<script>
import Vue from 'vue';
import Articles from '../components/Articles.vue'

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
