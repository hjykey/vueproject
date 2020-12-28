<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索和添加用户 -->
      <el-row :gutter="5">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList.users" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态"
          ><template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color=""
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">{{
              scope.row.username
            }}</el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的弹出对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed()"
    >
      <!-- 主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮位置 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义校验手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17591)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (regMobile.test(value)) {
          return callback()
        } else {
          callback(new Error('请输入正确的手机号码'))
        }
      }, 1000)
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 2 // 当前每页多少条数据
      },
      userList: {
        pagenum: { type: Number, default: 0 },
        total: 1,
        users: []
      },
      addDialogVisible: false,
      addForm: { username: '', password: '', email: '', mobile: '' }, // 添加用户的表单数据
      addFormRules: {
        // 添加用户数据表单的规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            validator: checkMobile,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // { data: res }解构对象中的data属性赋值给data并重命名为res
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data
      // console.log(this.userList)
    },
    // 监听pageSize改变的事件
    handleSizeChange (newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听current-page的事件
    handleCurrentChange (newpage) {
      // console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 监听修改用户状态
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return (userinfo.mg_state = !userinfo.mg_state)
      }
      this.$message.success(res.meta.msg)
    },
    // 关闭添加用户弹出框
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped></style>
