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
      <!-- 步骤条 activeIndex-0把字符转为数字-->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        :space="'20%'"
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
      <!-- tabs标签页 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          style="margin:1rem"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-tooltip effect="dark" content="三级分类有效" placement="top">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                  }"
                  @change="handleSelectedItemChange"
                ></el-cascader> </el-tooltip></el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item1 in manyTableData"
              :key="item1.attr_id"
              :label="item1.attr_name"
            >
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index) in item1.attr_vals"
                  :key="index"
                  border
                  size="small"
                  style="margin-right:0.5rem"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <!-- 插入了富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" style="margin-top:5px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览窗口 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="80%"
      v-dialogDrag
    >
      <img
        :src="previewPath"
        style="width:100%;
height:auto"
      />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // steps组件的激活索引号
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类，最高三级，各级以'，'分割
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        // 参数数组，包含静态属性和动态参数
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价钱', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品类型列表
      cateList: [],
      // 商品动态参数列表
      manyTableData: [],
      // 商品静态属性列表
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览的绝对路径
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
      // console.log(res.data)
    },
    // 级联选中的商品分类，三级有效
    handleSelectedItemChange (newitem) {
      if (newitem.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 监听tab切换，返回false或者promise的reject则阻止切换
    beforeTabLeave (activeName, oldActiveName) {
      // this.$refs.addFormRef.validate(async (boolean, object) => {
      //   if (!boolean) return console.log(object)
      //   // 验证通过
      //   // console.log(res)
      // })
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      } else return true
    },
    // tabs切换到选中的标签页
    async tabClicked () {
      // 访问了动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.status)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.status)
        this.onlyTableData = res.data
        // console.log(this.onlyTableData)
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      // 获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中查找索引值
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 根据索引删除该对象
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功后的操作
    handleSuccess (response) {
      if (response.meta.status === 200) {
        // 拼接一个图片信息
        const pidInfo = { pic: response.data.tmp_path }
        // 保存到pics数组中
        this.addForm.pics.push(pidInfo)
        this.$message.success(response.meta.msg)
      }
    },
    // 点击添加商品后发起添加商品请求
    add () {
      this.$refs.addFormRef.validate(async (boolean, object) => {
        if (!boolean) {
          // for..in循环只能获取键名，不能获得键值
          // for..of循环允许遍历获得键值 for(let [key,value] of object),对象需原生的 iterator 接口

          for (var i in object) {
            return this.$message.error(object[i][0].message)
          }
        } else {
          // 添加动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 添加静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          // 用lodash的_.cloneDeep(value)函数深拷贝addForm,修改里面的属性
          // jquery 也提供一个$.extend可以用来做深拷贝
          console.log(this.addForm)
          const postForm = _.cloneDeep(this.addForm)
          postForm.goods_cat = postForm.goods_cat.join(',')
          console.log(postForm)
          const { data: res } = await this.$http.post('goods', postForm)
          console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

          this.$message.success(res.meta.msg)
          this.$router.push('/goods')
        }
      })
    }
  },
  computed: {
    catId () {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      else return null
    }
  }
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
