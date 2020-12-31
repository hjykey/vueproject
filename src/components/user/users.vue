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
          <template v-slot="scope">
            <!-- 修改按钮 -->
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
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="openSetRoleDialog(scope.row)"
              ></el-button>
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
      :close-on-click-modal="false"
      width="50%"
      @closed="resetAfterDialogClosed('addFormRef')"
    >
      <!-- 主体区 -->
      <el-form
        :model="addForm"
        :rules="FormValidateRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input v-model="addForm.checkpassword" type="password"></el-input>
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
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @closed="resetAfterDialogClosed('editFormRef')"
      v-dialogDrag
    >
      <el-form
        :model="editForm"
        :rules="FormValidateRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @closed="setRoleDialogClosed()"
      v-dialogDrag
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" :placeholder="userInfo.role_name">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义的手机号验证规则
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
    // 自定义的密码验证规则
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 2 // 当前每页多少条数据
      },
      // 所有用户的列表
      userList: {
        pagenum: { type: Number, default: 0 },
        total: 1,
        users: []
      },
      // 所有角色的列表
      roleslist: [],
      // 控制对话框dialog的显示
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        checkpassword: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息的表单数据
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则组
      FormValidateRules: {
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
        ],
        checkpassword: [
          {
            validator: checkPassword,
            required: true,
            trigger: 'blur'
          }
        ]
      },
      // 需要被分配角色的用户
      userInfo: {},
      // 分配时选中的角色ID
      selectedRoleId: ''
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
    // 监听修改用户状态,发起修改状态请求
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
    // 关闭添加用户弹出框后清理表单
    resetAfterDialogClosed (refs) {
      this.$refs[refs].resetFields()
    },
    // 点击确定按钮，添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 验证通过，发起添加用户的请求
        const { username, password, email, mobile } = this.addForm
        const { data: res } = await this.$http.post('users', {
          username,
          password,
          email,
          mobile
        })
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList() // 刷新列表
      })
    },
    // 显示编辑用户的对话框
    showEditDialog (userinfo) {
      Object.keys(this.editForm).forEach(key => {
        this.editForm[key] = userinfo[key]
      })
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 点击确定按钮，修改用户完成
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 验证通过，发起修改用户的请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList() // 刷新列表
      })
    },
    // 根据角色ID删除用户
    async removeUserById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'info',
          message: '删除失败'
        })
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 打开分配角色的对话框
    async openSetRoleDialog (userInfo) {
      this.userInfo = userInfo
      // 展开对话框前获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleslist = res.data
      // console.log(this.roleslist)
      this.setRoleDialogVisible = true
    },
    // 分配角色
    async setRole () {
      if (!this.selectedRoleId) return this.$message.error('请选择用户角色')
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.getUserList()
      this.setRoleDialogVisible = false
      this.$message.success(res.meta.msg)
    },
    // 分配角色对话框关闭后
    setRoleDialogClosed () {
      this.userInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>
<style lang="less" scoped></style>
