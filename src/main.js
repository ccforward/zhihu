import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import Routers from './router/index';

Vue.use(VueRouter);


// 开启debug模式
Vue.config.debug = true;

// 路由配置
let router = new VueRouter({
    // 是否开启History模式的路由,默认开发环境开启,生产环境不开启。如果生产环境的服务端没有进行相关配置,请慎用
    // history: Env != 'production'
    history: false
});

router.map(Routers);

router.beforeEach(() => {
    window.scrollTo(0, 0);
});

router.afterEach(() => {

});

router.redirect({
    '*': "/"
});

router.start(App, '#main');


/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App },
// });
