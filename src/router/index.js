import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '../views/Home.vue'

export default new Router({
  routes:[
    { name: 'home', path: '/', component: Home},
    {
      name: 'detail',
      path: '/detail',
      // component: Detail,
      component: resolve => {
        require.ensure([], require => {
          resolve(require('../views/Detail.vue'));
        })
      },
      meta: { scrollToTop: true }
    },
    // 从 latest 点进 detail 因为latest的article没有爬取conmments 
    {
      name: 'top-detail',
      path: '/top-detail',
      // component: Detail,
      component: resolve => {
        require.ensure([], require => {
          resolve(require('../views/Detail.vue'));
        })
      },
      meta: { scrollToTop: true }
    },
    {
      name: 'oneday',
      path: '/date',
      component: resolve => {
        require.ensure([], require => {
          resolve(require('../views/Day.vue'));
        })
      },
      meta: { scrollToTop: true }
    },
    { path: '*', redirect: '/' }
  ]
})