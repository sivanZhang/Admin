<template>
  <div id="project-drawer">
      <el-col class="page-right">
        <div id="videoInfo" class="video-info">
          <!-- 视频基本信息 -->
          <video-info ref="videoInfo"></video-info>
        </div>
        <div id="videoTabs" class="video-tabs">
          <!-- 视频tab页（Notes、Versions） -->
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="备注" name="first">
              <div class="mark-cont">
                <div class="mark-form">
                  <ul class="img-list" v-if="imgList.length > 0">
                    <li class="img-item" v-for="(item,index) in imgList" :key="index">
                      <img :src="item.imgUrl" @click="zoomImg(item.imgUrl)"/>
                      <span class="name">farame_0712.jpg</span>
                      <el-button class="btn del-btn" icon="el-icon-delete-solid"
                                 @click="delMarkImage(item,index)"></el-button>
                    </li>
                  </ul>
                  <div class="mark-text"><input class="mark-input" placeholder="添加备注..." v-model="markText"/></div>
                  <div class="btn-group" v-if="imgList.length > 0">
                    <div class="fr">
                      <el-button class="btn cancel-btn">取消</el-button>
                      <el-button type="primary" class="btn add-btn">添加</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="任务" name="second">任务</el-tab-pane>
            <el-tab-pane label="版本" name="third">版本</el-tab-pane>
            <el-tab-pane label="链接" name="fourth">链接</el-tab-pane>
            <el-tab-pane label="动态" name="fifth">动态</el-tab-pane>
            <el-tab-pane label="信息" name="sixth">信息</el-tab-pane>
          </el-tabs>
        </div>
        <div id="videoComment" class="video-comment">
          <!-- 视频标注列表 -->
          <video-comment ref="videoComment"></video-comment>

        </div>
      </el-col>
  </div>
</template>

<script>
import VideoInfo from '@/views/components/videoInfo'
export default {
  components: {VideoInfo },
  data(){
    return{
      imgList: [],
    }
  },
  name: "projectDrawer",
  props: ["projectId"],
  methods:{
    handleTabClick(tab, event) {
        console.log(tab, event)
      },
  }
};
</script>

<style lang="scss" scoped>
.page-right {
  height: 100%;
  // margin-left: 0.5%;
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
}
</style>

