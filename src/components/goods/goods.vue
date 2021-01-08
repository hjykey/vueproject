<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品 -->
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @keyup.enter.native="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="goAddPage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表区 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90"
          align="center"
        >
        </el-table-column>
        <el-table-column label="创建时间" width="170" align="center">
          <template v-slot="props">
            {{ props.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="props">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(props.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 获取商品列表数据的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 本页商品数据列表
      goodsList: [],
      // 商品总数据条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取商品列表数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // pageSize 改变时
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // currentPagenum 改变时
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodsList()
    },
    // 删除商品
    async deleteById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      // 点击确认按钮，返回字符串confirm
      // 点击取消按钮，返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'info',
          message: '删除失败'
        })
      }
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 跳转到添加商品页
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
