<template>
  <div id="time-management">
    <el-row>
      <el-col :span="12">
        <el-switch
          style="margin-right:10px"
          v-model="searchType"
          active-color="#13ce66"
          inactive-color="#ff9900"
          active-text="起止日期"
          inactive-text="年份"
        ></el-switch>
        <el-date-picker
          v-show="searchType"
          v-model="rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-date-picker v-show="!searchType" v-model="yearDate" type="year" placeholder="选择年"></el-date-picker>
        <el-button type="primary" @click="getDates" :loading="searchLoading">查询</el-button>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button
            v-if="!isUpload"
            icon="el-icon-circle-plus"
            type="success"
            @click="openFile"
            :loading="btnLoading"
          >Excel导入节假日</el-button>
          <el-button
            v-else
            icon="el-icon-upload"
            :loading="btnLoading"
            type="success"
            @click="uploadExcel"
          >上传Excel</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-calendar v-model="value" :first-day-of-week="7">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{date, data}">
        <div>{{data.day.split('-')[2]}}</div>
        <h4 style="color:#ed4014;margin-top:10px">{{ isFestival(date)}}</h4>
      </template>
    </el-calendar>
    <input
      class="file_inp"
      ref="file_inp"
      style="display: none;"
      accept=".xlsx"
      type="file"
      @change="importExcel"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
import { parseExcel } from "@/api/assets";
import { getDates, uploadDates } from "@/api/admin";
export default {
  name: "time-management",
  data() {
    return {
      dayjs,
      rangeDate: "",
      yearDate: "",
      searchType: false, // 按哪种形式搜索
      btnLoading: false,
      searchLoading: false,
      value: new Date(),
      UploadData: [], // 导入后的数据
      isUpload: false, // 显示“导入”还是“上传”按钮
      DateList: [],
    };
  },
  /* computed: {
    FestivalF() {
      this.DateList
      return function(date) {
        let obj = this.DateList.findIndex(t => {
          return (
            dayjs(t.date * 1000).format("YYYYMMDD") ==
            dayjs(date).format("YYYYMMDD")
          );
        });
        return obj.name || ""
      };
    }
  }, */
  /* filters: {
    FestivalF(date) {
      let index =this.DateList.findIndex(t => {
        return (
          dayjs(t.date * 1000).format("YYYYMMDD") ==
          dayjs(date).format("YYYYMMDD")
        );
      });
      return index ? this.DateList[index].name : "";
    }
  }, */
  methods: {
    isFestival(date) {
      let obj = this.DateList.find(t => {
        return dayjs(t.day * 1000).format("YYYYMMDD") == dayjs(date).format("YYYYMMDD");
      });
      return obj ? obj.name : "";
    },
    //获取节假日
    getDates() {
      let params = {};
      if (this.searchType) {
        if (!this.rangeDate || this.rangeDate.length < 2) {
          this.$message.error("请选择日期");
          return false;
        }
        params = {
          start: dayjs(this.rangeDate[0]).format("YYYY/MM/DD"),
          end: dayjs(this.rangeDate[1]).format("YYYY/MM/DD")
        };
        this.value = this.rangeDate[0]
      } else {
        if (!this.yearDate) {
          this.$message.error("请选择年份");
          return false;
        }
        params = {
          year: dayjs(this.yearDate).format("YYYY")
        };
        this.value = params.year
      }
      this.searchLoading = true;
      getDates(params)
        .then(({ data }) => {
          this.DateList = [...data.msg]
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },
    //打开excel文件
    openFile() {
      this.$refs.file_inp.click();
    },
    //后端解析excel
    importExcel(e) {
      if (!e.target.files) {
        return;
      }
      let file = e.target.files[0];
      let Fdata = new FormData();
      Fdata.append("file", file);
      this.btnLoading = true;
      parseExcel(Fdata)
        .then(({ data }) => {
          if (data.status === 0) {
            this.UploadData = [...data.msg];
            this.isUpload = true;
          } else {
            this.$message.error(data.msg);
          }
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },
    //上传节假日
    uploadExcel() {
      this.btnLoading = true;
      uploadDates(this.UploadData)
        .then(({ data }) => {
          this.$notify.info({
            title: "消息",
            message: data.msg
          });
          this.isUpload = false;
        })
        .finally(() => {
          this.btnLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>