import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './plugins/directives.js'
// 第三方组件
import TreeTable from 'vue-table-with-tree-grid'
// 定义了全局样式
import './assets/css/global.css'
// 第三方ico
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器，
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // return是固定写法
  return config
})
Vue.prototype.$http = axios
// 全局注册组件,tree-table为自定义名称
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
