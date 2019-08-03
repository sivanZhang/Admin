<template>
  <div id="header">
    <!-- 项目头部展示 -->
    <template v-if="project.entity_type === 4">
      <div style="height:170px">
        <div class="header-first">
          <el-col :span="3">
            <div class="color" :style="{backgroundColor:project.color||'transparent'}"></div>
          </el-col>
          <el-col :span="21">
            <el-row>
              <span class="project-name">
                <router-link :to="`/projects/project-detail/${project.id}`">{{project.name}}</router-link>
              </span>
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
              <el-col :span="6" class="project-name">项目状态</el-col>
              <el-col :span="18" class="project-name">{{project.status|projectStatus}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">项目编码</el-col>
              <el-col :span="18" class="project-comment">{{project.code}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">开始日期</el-col>
              <el-col :span="18" class="project-comment">{{project.date_start |dateFormat}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">截止日期</el-col>
              <el-col :span="18" class="project-comment">{{project.date_end |dateFormat}}</el-col>
            </el-row>
          </el-col>
        </div>
      </div>
    </template>
    <!-- 资产的头部展示 -->
    <template v-if="project.entity_type === 5">
      <div style="height:170px">
        <div class="header-first">
          <el-col :span="3">
            <svg-icon icon-class="asset" style="width:40px;height:40px"></svg-icon>
          </el-col>
          <el-col :span="21">
            <el-row>
              <span class="project-name">{{project.name}}</span>
            </el-row>
            <el-row>
              <div class="project-type">{{'资产'}}</div>
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
              <el-col :span="6" class="project-name">资产类型</el-col>
              <el-col :span="18" class="project-name">{{project.category>0?project.category:"未分类"}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">创建人</el-col>
              <el-col :span="18" class="project-comment">{{project.creator_name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">优先级</el-col>
              <el-col :span="18" class="project-comment">{{project.priority |Priority}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">难度等级</el-col>
              <el-col :span="18" class="project-comment">{{project.level |Level}}</el-col>
            </el-row>
          </el-col>
        </div>
      </div>
    </template>
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
    border-bottom: 1px solid rgb(221, 221, 221);
    display: flex-wrap;
    justify-content: flex-start;
    font-size: 16px !important;
    font-weight: 300 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 10px;
    .project-name {
      font-size: 16px !important;
      font-weight: 300 !important;

      :hover {
        color: rgba(59, 59, 211, 0.849);
      }
    }
    .project-type {
      font-size: 12px;
      color: #a9abae;
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
  .project-name {
    margin: 30px 0px 0px 0px;
    font-size: 12px;
    font-weight: 400;
  }
  .project-comment {
    margin: 10px 0px 0px 0px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
