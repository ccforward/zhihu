import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'
import DateCalc from '../../common/util/date'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    date: new DateCalc().now(),
    latest: [],
    day: [],
    oneday: {},
    article: {},
    comments: []
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
    FETCH_COMMENTS ({ commit, state }, aid) {
      return api.fetchComments(aid)
        .then(({data}) => {
          commit('SET_COMMENTS', data)
        })
    },
    FETCH_APICOMMENTS ({ commit, state }, aid) {
      return api.fetchAPIComments(aid)
        .then(({data}) => {
          commit('SET_APICOMMENTS', data)
        })
    }
  },
  mutations: {
    SET_LIST (state, data) {
      state.latest = data
    },
    SET_HISTORY (state, data) {
      if(data.length){
        const day = {
          month: new DateCalc().monthEN(data[0].dtime) + data[0].dtime.substr(6,2),
          date: new DateCalc().CHN(data[0].dtime),
          data: data
        }
        state.day.push(day)
      }
    },
    SET_ONEDAY (state, data) {
      if(data.length){
        state.oneday.data = []
        state.oneday = {
          month: new DateCalc().monthEN(data[0].dtime) + data[0].dtime.substr(6,2),
          date: new DateCalc().CHN(data[0].dtime),
          data: data
        }
      }else {
        const dtime = state.route.query.dtime
        if(dtime){
          const date = new DateCalc(state.route.query.dtime)
          state.oneday.data = []
          state.oneday.month = date.monthEN() + dtime.substr(6,2)
          state.oneday.date = date.CHN()
        }
      }
    },
    SET_ARTICLE (state, data) {
      state.article = data
    },
    SET_COMMENTS (state, data) {
      state.comments = data
    },
    SET_APICOMMENTS (state, data) {
      state.comments = data
    }
  }
})

export default store