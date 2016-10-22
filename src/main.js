import Vue from 'vue';
import vueResource from 'vue-resource';
import App from './App';
import store from './store'
import router from './router/index';
import { sync } from 'vuex-router-sync'
import * as filters from './filters'

Vue.use(vueResource);
sync(store, router);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.debug = true;

const app = new Vue({
    name: 'app',
    router,
    store,
    render(h) {
        return h(App)
    }
}).$mount('#entry')

export { app, router, store }