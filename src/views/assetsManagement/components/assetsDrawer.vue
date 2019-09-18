<template>
  <div id="assets-drawer">
    <div class="page-right">
      <div id="videoTabs" class="video-tabs">
        <!-- 侧栏展示Tab页 -->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="制作环节" name="first">
            <links
              :link-list="LinkList"
              :project="project"
              :LinkList="LinkList"
              @refresh="getLinkList"
              @refresh_assetList="getAssetList"
            ></links>
          </el-tab-pane>
          <el-tab-pane label="评论" name="second">
            <remarks :project="project" :RemarksData="RemarksData" />
          </el-tab-pane>
          <el-tab-pane label="相关任务" name="third">
            <el-table
              ref="assetTable"
              :data="assetTaskList"
              style="width: 100%"
              border
              :stripe="true"
              :row-style="{'font-size':'13px'}"
              :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
              highlight-current-row
              row-class-name="hover"
            >
              <el-table-column label="任务ID" prop="id" align="left"></el-table-column>
              <el-table-column label="名称" prop="name" align="left"></el-table-column>
              <el-table-column
                label="制作环节"
                prop="link_dept_name"
                align="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="制作内容" prop="content" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" align="left" width="90px">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="开始时间" align="left" width="90px">
                <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="结束时间" align="left" width="90px">
                <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-tooltip content="打开任务" placement="top">
                    <el-button
                      @click="openTaskDetail(scope.row)"
                      icon="el-icon-top-right"
                      type="text"
                      style="color:blue"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="相关版本" name="fifth">
            <el-table
              :data="assetVersion"
              style="width: 100%"
              border
              :stripe="true"
              :row-style="{'font-size':'13px'}"
              :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
              highlight-current-row
              row-class-name="hover"
            >
            <el-table-column prop="current_version" label="版本号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="path" label="审核路径"></el-table-column>
              <el-table-column prop="date" label="更新时间">
                <template slot-scope="scope">
                  {{scope.row.date|dateTimeFormat}}
                </template>
              </el-table-column>
              
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="审批记录" name="sixth">
            <approve-log ref="approvelogs" />
          </el-tab-pane>
          <el-tab-pane label="信息" name="seventh">
            <info :project="project" @refresh_assetList="getAssetList" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import remarks from "@/components/projectDrawer/components/remarks";
import info from "@/components/projectDrawer/components/info";
import links from "@/views/projects/components/links";
import { addLinks, getLinks } from "@/api/links";
import { getVersion } from "@/api/assets";
import { getAssetTaskList } from "@/api/task";
import approveLog from "@/views/video/components/approve-log";
export default {
  name: "assets-drawer",
  props: ["project", "RemarksData"],
  data() {
    return {
      activeTab: "first",
      LinkList: [],
      assetVersion: null,
      assetTaskList: null
    };
  },
  watch: {
    project: {
      handler: function(newVal, oldVal) {
        if (newVal ) {
          this.getAssetVersion();
          this.getAssetApproveLog();
        }
      }
    }
  },
  components: { remarks, info, links,approveLog },
  methods: {
    getAssetList() {
      this.$emit("refresh_assetList");
    },
    getLinkList(id) {
      let asset = id || this.project.id;
      getLinks({
        asset
      }).then(res => {
        this.LinkList = [...res.data.msg];
      });
    },
    getAssetVersion(id) {
      getVersion({
        asset_id: this.project.id
      }).then(({ data }) => {
        this.assetVersion = [...data.msg];
      });
    },
    getAssetApproveLog(){
      this.$refs["approvelogs"].getAssetAppooveList(this.project.id);
    },
    getAssetTask(id) {
      getAssetTaskList({
        asset_id: id
      }).then(({ data }) => {
        this.assetTaskList = [...data.msg];
      });
    },
    openTaskDetail(row) {
      const path = "/projects/project-detail/" + row.project.id + "/?tab=tab2";
      //console.log(path);
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-right {
  height: 100%;

  // margin-left: 0.5%;
  .dropdow {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 3;
  }
}
.color {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  position: absolute;
  z-index: 2;
  right: 15px;
  top: 140px;
}
#videoTabs {
  width: 500px;
}
.video-info {
  padding: 10px;
  height: 165px;
  margin-bottom: 10px;
  background: #fff;
}
.video-tabs {
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  min-height: 10%;
  max-height: 68%;
  overflow: auto;
}
.video-comment {
  padding: 10px;
  background: #fff;
  height: 65%;
  overflow: auto;
}
.video-info,
.video-tabs,
.video-comment {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
    cursor: pointer;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
