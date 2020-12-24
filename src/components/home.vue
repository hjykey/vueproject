<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img
          src="../assets/ooopic.png"
          alt="未找到图片"
          style=" width: 50px; height: 50px;object-fit:cover"
        />
        <span>XXXXXXXX平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏菜单区 -->
      <el-aside width="200px">
        <div class="toggle-button">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
        >
          <!-- 含有下拉菜单的菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区，复制到二级菜单下可以让二级菜单也有图标和文本 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单组 -->
            <el-menu-item
              :index="subitem.id + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template>
                <i class="el-icon-menu"></i>
              </template>
              <span>{{ subitem.authName }}</span></el-menu-item
            >
          </el-submenu>
          <!-- 菜单 -->
          <!-- <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item> -->
          <!-- 菜单 -->
          <!-- <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item> -->
          <!-- 菜单 -->
          <!-- <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <!-- 中间区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        102: 'iconfont icon-danju',
        101: 'iconfont icon-shangpin',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // 结构赋值，promise返回的对象里的data赋值给res
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-header,
.el-footer {
  background-color: #373d41;
  color: #ffffff;
  font-size: 30px;
  // line-height: 0px;
  display: flex;
  // 水平方向
  justify-content: space-between;
  // 垂直方向
  align-items: center;
  padding-left: 0px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  color: #333;
  .el-menu {
    border-right: none;
  }
  // text-align: center;
  // line-height: 200px;
}
.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  margin-bottom: 1px;
  height: 100%;
}
// 图标后于文字间距
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  background-color: #4a5064;
  color: #ffffff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.5em;
}
</style>
