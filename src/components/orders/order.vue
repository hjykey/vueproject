<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索头 -->
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="searchId">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="ordersDataList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template v-slot="props">
            <el-tag type="success" v-show="props.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-show="props.row.pay_status === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="props">
            {{ props.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="props">
            <el-tooltip
              effect="dark"
              content="修改订单地址"
              placement="top-end"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="showEditConsigneeDialog(props.row.consignee_addr)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流信息" placement="top-end">
              <el-button
                type="success"
                icon="el-icon-location"
                size="small"
                @click="showProgressDialog"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editConsigneeVisible"
      width="50%"
      @close="EditConsigneeDialogClosed"
    >
      <el-form
        :model="consigneeAddrForm"
        :rules="rules"
        ref="consigneeAddrFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="consigneeAddrForm.address1"
            :options="cityData"
            :props="{
              expandTrigger: 'hover',
              value: 'value',
              label: 'label',
              children: 'children'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="consigneeAddrForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editConsigneeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConsigneeAddr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 订单物流详情 -->
    <el-dialog title="物流详情" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
          placement="top"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
// 导入中国省市区/县信息
import cityData from './citydata'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        // 当前页码,不能为空
        pagenum: 1,
        // 每页显示条数,不能为空
        pagesize: 10,
        user_id: '',
        // 支付状态订单状态： 0 未付款、1 已付款
        pay_status: '',
        // 是否发货
        is_send: '',
        // ['个人','公司']可以为空
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        // 收货人地址
        consignee_addr: ''
      },
      // 总订单数
      total: 0,
      // 搜索订单号
      searchId: '',
      // 订单数据表
      ordersDataList: [],
      editConsigneeVisible: false,
      consigneeAddrForm: {
        address1: [],
        address2: ''
      },
      rules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrdersData()
  },
  methods: {
    async getOrdersData () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.ordersDataList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersData()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrdersData()
    },
    showEditConsigneeDialog (addr) {
      this.editConsigneeVisible = true
    },
    editConsigneeAddr () {
      this.editConsigneeVisible = false
    },
    EditConsigneeDialogClosed () {
      this.$refs.consigneeAddrFormRef.resetFields()
    },
    async showProgressDialog () {
      // 请求物流信息,804909574412544580为测试运单号
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.progressInfo = res.data
      // console.log(this.progressInfo)
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
