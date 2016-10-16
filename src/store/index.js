import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    latest: [],
    article: {}
  },
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }

    let position = {
      x: 0,
      y: 0
    }
    if (to.path === '/') {
      position.y = +sessionStorage.getItem('scrollTop') || 0
    }
    return position
  },
  actions: {
    FETCH_LATEST ({ commit, state }) {
      return api.fetchLatest()
        .then(({data}) => {
          commit('SET_LIST', [ data ])
        })
    },
    FETCH_ARTICLE ({ commit, state }, aid) {
      return api.fetchArticle(aid)
        .then(({data}) => {
          commit('SET_ARTICLE', data)
        })
    },
  },
  mutations: {
    SET_LIST (state, data) {
      state.latest = data
    },
    SET_ARTICLE (state, data) {
      state.article = data
    }
  }
})

export default store