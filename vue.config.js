// 自定义的vue.config.js
module.exports = {
  chainWebpack: config => {
    //   发布阶段的入口改为main-prod.js
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      // 默认情况下，通过import语法导入的第三方依赖包，最终会被打包到同一个文件中，从而导致打包成功后的单文件体积过大，externals设置后会编译成单个文件直接使用
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: ' nprogress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 使用插件，为htmlWebpackPlugin.options增加一个isprod属性，在index.html用来判断在不同模式下是否需要加载css和js文件
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = true
        return args
      })
    })
    //   开发阶段的入口改为main-dev.js
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = false
        return args
      })
      // index.html中 <title><%= htmlWebpackPlugin.options.title %></title>的title
      // 参考https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E9%80%89%E9%A1%B9
      //   config.plugin('html').tap(args => {
      //     args[0].title = '电商后台管理平台开发版'
      //     return args
      //   })
    })
  }
}
