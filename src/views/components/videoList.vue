<template>
  <div class="video-cont">
    <!-- <ul id="videoSliderList">
      <li v-for="(item,index) in selectProjects" :key="index" @click="initSource(index)">
        <span class="color-slider" :class="index%2==0?'on':''">
          {{item.asset.name}} {{item.time}}
          <font v-if="currentPlayId==item.asset.id">正在播放</font>
        </span>
      </li>
    </ul>-->
    <div id="videoSliderList">
      <el-button
        v-for="(item,index) in selectProjects"
        :key="index"
        :type="currentPlayId==index?'success':''"
        @click="initSource(index),getCurrentPlayId(index)"
        icon="el-icon-video-play"
        style="margin: 10px 2%;"
      >{{item.asset.name}}</el-button>
    </div>
    <!-- 
    el-icon-video-play-->
    <!-- <el-button type="primary" style="margin:10px 0 0 10px;" @click="addVideoList">加入播放队列{{selectProjectIds}}</el-button> -->
    <el-checkbox-group v-model="selectProjectIds">
      <div class="list">
        <div class="item" v-for="(item,index) in projectList" :key="index">
          <el-checkbox :label="index" :key="index" @change="changeCheckedProject($event,item)">
            <p class="pro-name">{{item.asset.name}}</p>
          </el-checkbox>
          <div style="margin-top:5px">
            <el-image :src="item.asset.image?$store.state.BASE_URL+item.asset.image:''" fit="cover">
              <div
                slot="error"
                style="height: 100%;display: flex;justify-content: center;align-items: center;font-size: 56px;background: #dcdfe6;"
              >
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
          </div>
          <div>当前版本：{{item.asset.inner_version}}</div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: "VideoList",
  data() {
    return {
      projectList: [],
      selectProjectIds: [],
      selectProjects: [],
      currentPlayId: -1
    };
  },
  created() {
    this.initInfo();
  },
  methods: {
    initInfo() {
      this.projectList = [...this.$store.state.video.Selection];
      //读取AJAX获取数据
    },
    getCurrentPlayId(id) {
      this.currentPlayId = id;
    },
    initSource(index) {
      let selectProject = this.selectProjects[index];
      this.currentPlayId = selectProject.asset.asset;
      let projectList =[];
      projectList[0] = selectProject;
      if (index + 1 != this.selectProjects.length) {
        projectList[1] = this.selectProjects[index + 1];
      } else {
        projectList[1] = null;
      }
      this.$emit("initSource", projectList, index, this.selectProjects);
    },
    /**
     * 卡片选中状态切换 ，更新展示的播放列表
     * @param {Boolean} e 点击卡片的多选按钮返回的状态表示是否选中
     * @param {Object} item 点击卡片多选按钮时返回的资产对象
     */
    changeCheckedProject(e, item) {
       if (e && item.asset.path) {
        item = {
        ...item,
        url:`${this.$store.state.BASE_URL}${item.asset.path}`,
        videoImage:`${this.$store.state.BASE_URL}${item.asset.image}`
      };
        this.selectProjects.push(item);
      } else if(e && !item.asset.path){
        e=false
        this.$message.warning('镜头路径为空')
      }else{
        this.selectProjects = this.selectProjects.filter(t => {
          return t.asset.asset !== item.asset.asset;
        });
      }
    },
    addVideoList() {}
  }
};
</script>
<style lang="scss" scoped>
#videoSliderList {
  display: block;
  white-space: nowrap;
  width: 100%;
  height: 50px;
  overflow: auto;
  /* li {
    width: 20%;
    display: inline-block;
    margin: 10px 2%;
    .color-slider {
      display: block;
      width: 100%;
      height: 25px;
      background: red;
      cursor: pointer;
      text-align: center;
      color: #fff;
      line-height: 25px;
    }
    .on {
      background: #67c23a;
    }
  } */
}
.video-cont {
  width: 100%;
  height: 100%;
  .list {
    list-style: none;
    padding: 10px;
    margin: 0; 
    overflow: hidden;
    height: 100%;
    height: calc(100% - 90px);
    display: flex;
    .item {
      width: 19%;
      border: 1px dotted #ddd;
      margin: 0 0.5%;
      background: #fff;
      padding: 10px;
      .el-image {
        width: 100%;
        height: 90px;
      }
    }
  }
}
</style>
