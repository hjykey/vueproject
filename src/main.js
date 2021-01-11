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

// 导入vue-quill-editor组件的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条组件nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入富文本组件
import VueQuillEditor from 'vue-quill-editor'

NProgress.configure({ easing: 'ease', speed: 500 })

// 全部挂载,用use注册的组件内部必须有具有install方法,否则请用component
Vue.use(VueQuillEditor /* { default global options } */)

// 阻止启动生产消息
Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器，添加nprogress进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // return是固定写法
  return config
})
// axios响应拦截器，添加nprogress进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
// 全局注册组件,tree-table为自定义名称
Vue.component('tree-table', TreeTable)
// 全局过滤器,用来获取指定格式的日期
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getFullYear() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 返回日期格式的模板`yyyy-mm-dd hh:mm:ss`

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// render: h => h(App)的完整写法是render:function(createElement,context){return createElement(obj)}

// createElement是render的核心方法，通常惯例写成h
// createElemnt(newNode,newNodeConfig,childVNodeList),通常是三个参数
// newNode：要创建的节点【必填参数】
// 参数类型： {String | Object | Function}，可以是要创建的HTML 标签名称，也可以是组件对象，也可以是返回为String或Vue Object的异步函数
// newNodeConfig：新节点的配置对象【选填】
// childVNodeList：新节点要包含的子节点集合【选填】
// 参数类型： {String | Array}
// 注意事项：vue官方教程标明传递的VNodes必须是唯一的，如果想重复创建相同的HTML元素，需要用工厂函数来实现

// context是组件实例的上下文环境，包括了组件实例的所有属性
// 包含props: 提供props 的对象
// children: VNode 子节点的数组
// slots: slots 对象
// data: 传递给组件的 data 对象
// parent: 对父组件的引用
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
