import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import Day from '../views/Day.vue'


export default new Router({
  routes:[
    { name: 'home', path: '/', component: Home},
    { name: 'detail', path: '/detail', component: Detail, meta: { scrollToTop: true }},
    // 从 latest 点进 detail 因为latest的article没有爬取conmments 
    { name: 'top-detail', path: '/top-detail', component: Detail, meta: { scrollToTop: true }},
    { name: 'oneday', path: '/date', component: Day, meta: { scrollToTop: true }},
    { path: '*', redirect: '/' }
  ]
})