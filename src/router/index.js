import Home from '../components/Home.vue'
import Article from '../components/Article.vue'

const routers = [
    { path: '/', component: Home},
    { path: '/article',component: Article},
    { path: '*', redirect: '/' }
];
export default routers;