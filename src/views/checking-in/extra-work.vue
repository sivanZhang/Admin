<template>
  <div id="extra-work">
    <el-row :gutter="15">
      <el-col :span="12">
        <label for="select">查询范围：</label>
        <el-select
          v-model="currentSelect"
          placeholder="请选择"
          id="select"
          @change="handleSelectLChange"
        >
          <el-option
            v-for="item in ListFilters"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button type="primary">申请加班</el-button>
      </el-col>
    </el-row>
    <el-table :data="ExtraworkList" v-loading="tableLoading">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="creator.username" label="申请人"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时(小时)"></el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.overtime_status===null" style="color:#ff9900">审批中</span>
          <span v-else-if="scope.row.overtime_status" style="color:#19be6b">同意</span>
          <span v-else style="color:#ed4014">拒绝</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="加班申请" :visible.sync="dialogVisible">
      
    </el-dialog>
  </div>
</template>

<script>
import { getOvertime } from "@/api/checkingIn";
export default {
  name: "extra-work",
  data() {
    return {
      dialogVisible:false,
      tableLoading: false,
      ExtraworkList: [],
      currentSelect: 1,
      ListFilters: [
        {
          value: 1,
          label: "我的申请"
        },
        {
          value: 0,
          label: "所有申请"
        }
      ]
    };
  },
  methods: {
    //监听下拉框改变
    handleSelectLChange() {
      this.getExtrworks();
    },
    getExtrworks() {
      let params = {};
      if (this.currentSelect) {
        params = {
          myovertime: ""
        };
      } else {
        params = {
          allovertime: ""
        };
      }
      this.tableLoading = true;
      getOvertime(params)
        .then(({ data }) => {
          this.ExtraworkList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.getExtrworks();
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>