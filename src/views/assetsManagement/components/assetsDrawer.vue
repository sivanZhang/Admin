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
          <el-tab-pane label="备注" name="second">
            <remarks :project="project" :RemarksData="RemarksData" />
          </el-tab-pane>
          <el-tab-pane label="链接" name="third"></el-tab-pane>
          <el-tab-pane label="相关版本" name="fifth"></el-tab-pane>
          <el-tab-pane label="信息" name="sixth">
            <info :project="project" />
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

import { constants } from "crypto";
export default {
  name: "assets-drawer",
  props: ["project", "RemarksData"],
  data() {
    return {
      activeTab: "first",
      LinkList: []
    };
  },components: { remarks, info, links },
  methods: {
    getAssetList() {
      this.$emit("refresh_assetList");
    },
    getLinkList(id) {
      let asset = id ||this.project.id
      getLinks({
        asset
      }).then(res => {
        this.LinkList = [...res.data.msg];
      });
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
