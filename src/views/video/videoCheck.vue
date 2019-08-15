<template>
  <div id="videoCheck">
    <el-row class="page">
      <el-col :span="15" class="page-left" style="height:850px;">
        <div class="video-player" style="height：550px;">
          <!-- 播放器 -->
          <video-player
            ref="videoPlayer"
            @getCutImg="getMarkImage"
            @getCurrentVideoMode="getCurrentVideoMode"
            @getCurrentPlayId="getCurrentPlayId"
          />
        </div>
        <div class="video-list">
          <!-- 视频列表 -->
          <video-list :list="Selection" ref="videoList" @initSource="initSource"></video-list>
        </div>
      </el-col>
      <el-col :span="9" class="page-right">
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
                      <img :src="item.imgUrl" @click="zoomImg(item.imgUrl)" />
                      <span class="name">{{item.currentName}}(第{{item.currentFrame}}帧)</span>
                      <el-button
                        class="btn del-btn"
                        icon="el-icon-delete-solid"
                        @click="delMarkImage(item,index)"
                      ></el-button>
                    </li>
                  </ul>
                  <div class="mark-text">
                    <input class="mark-input" placeholder="添加备注..." v-model="markText" />
                  </div>

                  <div class="btn-group" v-if="imgList.length > 0">
                    <el-radio-group v-model="approve_result">
                      <el-radio :label="0">拒绝</el-radio>
                      <el-radio :label="1">同意</el-radio>
                    </el-radio-group>
                    <div class="fr">
                      <el-button class="btn cancel-btn">取消</el-button>
                      <el-button type="primary" class="btn add-btn" @click="commitApprove">提交</el-button>
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
    </el-row>
    <zoom-img ref="zoomImg" />
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer";
import VideoList from "@/views/components/videoList";
import kscreenshot from "kscreenshot";
import ZoomImg from "@/components/ZoomImg";
import VideoInfo from "@/views/components/videoInfo";
import VideoComment from "@/views/components/videoComment";
import demoImg from "@/assets/demo.jpg";
import { mapState } from "vuex";
import { postApprove } from "@/api/video";
export default {
  components: { VideoPlayer, VideoList, ZoomImg, VideoInfo, VideoComment },
  data() {
    return {
      Active:{},
      approve_result: 0,
      imgList: [],
      zoomImgUrl: "",
      activeTab: "first",
      demoImg: demoImg,
      markText: "",
      currentVideoIsEdit: false,
      pWidth: 0,
      pHeight: 0
    };
  },
  computed: {
    ...mapState("video", ["Selection"])
  },
  created() {
    console.log('Selection:',this.Selection);
    
  },
  mounted() {
    let bH = document.body.offsetHeight;
    let videoInfoH = document.getElementById("videoInfo").offsetHeight;
    let videoTabsH = document.getElementById("videoTabs").offsetHeight;

    let videoPlayer = document.getElementsByClassName("video-player");
    this.pHeight = videoPlayer[0].offsetHeight;
    this.pWidth = videoPlayer[0].offsetWidth;
    console.log(this.pWidth + ";" + this.pHeight);

    document.getElementById("videoComment").style.height =
      bH - (videoInfoH + videoTabsH + 20 + 20 + 94) + "px";
  },
  methods: {
    commitApprove() {
      /* const data = {
        asset_id:this.Active.asset.id,
        project_id:this.Active.asset.project,
        link_id:this.Active.asset.id,
        approve_result:this.approve_result,
        suggestion:this.markText
      } */
      console.log(this.Active.asset);
      
      /* postApprove(data).then(res=>{
        this.$message(res.data.msg)
        if(res.data.status === 0 ){
          this.imgList = []
        }
      }) */
    },
    initSource(projectList,index,projectLists) {
        if (this.currentVideoIsEdit) {
          this.$message.error('处于视频标注模式')
        } else {
          console.log('点击传回',[...arguments])
          this.$refs.videoPlayer.initVideoUrl(projectList[0],this.pWidth,this.pHeight);
          this.$refs.videoPlayer.initNextVideo(index,projectLists)
          this.$refs.videoInfo.initInfo(projectList[0].id)
          this.$refs.videoComment.initInfo(projectList[0].id)
        }
      },

    getMarkImage(obj) {
      this.imgList.push(obj);
      let bH = document.body.offsetHeight;
      let videoInfoH = document.getElementById("videoInfo").offsetHeight;
      let videoTabsH = document.getElementById("videoTabs").offsetHeight;
      if (bH - (videoInfoH + videoTabsH + 20 + 20 + 53) <= 0) {
        document.getElementById("videoComment").style.height = 0 + "px;";
      } else {
        document.getElementById("videoComment").style.height =
          bH - (videoInfoH + videoTabsH + 20 + 20 + 53) + "px";
      }
    },
    delMarkImage(data, index) {
      console.log(index);
      this.imgList.splice(index, 1);
      let bH = document.body.offsetHeight;
      let videoInfoH = document.getElementById("videoInfo").offsetHeight;
      let videoTabsH = document.getElementById("videoTabs").offsetHeight;
      console.log(videoTabsH);
      if (this.imgList.length > 0) {
        if (bH - (videoInfoH + videoTabsH + 20 + 20 - 82) <= 0) {
          document.getElementById("videoComment").style.height = 0 + "px;";
        } else {
          document.getElementById("videoComment").style.height =
            bH - (videoInfoH + videoTabsH + 20 + 20 - 82) + "px";
        }
      } else {
        if (bH - (videoInfoH + videoTabsH + 20 + 20 - 110) <= 0) {
          document.getElementById("videoComment").style.height = 0 + "px;";
        } else {
          document.getElementById("videoComment").style.height =
            bH - (videoInfoH + videoTabsH + 20 + 20 - 110) + "px";
        }
      }
    },
    zoomImg(imgUrl) {
      this.$refs.zoomImg.zoomImg(imgUrl);
    },
    handleTabClick(tab, event) {
      console.log(tab, event);
    },
    getCurrentVideoMode(mode) {
      this.currentVideoIsEdit = !mode;
      console.log("currentVideoIsEdit", this.currentVideoIsEdit);
    },
    getCurrentPlayId(id) {
      console.log(id);
      this.$refs.videoList.getCurrentPlayId(id);
    }
  }
};
</script>

