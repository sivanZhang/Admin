<template>
  <div>
    <el-button type="primary" @click="$router.push({name:'clockin-import'})">打卡记录上传</el-button>
    <el-divider />
    <el-col :span="8">
      <el-row>
        <el-col :span="10">
          <el-input v-model="filterText" placeholder="请输入用户名" @keyup.enter.native="clockRecord(1)">
            <el-button @click="clockRecord(1)" slot="append" icon="el-icon-search" type="primary" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button @click="clockRecord()" type="primary" style="margin-left: 15px">重置</el-button>
        </el-col>
      </el-row>
    </el-col>
    <el-select v-model="value" placeholder="请选择部门" style="margin-left:-110px;width:150px">
      <el-option v-for="item of deptList" :label="item.name" :value="item.name" :key="item.id"></el-option>
    </el-select>
    <el-button @click="clockRecord(2)" slot="append" icon="el-icon-search" style="color:gray" />
    <el-button @click="clockRecord()" type="primary" style="margin-left: 10px">重置</el-button>

    <el-date-picker
      v-model="value1"
      type="datetime"
      placeholder="请选择上班时间"
      style="width:150px;margin-left:50px"
    ></el-date-picker>
    <el-date-picker v-model="value2" type="datetime" placeholder="请选择下班时间" style="width:150px"></el-date-picker>

    <el-button @click="clockRecord(3)" slot="append" icon="el-icon-search" style="color:gray" />
    <el-button @click="clockRecord()" type="primary" >重置</el-button>
    <el-card>
      <el-table :data="clockRed">
        <el-table-column prop="user_name" label="用户名"></el-table-column>
        <el-table-column prop="date" label="打卡日期">
          <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="come" label="上班时间">
          <template slot-scope="scope">{{scope.row.come|dateHMSFormat}}</template>
        </el-table-column>
        <el-table-column prop="leave" label="下班时间">
          <template slot-scope="scope">{{scope.row.leave|dateHMSFormat}}</template>
        </el-table-column>
        <el-table-column prop="late_come" label="迟到">
          <template slot-scope="scope">{{scope.row.late_come|lateStatus}}</template>
        </el-table-column>
        <el-table-column prop="early_leave" label="早退">
          <template slot-scope="scope">{{scope.row.early_leave|earlyStatus}}</template>
        </el-table-column>

        <!-- </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getClockRecord } from "@/api/notice";
// import { mapState } from "vuex";
import { getDept } from "@/api/admin";
import dayjs from "dayjs";
export default {
  data() {
    return {
      filterText: "",
      value: null,
      clockRed: null,
      deptList: [],
      value1: "",
      value2: "",
      startTime: null,
      endTime: null
    };
  },
  //  computed: {
  //   ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  // },
  created() {
    this.getDeptList();
    this.clockRecord();
  },
  methods: {
    getDeptList() {
      getDept().then(({ data }) => {
        this.deptList = [...data.msg];
        //console.log(this.deptList)
      });
    },
    clockRecord(Type) {
      if (Type === 1 && this.filterText) {
        getClockRecord({ name: this.filterText }).then(({ data }) => {
          this.clockRed = [...data.msg];
        });
      } else if (Type === 2) {
        getClockRecord({ dept: this.value }).then(({ data }) => {
          this.clockRed = [...data.msg];
          console.log(this.clockRed);
        });
      } else if (Type === 3) {
        function dataFormat(params) {
          return dayjs(params).format("YYYY/MM/DD HH:mm:ss"); //'yyyy/mm/dd hh:mm:ss'
        }
        this.startTime = dataFormat(this.value1);
        this.endTime = dataFormat(this.value2);
        getClockRecord({ start: this.startTime, end: this.endTime }).then(
          ({ data }) => {
            this.clockRed = [...data.msg];
            // console.log(this.clockRed);
          }
        );
      } else {
        getClockRecord().then(({ data }) => {
          this.clockRed = [...data.msg];
        });
      }
    }
  }
};
</script>

<style>
</style>