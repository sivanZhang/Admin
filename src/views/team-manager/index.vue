<!-- 组长任务分配 -->
<template>
  <div id="team-manager" ref="drawer-parent">
    <el-tabs v-model="activeName">
      <el-tab-pane label="未分配镜头" name="first" lazy>
        <isNeed
          active="true"
          :scene="sceneNeed"
          :tableLoading="tableLoading"
          :pageSize="pageSize"
          :pageSizeList="pageSizeList"
          :currentPage="currentPage"
          :total="total"
          :pageCount="pageCount"
          @refresh_current="handleCurrentChange"
          @refresh_size="handleSizeChange"
          @refresh="getNeedScene"
        />
      </el-tab-pane>
      <el-tab-pane label="已分配镜头" name="second">
        <isNeed
          :scene="sceneUnneed"
          :tableLoading="tableLoading"
          :pageSize="pageSize2"
          :pageSizeList="pageSizeList2"
          :currentPage="currentPage2"
          :total="total2"
          :pageCount="pageCount2"
          @refresh_current="handleCurrentChange"
          @refresh_size="handleSizeChange"
          @refresh="getNotNeedScene"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { noNeedScene, needScene } from "@/api/assets";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import myMixin from "@/views/projects/components/mixins";
import isNeed from "@/views/team-manager/components/isNeed.vue";
export default {
  mixins: [myMixin, thumbtackMixin],
  name: "team-manager",
  components: { isNeed },
  data() {
    return {
      activeName: "first",
      sceneNeed: [],
      sceneUnneed: [],
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      currentPage2: 1,
      pageSize2: 20,
      pageSizeList2: [20, 30, 50, 100],
      total: 0,
      total2: 0,
      pageCount: 0,
      pageCount2: 0,
      tableLoading: false //表格加载状态
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal == "first") {
          this.getNeedScene();
        } else {
          this.getNotNeedScene();
        }
      }
    }
  },

  methods: {
    //未分配镜头
    getNeedScene(item) {
      this.sceneNeed = [];
      let payload = {}
      if(item){
        payload={...item}
      }else{
        payload={
        tag: 0,
        pagenum: this.pageSize,
        page: this.currentPage
      };
      }
      
      this.tableLoading = true;
      needScene(payload).then(({ data }) => {
        this.sceneNeed = [...data.msg];
        this.total = data.count;
        this.pageCount = data.page_count;
        this.tableLoading = false;
      });
    },
    //已分配镜头
    getNotNeedScene(item) {
      this.sceneUnneed = [];
      let payload = {}
      if(item){
        payload={...item}
      }else{
        payload={
        tag: 0,
        pagenum: this.pageSize2,
        page: this.currentPage2
      };
      }
      this.tableLoading = true;
      noNeedScene(payload).then(({ data }) => {
        this.sceneUnneed = [...data.msg];
        this.total2 = data.count;
        this.pageCount2 = data.page_count;
        this.tableLoading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      if (this.activeName == "first") {
        this.pageSize = val;
        this.getNeedScene();
      } else {
        this.pageSize2 = val;
        this.getNotNeedScene();
      }
    },
    handleCurrentChange(currentPage) {
      if (this.activeName == "first") {
        this.currentPage = currentPage;
        this.getNeedScene();
      } else {
        this.currentPage2 = currentPage;
        this.getNotNeedScene();
      }
    }
  },
  created() {
    this.getNeedScene();
  }
};
</script>
<style lang='scss'>
#team-manager {
  min-height: calc(100vh - 199px);
}
.links {
  cursor: pointer;
  color: #2d8cf0;
}
</style>