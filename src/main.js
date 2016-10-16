import Vue from 'vue';
import App from './App';
import store from './store'
import router from './router/index';
import { sync } from 'vuex-router-sync'
import vueResource from 'vue-resource';

Vue.use(vueResource);
sync(store, router);


// 开启debug模式
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