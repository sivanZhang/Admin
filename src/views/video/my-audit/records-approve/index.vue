<template>
  <div id="records-approve">
    <header class="text-right search-block">
      <label class="input-label">任务名称:</label>
      <el-input placeholder="请输入内容" v-model="httpParams.task_name" clearable />
      <label class="input-label">镜头号:</label>
      <el-input placeholder="请输入内容" v-model="httpParams.asset_name" clearable />
      <label class="input-label">审批结果:</label>
      <el-input placeholder="请输入内容" v-model="httpParams.approve_result" clearable />
      <label class="input-label">任务内容:</label>
      <el-input placeholder="请输入内容" v-model="httpParams.task_content" clearable />
      <el-button-group>
        <el-button type="primary" @click="get_Records">查询</el-button>
        <el-button @click="handelResetParams">重置</el-button>
      </el-button-group>
    </header>
    <RecordsTable :records-list="recordsList" :is-load="isLoad" />
    <el-pagination
      class="text-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="httpParams.page"
      :page-sizes="pageSizes"
      :page-size="httpParams.pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="resultTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { getRecords } from "@/api/video";
// table组件分离
import RecordsTable from "./records-approve_table";
export default {
  name: "records-approve",
  components: {
    RecordsTable
  },
  data() {
    return {
      httpParams: {
        pagenum: 20,
        page: 1
      },
      // 表格数据
      recordsList: [],
      isLoad: false,
      resultTotal: 0,
      pageSizes: [20, 30, 50, 100]
    };
  },
  created() {
    this.get_Records();
  },
  methods: {
    // 监听分页每页大小改变
    handleSizeChange(pageSize) {
      this.httpParams.pagenum = pageSize;
      this.get_Records();
    },
    // 监听是否换页
    handleCurrentChange(currentPage) {
      this.httpParams.page = currentPage;
      this.get_Records();
    },
    // 重置
    handelResetParams() {
      this.httpParams = {
        pagenum: 20,
        page: 1
      };
      this.get_Records();
    },
    // http查询我的审核记录数据
    get_Records() {
      // 去掉空值参数
      Object.keys(this.httpParams).forEach(t => {
        if (!this.httpParams[t]) {
          delete this.httpParams[t];
        }
      });
      this.isLoad = true;
      getRecords(this.httpParams)
        .then(({ data }) => {
          if (data.status === 0) {
            this.resultTotal = data.count;
            this.recordsList = data.msg;
          } else {
            this.$message.warning(data.masg);
          }
        })
        .finally(() => {
          this.isLoad = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#records-approve {
  .search-block {
    .el-button-group {
      margin-left: 15px;
    }
    .el-input {
      width: 200px;
    }
    .input-label {
      margin-left: 10px;
    }
  }
  .el-table {
    margin: 15px 0;
  }
}
</style>