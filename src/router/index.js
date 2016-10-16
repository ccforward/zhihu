import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'


export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes:[
    { name: 'home', path: '/', component: Home},
    { name: 'detail', path: '/detail', component: Detail},
    { path: '*', redirect: '/' }
  ]
})