<style lang="scss" scoped>
#videoCheck {
  width: 100%;
  height: 100%;
  background-color: #eee;
  .page {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    overflow-y: hidden;
    background-color: #eeeeee;
    .page-left {
      height: 100%;
      width: 62%;
      margin-right: 0.5%;
      .video-player {
        width: 100%;
        height: 65%;
        background: #fff;
      }
      .video-list {
        width: 100%;
        height: 33.9%;
        margin-top: 1%;
        background: #fff;
      }
    }
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
  }
}
.mark-list {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  margin: 0;
  list-style: none;

  .item {
    float: left;
    width: 100px;
    height: 100px;
    margin-right: 12px;
    margin: 12px 12px 12px 0;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.mark-cont {
  width: 100%;

  .mark-form {
    .mark-text {
      .mark-input {
        border: none;
        outline: none;
        width: 100%;
        display: block;
        line-height: 35px;
        border-bottom: 1px solid #ddd;
      }
    }
    .img-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .img-item {
        margin: 6px 0;
        height: 62px;
        line-height: 50px;
        background: #eee;
        padding: 6px;

        img {
          float: left;
          width: 85px;
          height: 50px;
        }

        .name {
          float: left;
          padding-left: 10px;
        }

        .del-btn {
          float: right;
          background: transparent;
          border: none;
          padding: 0;
          height: 50px;
          font-size: 26px;
          color: #f56c6c;
        }
      }
    }

    .btn-group {
      margin-top: 10px;
      overflow: hidden;

      .fr {
        float: right;
      }

      .btn {
        padding: 6px 10px;
        font-size: 12px;
      }
    }
  }
}
</style>