import Vue from 'vue'
import VueRouter from 'vue-router'
// 改为路由懒加载模式
// import Login from '../components/login.vue'
const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () =>
  import(
    /* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue'
  )
// import Users from '../components/user/users.vue'
const Users = () =>
  import(/* webpackChunkName:"user" */ '../components/user/users.vue')
// import Rights from '../components/power/rights.vue'
const Rights = () =>
  import(/* webpackChunkName:"power" */ '../components/power/rights.vue')
// import Roles from '../components/power/roles.vue'
const Roles = () =>
  import(/* webpackChunkName:"power" */ '../components/power/roles.vue')
// import Cate from '../components/goods/cate.vue'
const Cate = () =>
  import(/* webpackChunkName:"goods" */ '../components/goods/cate.vue')
// import Params from '../components/goods/params.vue'
const Params = () =>
  import(/* webpackChunkName:"goods" */ '../components/goods/params.vue')
// import Goods from '../components/goods/goods.vue'
const Goods = () =>
  import(/* webpackChunkName:"goods" */ '../components/goods/goods.vue')
// import Add from '../components/goods/add.vue'
const Add = () =>
  import(/* webpackChunkName:"goods" */ '../components/goods/add.vue')
// import Order from '../components/orders/order.vue'
const Order = () =>
  import(/* webpackChunkName:"order" */ '../components/orders/order.vue')
// import Report from '../components/reports/report.vue'
const Report = () =>
  import(/* webpackChunkName:"report" */ '../components/reports/report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫，to将要访问的路径，from代表从哪跳转来，next（）表示放行next('/login')表示强制跳转到指定的路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 从sessionstorage获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token,强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})
export default router
