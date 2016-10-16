import Vue from 'vue';

export const fetchLatest = () => {
  return Vue.http.get('/latest')
}

export const fetchArticle = (aid) => {
  return Vue.http.get(`/article/${aid}`)
}