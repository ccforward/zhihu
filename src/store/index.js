import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'
import DateCalc from '../../common/util/date'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    date:  new DateCalc().now(),
    latest: [],
    day: [],
    oneday: {},
    article: {}
  },
  actions: {
    FETCH_LATEST ({ commit, state }) {
      return api.fetchLatest()
        .then(({data}) => {
          commit('SET_LIST', data)
        })
    },
    FETCH_HISTORY ({ commit, state }, dtime) {
      return api.fetchHistory(dtime)
        .then(({data}) => {
          commit('SET_HISTORY', data)
        })
    },
    FETCH_ONEDAY ({ commit, state }, dtime) {
      return api.fetchHistory(dtime)
        .then(({data}) => {
          commit('SET_ONEDAY', data)
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
    SET_HISTORY (state, data) {
      if(data.length){
        let day = {
          month: new DateCalc().monthEN(data[0].dtime) + data[0].dtime.substr(4,2),
          date: new DateCalc().CHN(data[0].dtime),
          data: data
        }
        state.day.push(day)
      }
    },
    SET_ONEDAY (state, data) {
      if(data.length){
        state.oneday= {
          month: new DateCalc().monthEN(data[0].dtime) + data[0].dtime.substr(4,2),
          date: new DateCalc().CHN(data[0].dtime),
          data: data
        }
      }
    },
    SET_ARTICLE (state, data) {
      state.article = data
    }
  }
})

export default store