import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'

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
      { path: '/users', component: Users }
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
