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
        <el-button type="primary" @click="openDialog">申请加班</el-button>
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
      <el-table-column label="操作" align="center">
        <!--  v-if="currentSelect" -->
        <template slot-scope="scope">
          <el-button type="text">修改</el-button>
          <el-button type="text" style="color:#ed4014">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="加班申请" :visible.sync="dialogVisible" width="512px">
      <el-form :model="ApplyForm" :rules="rules" ref="apply-form" label-width="100px">
        <el-form-item label="加班时间" prop="overtime_hour">
          <el-input-number v-model="ApplyForm.overtime_hour" style="width:100%"></el-input-number>
        </el-form-item>
        <el-form-item label="加班任务" prop="task">
          <el-select v-model="ApplyForm.task" placeholder="请选择活动区域" style="width:100%">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加班原因" prop="reason">
          <el-input type="textarea" v-model="ApplyForm.reason" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('apply-form')">立即创建</el-button>
          <el-button @click="resetForm('apply-form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getOvertime, postOvertime } from "@/api/checkingIn";
export default {
  name: "extra-work",
  data() {
    return {
      ApplyForm: {},
      rules: {
        overtime_hour: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        task: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      dialogVisible: false,
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          postOvertime(this.ApplyForm).then(() => {
            this.resetForm("apply-form");
            this.dialogVisible = false;
            this.currentSelect = 1;
            this.$nextTick(() => {
              this.getExtrworks();
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openDialog() {
      this.dialogVisible = true;
    },
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