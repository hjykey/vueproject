<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部提醒 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activeNum"
        finish-status="success"
        :space="200"
        align-center
        style="margin:1rem;"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNum: 1
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
// /deep/ 深度修改标签样式，在scoped的style中修改样式不会覆盖elementUI的默认样式
//另一种修改方式是内联样式，在元素后加style
//还有一种方式是在全局样式golbal.css里修改
//此处修改了step组件的字体size
/deep/ .el-step__title {
  font-size: 0.6rem;
}
</style>
