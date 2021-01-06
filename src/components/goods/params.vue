<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告栏 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row style="margin:0.8rem 0"
        ><el-col
          ><span>选择商品分类：</span>
          <!-- 级联选择框，props为级联的配置 -->
          <el-cascader
            v-model="selectedItem"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleSelectedItemChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 参数标签页,@tab-click的写法是为了取得两个默认的回调参数并传递到自定义函数-->
      <el-tabs
        v-model="nameOfActivedTabPane"
        @tab-click="
          (VueComponent, MouseEvent) =>
            handleTabPaneClick(VueComponent, MouseEvent, 1)
        "
      >
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addAttrdialogVisible = true"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="props">
                <!-- 循环渲染tag -->
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, props.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                  >+标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="removeAttrById(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only"
          ><el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addAttrdialogVisible = true"
            >添加参数</el-button
          ><!-- 表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="props">
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, props.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                  >添加标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作"
              ><template v-slot="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="removeAttrById(scope.row)"
                ></el-button>
              </template>
            </el-table-column> </el-table
        ></el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + dailogTitleText"
      :visible.sync="addAttrdialogVisible"
      width="50%"
      @closed="dialogClosed('addFormRef')"
      v-dialogDrag
    >
      <el-form
        :model="addForm"
        :rules="FormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="dailogTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + dailogTitleText"
      :visible.sync="editAttrdialogVisible"
      width="50%"
      @closed="dialogClosed('editFormRef')"
      v-dialogDrag
    >
      <el-form
        :model="editForm"
        :rules="FormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="dailogTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList: [],
      //  动态表格数据
      manyTableData: [],
      // 静态表格数据
      onlyTableData: [],
      //   级联框选中的项
      selectedItem: [],
      // 激活的标签页名字
      nameOfActivedTabPane: 'many',
      //   控制添加属性的对话框
      addAttrdialogVisible: false,
      //   控制修改参数的对话框
      editAttrdialogVisible: false,
      // 添加参数的表单对象
      addForm: { attr_name: '' },
      editForm: {
        attr_name: '',
        attr_id: '',
        cat_id: '',
        attr_sel: '',
        attr_vals: ''
      },
      //   验证规则
      FormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getAllCateList()
  },
  methods: {
    //   获取所有商品分类表
    async getAllCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
      //   console.log(this.cateList)
    },
    // 获取商品参数列表
    async getAttrList () {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.nameOfActivedTabPane }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   把res.data中的attr_vals属性由字符串转为数组，以空格切分
      //   注意空字符串split会生成一个['']数组，此时应返回[]数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为item增加属性
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res.data)
      if (this.nameOfActivedTabPane === 'many') this.manyTableData = res.data
      if (this.nameOfActivedTabPane === 'only') this.onlyTableData = res.data
      // console.log(res.data)
    },
    // 监听级联框的选中项
    handleSelectedItemChange () {
      // 选中的非三级分类为非法,清空选择项
      if (this.selectedItem.length !== 3) {
        this.selectedItem = []
        this.manyTableData = []
        this.onlyTableData = []
      } else this.getAttrList()
    },
    // 监听选中的标签页
    handleTabPaneClick (target, event, value) {
      this.getAttrList()
    },
    // dialog对话框关闭后的签里工作
    dialogClosed (refval) {
      this.$refs[refval].resetFields()
    },
    // 添加动态参数或者静态属性
    addAttr () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.nameOfActivedTabPane,
            attr_vals: ''
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addAttrdialogVisible = false
        this.$message.success(res.meta.msg)
        this.getAttrList()
      })
    },
    // 显示修改参数的对话框
    showEditDialog (value) {
      //   console.log(value)
      this.editForm.cat_id = value.cat_id
      this.editForm.attr_id = value.attr_id
      this.editForm.attr_sel = value.attr_sel
      this.editForm.attr_name = value.attr_name
      this.editAttrdialogVisible = true
    },
    // 修改参数
    editAttr () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
            attr_vals: this.editForm.attr_vals
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editAttrdialogVisible = false
        this.getAttrList()
      })
    },
    // 删除参数
    async removeAttrById (val) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${val.cat_id}/attributes/${val.attr_id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getAttrList()
    },
    // 文本框失去焦点或enter触发
    async handleInputConfirm (val) {
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
      } else {
        val.attr_vals.push(val.inputValue.trim())
        val.inputValue = ''
        val.inputVisible = false
        this.editForm.cat_id = val.cat_id
        this.editForm.attr_id = val.attr_id
        this.editForm.attr_sel = val.attr_sel
        this.editForm.attr_name = val.attr_name
        this.editForm.attr_vals = val.attr_vals.join(' ')
        // console.log(val)
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
            attr_vals: this.editForm.attr_vals
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      }
    },
    showInput (val) {
      val.inputVisible = true
      // input获取焦点
      // $nextTick当页面上元素被重新渲染后执行回调函数中的代码
      // 直接使用回调函数会出现找不到元素的情况，所以nexttick等待渲染完成
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监视关闭tag标签触发的事件
    async handleClose (index, val) {
      val.attr_vals.splice(index, 1)
      this.editForm.cat_id = val.cat_id
      this.editForm.attr_id = val.attr_id
      this.editForm.attr_sel = val.attr_sel
      this.editForm.attr_name = val.attr_name
      this.editForm.attr_vals = val.attr_vals.join(' ')
      // console.log(val)
      const { data: res } = await this.$http.put(
        `categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.editForm.attr_sel,
          attr_vals: this.editForm.attr_vals
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    //   如果按钮被禁用返回true,否则返回false
    isBtnDisabled () {
      if (this.selectedItem.length !== 3) return true
      else return false
    },
    // 获取当前级联选中项的三级分类ID
    getCateId () {
      if (this.selectedItem.length === 3) return this.selectedItem[2]
      else return null
    },
    // 动态显示添加参数对话框的标题名称
    dailogTitleText () {
      if (this.nameOfActivedTabPane === 'many') return '动态参数'
      if (this.nameOfActivedTabPane === 'only') return '静态属性'
      else return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 0.1rem;
}
.input-new-tag {
  width: 10rem;
}
</style>
