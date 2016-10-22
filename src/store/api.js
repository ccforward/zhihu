import Vue from 'vue';

export const fetchLatest = () => {
  return Vue.http.get('/latest')
}

export const fetchHistory = dtime => {
  return Vue.http.get(`/day/${dtime}`)
}

export const fetchArticle = aid => {
  return Vue.http.get(`/article/${aid}`)
}

export const fetchComments = aid => {
  return Vue.http.get(`/article/${aid}/comments`)
}