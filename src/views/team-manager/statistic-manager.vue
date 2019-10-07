<!-- 数据统计 -->
<template>
  <div id="statistic-manager">
    <div style="width:300px">
      <el-row>
        <el-col :span="4" style="padding-top:5px">项目：</el-col>
        <el-col :span="20">
          <el-select v-model="value1" @change="handleGroupClick">
            <el-option
              v-for="(item,index) of projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-divider />
    </div>
    <div v-if="click_id">
      <statistics :click_id="click_id" ref="click" />
    </div>
  </div>
</template>

<script>
import { getProjects } from "@/api/project";
import statistics from "@/views/projects/components/statistics";
export default {
  name: "statistic-manager",
  components: { statistics },
  data() {
    return {
      projectList: [],
      defaultProps: {
        // children: "children",
        label: "name"
      },
      filterText: "",
      click_id: null,
      value1: null
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getList() {
      getProjects().then(({ data }) => {
        this.projectList = [...data.msg];
      });
    },
    // 工种单击触发事件
    handleGroupClick() {
      this.click_id = this.value1;
      this.$refs["click"].getAssetStatistics();
      this.$refs["click"].getTaskStatistics();
      this.$refs["click"].getBurnOut();
      this.$refs["click"].exportData();
      this.$refs["click"].getCommitCount();
      this.$refs["click"].getAssetTask();
      this.$refs["click"].getGradeChange();
      this.$refs["click"].getProjectProgress();
      this.$refs["click"].getGantt();
      this.$refs["click"].getganttStat();
      console.log(this.click_id);
      //   console.log(data);
    },
    //搜索
    searchGroup(value, data) {
      if (!value) return true;

      return data.name.indexOf(value) !== -1;
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang='scss' scoped>
</style>