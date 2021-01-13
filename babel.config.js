// 运行发布项目所需的插件，其他阶段不使用该插件
const prodPlugin = []
if (process.env.NODE_ENV === 'production') {
  prodPlugin.push('transform-remove-console')
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 引入新增的babel-plugin-transform-remove-console插件
    // 'transform-remove-console'
    ...prodPlugin,
    // 配置路由懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
