<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row
        ><el-col><el-button type="primary">添加角色</el-button></el-col></el-row
      >
      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="props">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in props.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(props.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限列 -->
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRightById(props.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级权限列 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(props.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="props">
            <el-button type="primary" icon="el-icon-search" size="small"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="small"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-config"
              size="small"
              @click="showSetRightDialog(props.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @closed="setRightDialogClosed()"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>

      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [], // 角色列表
      setRightDialogVisible: false, // 控制显示分配权限的对话框
      rightList: [], // 所有权限的list
      // 树形控制的属性绑定
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 树中默认选中的节点,父级节点会自动半选
      defKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 删除权限
    async removeRightById (role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      if (confirmRes !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 调用此函数会重新渲染页面
      // this.getRolesList()
      // 给children重新赋值可以避免整体刷新页面，res.data由服务器在删除成功后返回
      role.children = res.data
    },
    // 显示分配权限的对话框
    async showSetRightDialog (role) {
      // 获取所有权限的树形列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$$message.error(res.meta.msg)
      this.rightList = res.data
      // 调用递归函数获取三级节点，显示为默认
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取三级权限的ID并保存到defkeys数组
    getLeafKeys (node, arr) {
      // 不包含children属性时表示是三级节点，此时获取该id
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听设置权限对话框关闭
    setRightDialogClosed () {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0.7rem;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
