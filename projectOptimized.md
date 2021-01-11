# 项目优化执行的步骤

1. 生成打包报告
2. 第三方模块启动cdn
3. Element-ui组件按需加载
4. 路由实现懒加载
5. 完成首页内容定制

##### 具体实施：

1. 加入nprogress组件，页面切换时页面上方会有进度条
2. 安装babel-plugin-transform-remove-console插件，用于在building时移除所有console函数

