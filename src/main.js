import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import routes from './router/index';

Vue.use(VueRouter);


// 开启debug模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
    // mode: 'history',
    routes
});



const app = new Vue({
    router,
    render(h) {
        return h(App)
    }
}).$mount('#entry')