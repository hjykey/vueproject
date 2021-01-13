# 项目优化执行的步骤

1. 生成打包报告
2. 第三方模块启动cdn
3. Element-ui组件按需加载
4. 路由实现懒加载
5. 完成首页内容定制

##### 具体实施：

1. 加入nprogress组件，页面切换时页面上方会有进度条
2. 安装babel-plugin-transform-remove-console插件，用于在building时移除所有console函数
3. 打包报告的命令 vue-cli-service build --report,通过可视化面板可在任务栏下查看
4. 根据报告优化里面资源占用比较大的项，包括依赖项
5. vue-cli3.0以后的版本隐藏了webpack配置，需要修改时可自己创建配置vue.config.js,具体配置参考请查看(https://cli.vuejs.org/zh/config/#vue-congfig-js)
6. 在vue.config.js里自定义打包入口，默认情况下开发模式和发布模式的入口都为src/main.js
7. 通过externals加载外部CDN资源，缩小打包文件体积，优化加载速度。默认情况下，通过import语法导入的第三方依赖包，最终会被打包到同一个文件中，从而导致打包成功后的单文件体积过大。
8. 在public/index下添加cdn引用

