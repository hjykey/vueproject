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
        <el-col
          ><el-button type="primary" @click="showAddCategoriesDialog"
            >添加分类</el-button
          ></el-col
        ></el-row
      >
      <!-- 表格区 -->
      <tree-table
        style="margin-top:0.7rem"
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
        <template v-slot:opt="props">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCate(props.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(props.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoriesDialogVisible"
      :close-on-click-modal="false"
      @closed="resetAfterDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedParentLevel"
            :options="parentcateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true
            }"
            @change="handleSelectedParentLevelChange"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
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
        pagesize: 10
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
      ],
      // 显示添加分类的对话框
      addCategoriesDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentcateList: [],
      // 选中的父级分类
      selectedParentLevel: [],
      // 编辑分类
      editCateForm: { id: '', cat_name: '' },
      // 控制显示编辑分类的对话框
      editCateDialogVisible: false
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
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.totalNum = res.data.total
    },
    // 监听一页显示多少条改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    // 监听页码变化
    handleCurrentChange (pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getGoodsCateList()
    },
    // 显示添加分类对话框
    showAddCategoriesDialog () {
      this.getParentCateList()
      this.addCategoriesDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentcateList = res.data
    },
    // 监控选中级联项变化
    handleSelectedParentLevelChange () {
      // 当this.selectedParentLevel大于0时说明选中了父级分类，否则为没有选中，父级分类默认为0
      if (this.selectedParentLevel.length > 0) {
        this.addCateForm.cat_pid = this.selectedParentLevel[
          this.selectedParentLevel.length - 1
        ]
        this.addCateForm.cat_level = this.selectedParentLevel.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
      //  console.log(this.selectedParentLevel)
    },
    // 对话框关闭后的清理
    resetAfterDialogClosed () {
      this.selectedParentLevel = []
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击确定按钮后执行添加分类的操作
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addCategoriesDialogVisible = false
        this.getGoodsCateList()
      })
      // console.log(this.addCateForm)
      // this.addCategoriesDialogVisible = false
    },
    // 根据分类ID删除用户
    async removeCateById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'info',
          message: '删除失败'
        })
      }
      this.$message.success(res.meta.msg)
      this.getGoodsCateList()
    },
    // 显示编辑分类的窗口
    showEditCate (cate) {
      this.editCateDialogVisible = true
      this.editCateForm.cat_name = cate.cat_name
      this.editCateForm.id = cate.cat_id
    },
    // 编辑分类
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.id}`,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editCateDialogVisible = false
        this.getGoodsCateList()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
