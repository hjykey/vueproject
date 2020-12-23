<template>
  <div><el-button type="info" @click="homeExit">退出</el-button></div>
</template>
<script>
export default {
  methods: {
    homeExit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped></style>
