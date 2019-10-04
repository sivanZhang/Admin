<template>
  <div id="extra-work">
    <label for="select">查询范围：</label>
    <el-select v-model="currentSelect" placeholder="请选择" id="select" @change="handleSelectLChange">
      <el-option
        v-for="item in ListFilters"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-button type="primary" @click="openDialog(0)" style="margin-left:15px">申请加班</el-button>
    <el-button type="danger" icon="el-icon-delete"  @click="deletList" style="margin-left:15px"  :disabled="this.multipleSelection.length === 0">批量删除</el-button>
    <el-table 
    :data="ExtraworkList" 
    @selection-change="handleSelectionChange"
    v-loading="tableLoading"
    :row-key="row=>row.overtime_id"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55px"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="creator.username" label="申请人"></el-table-column>
      <el-table-column prop="task.name" label="加班任务"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时(小时)"></el-table-column>
      <el-table-column prop="overtime_date" label="申请日期">
        <template slot-scope="scope">
          {{scope.row.overtime_date|dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.overtime_status===null && currentSelect===1"
            type="text"
            @click="sunbmitApprove(scope.row.overtime_id)"
          >提交审批</el-button>
          <span v-else-if="scope.row.overtime_status===null && currentSelect===0">待提交</span>
          <span v-else-if="scope.row.overtime_status===3">已提交</span>
          <span v-else-if="scope.row.overtime_status===2">审批中</span>
          <span v-else-if="scope.row.overtime_status===1" style="color:#19be6b">同意</span>
          <span v-else-if="scope.row.overtime_status===0" style="color:#ed4014">拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="currentSelect">
        <template slot-scope="scope">
           <el-tooltip effect="dark" content="修改" placement="top">
             <el-button icon="el-icon-edit"  style="color:blue" type="text" @click="openPutDialog(scope.row)"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
             <el-button type="text" icon="el-icon-delete"
                style="color:red" @click="deleteAppty(scope.row.overtime_id)"/>
          </el-tooltip>    
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="加班申请" :visible.sync="dialogVisible" width="512px">
      <el-form :model="ApplyForm" :rules="rules" ref="apply-form" label-width="100px">
        <el-form-item label="加班时长" prop="overtime_hour">
          <el-input-number v-model="ApplyForm.overtime_hour" style="width:100%"></el-input-number>
        </el-form-item>
        <el-form-item label="加班任务" prop="task">
          <el-select v-model="ApplyForm.task" placeholder="请选择由于哪个任务加班" style="width:100%">
            <el-option
              v-for="item of myTasks"
              :label="item.task.name"
              :value="item.task.id"
              :key="item.task.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加班原因" prop="reason">
          <el-input type="textarea" v-model="ApplyForm.reason" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="submitLoading"
            type="primary"
            @click="submitForm('apply-form')"
          >{{currentFormType?'提交修改':'立即创建'}}</el-button>
          <el-button v-if="!currentFormType" @click="resetForm('apply-form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOvertime,
  postOvertime,
  postApply,
  deleteApply,
  putApply
} from "@/api/checkingIn";
import { getStatusTaskList } from "@/api/task";
export default {
  name: "extra-work",
  data() {
    return {
      multipleSelection: [],
      submitLoading: false,
      currentFormType: 0, //表单用于提交什么
      myTasks: null,
      ApplyForm: {},
      rules: {
        overtime_hour: [
          { required: true, message: "请输入加班时长（单位：小时）", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "请选择由于哪个任务加班", trigger: "change" }
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
   handleSelectionChange(val){
      this.multipleSelection = val;
     },
    //批量删除
    deletList(){
      this.$confirm("此操作将永久删除申请,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const id = this.multipleSelection.map(item => item.overtime_id).join(",");
        deleteApply({
          method: "delete",
          ids:id
        }).then(({ data }) => {
          this.$message(data.msg);
          if (data.status === 0) {
            this.dialogVisible = false;
            this.currentSelect = 1;
            this.$nextTick(() => {
              this.getExtrworks();
            });
          }
        });
      })
    },
    //加班申请  提交审核
    sunbmitApprove(overtime_id) {
      postApply({
        overtime_id
      }).then(({ data }) => {
        this.$message(data.msg);
        if (data.status === 0) {
          this.getExtrworks();
        }
      });
    },
    //加班申请提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          function submitFn(Fu, data) {
            self.submitLoading = true;
            Fu(data)
              .then(({ data }) => {
                self.$message(data.msg);
                self.resetForm("apply-form");
                self.dialogVisible = false;
                self.currentSelect = 1;
                self.$nextTick(() => {
                  self.getExtrworks();
                });
              })
              .finally(() => {
                self.submitLoading = false;
              });
          }
          
          if (this.currentFormType === 0) {
            submitFn(postOvertime, self.ApplyForm);
          }
          if (this.currentFormType === 1) {
            submitFn(putApply, self.ApplyForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //type:0 创建，1 修改
    openDialog(type) {
      this.currentFormType = type;
      this.dialogVisible = true;
    },
    //修改加班申请
    openPutDialog(row) {
      this.ApplyForm = Object.assign(
        {},
        {
          overtime_hour: row.overtime_hour,
          reason: row.reason,
          task: row.task.id,
          method: "put",
          id: row.overtime_id
        }
      );
      this.openDialog(1);
    },
    //删除加班申请
    deleteAppty(id) {
      this.$confirm("此操作将删除本条申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteApply({
          method: "delete",
          ids:id
        }).then(({ data }) => {
          this.$message(data.msg);
          if (data.status === 0) {
            this.dialogVisible = false;
            this.currentSelect = 1;
            this.$nextTick(() => {
              this.getExtrworks();
            });
          }
        });
      });
    },
    //监听下拉框改变
    handleSelectLChange() {
      this.getExtrworks();
    },
    //获取 加班申请列表
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
    },
    getMyTasks() {
      getStatusTaskList().then(({ data }) => {
        this.myTasks = [...data.msg];
      });
    }
  },
  created() {
    this.getExtrworks();
    this.getMyTasks();
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>