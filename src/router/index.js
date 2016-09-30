const routers = {
    '/': {
        component (resolve) {
            require(['../components/Home.vue'], resolve);
        }
    },
    '/article': {
        component (resolve) {
            require(['../components/Article.vue'], resolve);
        }
    }
};
export default routers;