<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="未找到图片！" srcset="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        class="login_form"
        label-width="10px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item label="" prop="username">
          <!-- 用了第三方阿里图标库 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns" label="">
          <el-button type="primary" @click="submitLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: { username: 'admin', password: '123456' },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 24, message: '长度在 3 到 24 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitLoginForm () {
      // 和 this.$refs[loginFormRef]等价,预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // await后获取不再是一个promise，而是一个resolved或者reject，后面不用再then().catch()
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 登录成功后把token保存在sessionstorage中，网页打开时有效，区别于localstorage
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    resetLoginForm (refName) {
      this.$refs[refName].resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  border: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: -2px 0 10px rgb(43, 40, 40);
}
.avatar_box {
  width: 130px;
  height: 130px;
  box-shadow: 0 0 10px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0px 10px;
  box-sizing: border-box;
}
</style>
