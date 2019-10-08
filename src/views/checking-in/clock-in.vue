<template>
  <div>
    <el-button type="primary" @click="$router.push({name:'clockin-import'})">打卡记录上传</el-button>
    <el-divider />
    <el-card>
      <el-table
      :data="clockRed"
    >
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
    </el-table>
    </el-card>
  </div>
</template>

<script>
import { getClockRecord } from "@/api/notice";
export default {
  data() {
    return {
      clockRed: null
    };
  },
  created() {
    this.clockRecord();
  },
  methods: {
    clockRecord() {
      getClockRecord().then(({ data }) => {
        if (data.status === 0) {
          this.clockRed = [...data.msg];
          // this.clockRed.forEach(item => {
          //   if (dateFormat(item.date * 1000) === this.date) {
          //   }else{
          //     if(this.dateHour <9){
          //       this.clockClose = false;
          //       this.active = 1;
          //     }
          //   }
          // });
        }
      });
    }
  }
};
</script>

<style>
</style>