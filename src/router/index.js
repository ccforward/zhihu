import Home from '../views/Home.vue'
import Article from '../views/Article.vue'

const routers = [
    { path: '/', component: Home},
    { path: '/article',component: Article},
    { path: '*', redirect: '/' }
];
export default routers;