<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card
      ><el-row>
        <el-col><el-button type="primary">添加分类</el-button></el-col></el-row
      >
      <!-- 表格区 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        stripe
        :expand-type="false"
        :selection-type="false"
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isOk="props">
          <i
            class="el-icon-error"
            style="color:red;"
            v-if="props.row.cat_deleted"
          ></i>
          <i class="el-icon-success" style="color:lightgreen;" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="props"
          ><el-tag v-if="props.row.cat_level === 0">一级</el-tag
          ><el-tag type="success" v-else-if="props.row.cat_level === 1"
            >二级</el-tag
          ><el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt>
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // get方法的查询参数,查询商品分类的数据列表,type(1,2,3)表示对应级别,最多为3,pagenum表示第几页,pagesize每页多少条数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的列表
      cateList: [],
      //   总数据条数
      totalNum: 0,
      //   为tree-table组件指定列
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          //   prop: 'cat_deleted',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getGoodsCateList()
  },
  methods: {
    //   获取商品分类的数据列表
    async getGoodsCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.totalNum = res.data.total
    }
  }
}
</script>
<style lang="less" scoped></style>
