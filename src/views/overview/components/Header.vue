<template>
  <div id="header">
    <div style="height:170px">
      <div class="header-first">
        <el-col :span="3">
          <div class="color" :style="{backgroundColor:project.color||'transparent'}"></div>
        </el-col>
        <el-col :span="21">
          <el-row>
            <span class="project-name">{{project.name}}</span>
          </el-row>
          <el-row>
            <div class="project-type">{{'project'}}</div>
          </el-row>
        </el-col>
      </div>
      <div class="header-body">
        <el-col :span="9">
          <el-image
            class="mini-image"
            :src="project.image?$store.state.BASE_URL+project.image:''"
            fit="cover"
            style="width: 150px;height: 100px;float: left;margin-right: 10px"
          ></el-image>
        </el-col>
        <el-col :span="15">
          <el-row>
            <el-col :span="6" style="margin:30px 0px 0px 0px;font-size: 14px;font-weight:400">项目名称</el-col>
            <el-col :span="18" style="margin:30px 0px 0px 0px;font-size: 14px;font-weight:400">{{project.name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" style="margin:10px 0px 0px 0px;font-size: 14px;font-weight:400">项目编码</el-col>
            <el-col :span="18" style="margin:10px 0px 0px 0px;font-size: 14px;font-weight:400">{{project.code}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" style="margin:10px 0px 0px 0px;font-size: 14px;font-weight:400">截止日期</el-col>
            <el-col :span="18" style="margin:10px 0px 0px 0px;font-size: 14px;font-weight:400">{{project.date_end |dateFormat}}</el-col>
          </el-row>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "header",
  props: {
    project: {
      type: Object
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
#header {
  .header-first {
    //height: 60px;
    border-bottom: 1px solid #999999;
    display: flex-wrap;
    justify-content: flex-start;
    padding-left: 10px;
    font-size: 16px !important;
    font-weight: 300 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .project-name {
      font-size: 16px !important;
      font-weight: 300 !important;
    }
    .project-type {
      font-size: 12px;
    }
    .color {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      position: relative;
    }
  }
}
.header-body {
  .mini-image {
    cursor: pointer;
    overflow: hidden;
    opacity: 1;
    margin: 25px 0px 0px 0px;

    &:hover {
      opacity: 0.8;
      transition: all 2s;
    }
  }
}
</style>
