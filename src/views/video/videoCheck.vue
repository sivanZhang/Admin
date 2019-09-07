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
          <video-list ref="videoList" @initSource="initSource"></video-list>
        </div>
      </el-col>
      <el-col :span="9" class="page-right">
        <div id="videoInfo" class="video-info">
          <!-- 视频基本信息 -->
        </div>
        <div id="videoTabs" class="video-tabs">
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

              <div class="btn-group">
                <el-radio-group v-model.number="approve_result">
                  <el-radio :label="0">拒绝</el-radio>
                  <el-radio :label="1">同意</el-radio>
                </el-radio-group>
                <div class="fr">
                  <!-- <el-button class="btn cancel-btn">取消</el-button> -->
                  <el-button type="primary" class="btn add-btn" @click="commitApprove">提交</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="videoComment" class="video-comment">
          <!-- 视频标注列表 -->
          <approve-log
            ref="approvelogs" 

          />
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
import VideoComment from "@/views/components/videoComment";
import demoImg from "@/assets/demo.jpg";
import { mapState } from "vuex";
import { postApprove } from "@/api/video";
import AXIOS from "@/utils/request";
import approveLog from "./components/approve-log";
export default {
  components: { VideoPlayer, VideoList, ZoomImg, VideoComment,approveLog },
  data() {
    return {
      approve_result: 0,
      imgList: [], //  视频截图列表
      zoomImgUrl: "",
      activeTab: "first",
      demoImg: demoImg,
      markText: "",
      currentVideoIsEdit: false,
      pWidth: 0,
      pHeight: 0,
      submitList: [],
      taskId:null
      
    };
  },
  computed: {
    ...mapState("video", ["Selection"])
  },
  created() {},
  mounted() {
    let bH = document.body.offsetHeight;
    let videoInfoH = document.getElementById("videoInfo").offsetHeight;
    let videoTabsH = document.getElementById("videoTabs").offsetHeight;
    let videoPlayer = document.getElementsByClassName("video-player");
    this.pHeight = videoPlayer[0].offsetHeight;
    this.pWidth = videoPlayer[0].offsetWidth;
    document.getElementById("videoComment").style.height =
      bH - (videoInfoH + videoTabsH + 20 + 20 + 94) + "px";
  },
  methods: {
    commitApprove() {
      if (!this.submitList.length) {
        this.$message.warning("请选择镜头");
        return false;
      } else if (!this.markText) {
        this.$message.warning("请添加备注");
        return false;
      }
      let submitFn = [];
      this.submitList.forEach((t, i, arr) => {
        let data = {
          task_id: t.task.id,
          approve_result: this.approve_result,
          suggestion: this.markText,
          key: []
        };
        this.imgList.forEach(k => {
          if (k.task=== t.task.asset) {
            data["key"].push({
              image: k.imgUrl,
              frame: k.currentFrame
            });
          }
        });
        postApprove(data).then(res => {
          this.$message.success(t.task.name + " " + res.data.msg);
          if (res.data.status == 0 || i === this.submitList.length) {
            {
              this.imgList = [];
              this.approve_result = "";
              this.markText = "";
              this.$refs['approvelogs'].getApproveLog(this.taskId);
            }
          }
        })
      });
    },
    //点击播放列表回传  projectLists播放列表   index 当前点击的item 下标
    initSource(projectList, index, projectLists) {
      this.taskId = projectList[0].task.id;
      this.$refs['approvelogs'].getApproveLog(projectList[0].task.id)
      this.submitList = [...projectLists];
      if (this.currentVideoIsEdit) {
        this.$message.error("处于视频标注模式");
      } else {
        this.$refs.videoPlayer.initVideoUrl(
          projectList[0],
          this.pWidth,
          this.pHeight
        );
        this.$refs.videoPlayer.initNextVideo(index, projectList);
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
      this.imgList.splice(index, 1);
      let bH = document.body.offsetHeight;
      let videoInfoH = document.getElementById("videoInfo").offsetHeight;
      let videoTabsH = document.getElementById("videoTabs").offsetHeight;
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
    showImage(url) {
      if (url){
        this.$refs.zoomImg.zoomImg(this.$store.state.BASE_URL+url);
      }
    },
    zoomImg(imgUrl) {
      this.$refs.zoomImg.zoomImg(imgUrl);
    },
    handleTabClick(tab, event) {
      // console.log(tab, event);
    },
    //传递 获取视频是否属于编辑中
    getCurrentVideoMode(mode) {
      this.currentVideoIsEdit = !mode;
      // console.log("currentVideoIsEdit", this.currentVideoIsEdit);
    },
    getCurrentPlayId(resAsset) {
      // console.log("resAsset", resAsset);
      /* this.$refs.videoList.getCurrentPlayId(id); */
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
        min-height: 50%;
        max-height: 100%;
        overflow: auto;
      }
      .video-comment {
        padding: 10px;
        background: #fff;
        height: 100%;
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