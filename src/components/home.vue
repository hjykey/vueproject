<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img
          src="../assets/ooopic.png"
          alt="未找到图片"
          style=" width: 60px; height: 60px;object-fit:contain"
        />
        <span>XXXXXXXX平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏菜单区 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togglecollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 含有下拉菜单的菜单 -->
          <el-submenu
            :index="'/' + item.path"
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
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
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
      <el-main><router-view></router-view></el-main>
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
      },
      // 折叠
      isCollapse: false,
      // 激活的nav项
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  updated () {
    const path = window.location.hash.split('#')
    this.activePath = path[1]
    // console.log(this.activePath)
  },
  // mounted () {
  //   console.log('打印一次')
  //   setInterval(() => {
  //     console.log('打印一次')
  //   }, 1000)
  // },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      //  // { data: res }解构对象中的data属性赋值给data并重命名为res
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    togglecollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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
  // text-align: center;
  // line-height: 160px;
}

.el-container {
  margin-bottom: 1px;
  height: 100%;
}
// 图标后与文字间距
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  background-color: #4a5064;
  color: #ffffff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.5rem;
}
</style>
