<template>
  <div id="links">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-plus" type="primary" @click="showLinksForm">添加环节</el-button>
    </div>
    <el-table
      ref="assetTable"
      :data="LinkList"
      style="width: 100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" align="center" width="65px"></el-table-column>
      <el-table-column prop="content" label="环节内容" align="left"></el-table-column>
      <el-table-column prop="charger_name" label="委托人" align="left"></el-table-column>

      <el-table-column prop="top_dept_name" label="工种" align="left"></el-table-column>
      <el-table-column label="难度等级" align="center">
        <template slot-scope="scope">{{scope.row.level|levelFilter}}</template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加环节" :visible.sync="isDrawerShow" width="526px" center :modal="false">
      <el-form :model="LinkForm" :rules="rules" ref="linkForm" label-width="120px">
        <el-form-item label="环节内容" prop="content">
          <el-input v-model="LinkForm.content"></el-input>
        </el-form-item>
        <el-form-item label="前置工种" prop="pid">
          <el-cascader
            v-model="LinkForm.pid"
            placeholder="输入搜索工种"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="当前工种" prop="dept">
          <el-cascader
            v-model="LinkForm.dept"
            placeholder="输入搜索工种"
            :options="selectList"
            :props="{ checkStrictly: true}"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="时间" prop="datetime">
          <el-date-picker
            v-model="LinkForm.datetime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addLinks } from "@/api/links";
export default {
  name: "links",
  data() {
    return {
      isDrawerShow: false,
      rules: {
        content: [
          { required: true, message: "请输入环节内容", trigger: "blur" }
        ],
        pid: [{ required: true, message: "请输前置工种", trigger: "blur" }],
        dept: [{ required: true, message: "请输当前工种", trigger: "blur" }]
      },
      LinkForm: {},
      createLoading: false,
      selectList: []
    };
  },
  props: ["LinkList", "assetId"],
  computed: {
    DeptList() {
      return this.$store.state.admin.DeptList;
    }
  },
  methods: {
    showLinksForm() {
      this.isDrawerShow = true;
    },
    cancel() {
      this.isDrawerShow = false;
      this.$refs["linkForm"].resetFields();
    },
    addLinks() {
      this.$refs["linkForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.LinkForm,
            pid: this.LinkForm.pid[this.LinkForm.pid.length - 1],
            dept: this.LinkForm.dept[this.LinkForm.dept.length - 1],
            asset: this.assetId
          };
          if ("datetime" in this.LinkForm && this.LinkForm.datetime.length) {
            data = {
              ...data,
              start_date: dataFormat(this.LinkForm.datetime[0]),
              end_date: dataFormat(this.LinkForm.datetime[1])
            };
            delete data.datetime;
          }
          //若果是修改
          addLinks({ "links": [data] })
            .then(({ data }) => {
              this.createLoading = false;
              this.$message(data.msg);
              if (data.status === 0) {
                this.$emit("refresh");
                this.isDialogShow = false;
              }
            })
            .catch(err => {
              this.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    formatList() {
      /* function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"]=null
          }
        }
      } */

      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      /* changeList(this.selectList); */
    }
  },
  async created() {
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

