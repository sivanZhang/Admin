<template>
    <div id="videoCheck">
        <el-row class="page">
            <el-col :span="15" class="page-left">
                <div class="video-player">
                    <!-- 播放器 -->
                    <video-player  ref='videoPlayer'   @getCutImg="getMarkImage" @getCurrentVideoMode="getCurrentVideoMode"/>
                </div>
                <div class="video-list">
                    <!-- 视频项目列表 -->
                    <el-button @click="initSource(index)" v-for="(item,index) in projectList" :key="index">加载{{item.id}}</el-button>
                     
                </div>
            </el-col>
            <el-col :span="9" class="page-right">
                <div ref="videoInfo" class="video-info">
                    <!-- 视频基本信息 -->
                    <video-info ref="videoInfo1"></video-info>
                    
                </div>
                <div ref="videoTabs" class="video-tabs">
                    <!-- 视频tab页（Notes、Versions） -->
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="备注" name="first">
                            <div class="mark-cont">
                                <div class="mark-text"><input class="mark-input" placeholder="添加备注..." v-model="markText"/></div>
                                <div class="mark-form" v-if="imgList.length > 0">
                                    <ul class="img-list">
                                        <li class="img-item" v-for="(item,index) in imgList" :key="index">
                                            <img :src="item.imgUrl" @click="zoomImg(item.imgUrl)"/>
                                            <span class="name">farame_0712.jpg</span>
                                            <el-button class="btn del-btn" icon="el-icon-delete-solid" @click="delMarkImage(item,index)"></el-button>
                                        </li>
                                    </ul>
                                    <div class="btn-group">
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
                <div ref="videoComment" class="video-comment">
                    <!-- 视频标注列表 -->
                    <video-comment ref="videoComment1"></video-comment>
                    
                </div>
            </el-col>
        </el-row>
        <zoom-img ref="zoomImg"/>
     </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import kscreenshot from 'kscreenshot'
import ZoomImg from '@/components/ZoomImg'
import VideoInfo from '@/views/components/videoInfo'
import VideoComment from '@/views/components/videoComment'

import demoImg from '@/assets/demo.jpg'
export default {
    components: {VideoPlayer,ZoomImg,VideoInfo,VideoComment},
    data () {
      return {
          projectList:[{
              id:1,
              url:'http://localhost:8080/test/banner01.mp4'
          },{
              id:2,
              url:'http://localhost:8080/test/banner02.mp4'
          }],
          imgList:[],
          zoomImgUrl:"",
          activeTab: 'first',
          demoImg:demoImg,
          markText:"",
          currentVideoIsEdit:false
          
      }
    },
    created() {

    },
    mounted (){
        let bH = document.body.offsetHeight;
        let videoInfoH = this.$refs.videoInfo.offsetHeight;
        let videoTabsH = this.$refs.videoTabs.offsetHeight;
        this.$refs.videoComment.style.height = (bH - (videoInfoH + videoTabsH + 60)) + "px";
        // 注：window.onresize只能在项目内触发1次
        window.onresize = function windowResize () {
            // 通过捕获系统的onresize事件触发我们需要执行的事件
            let bH = document.body.offsetHeight;
            let videoInfoH = this.$refs.videoInfo.offsetHeight;
            let videoTabsH = this.$refs.videoTabs.offsetHeight;
            this.$refs.videoComment.style.height = (bH - (videoInfoH + videoTabsH + 60)) + "px";
        }
    },
    methods:{
        initSource(index){
            if( this.currentVideoIsEdit){
                this.$message.error('处于视频标注模式');
            }else{
            console.log(index);
            let selectData=this.projectList[index];
            //initVideoUrl
            this.$refs.videoPlayer.initVideoUrl(selectData.url)
            this.$refs.videoInfo1.initInfo(selectData.id)
            this.$refs.videoComment1.initInfo(selectData.id)
            }
           
        },
       getMarkImage(obj){
           this.imgList.push(obj);
           console.log(this.imgList);
           let bH = document.body.offsetHeight;
           let videoInfoH = this.$refs.videoInfo.offsetHeight;
           let videoTabsH = this.$refs.videoTabs.offsetHeight;
           if(bH - (videoInfoH + videoTabsH + 60 + 53) <= 0){
               this.$refs.videoComment.style.height = 0 + "px;"
           }else{
                this.$refs.videoComment.style.height = (bH - (videoInfoH + videoTabsH + 60 + 53)) + "px";
           }
           
       },
       delMarkImage(data,index){
           console.log(index);
           this.imgList.splice(index, 1);
           let bH = document.body.offsetHeight;
           let videoInfoH = this.$refs.videoInfo.offsetHeight;
           let videoTabsH = this.$refs.videoTabs.offsetHeight;
           if(bH - (videoInfoH + videoTabsH + 57 + 53 - 62) <= 0){
               this.$refs.videoComment.style.height = 0 + "px;"
           }else{
                this.$refs.videoComment.style.height = (bH - (videoInfoH + videoTabsH + 57 + 53 - 62)) + "px";
           }
       },
       zoomImg(imgUrl){
           this.$refs.zoomImg.zoomImg(imgUrl);
       },
       handleTabClick(tab, event) {
        console.log(tab, event);
      },
      getCurrentVideoMode(mode){
          this.currentVideoIsEdit=!mode;
          console.log("11111111111adsqd",mode)
      }

    }
}
</script>

<style lang="scss" scoped>
    #videoCheck{
        width:100%;
        height:100%;
        background-color:#fff;
        overflow-y: hidden;
        .page{
            width:100%;
            height:100%;
            min-width: 1500px;
            background-color: #eeeeee;
            .page-left{
                height:100%;
                width:62%;
                margin-right:0.5%;
                .video-player{
                    width: 100%;
                    height:70%;
                    background:#fff;
                }
                .video-list{
                    width: 100%;
                    height:28.6%;
                    margin-top: 1%;
                    background: #fff;
                }
            }
            .page-right{
                height:100%;
                // margin-left: 0.5%;
                .video-info{
                    padding: 10px;
                    height: 165px;
                    margin-bottom: 10px;
                    background: #fff;
                }
                .video-tabs{
                    padding: 10px;
                    background: #fff;
                    margin-bottom: 10px;
                    min-height: 10%;
                    max-height: 68%;
                    overflow: auto;
                }
                .video-comment{
                    padding: 10px;
                    background: #fff;
                    height: 65%;
                    overflow: auto;
                }
                .video-info,.video-tabs,.video-comment{
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
    .mark-list{
        width: 100%;
        height: 100%;
        padding: 0 10px;
        margin: 0;
        list-style: none;
        .item{
            float:left;
            width: 100px;
            height: 100px;
            margin-right: 12px;
            margin: 12px 12px 12px 0;
            img{
                width: 100%;
                height:100%;
            }
        }
    }
   
    .mark-cont{
        width: 100%;
        .mark-text{
            .mark-input{
                border:none;
                outline: none;
                width: 100%;
                display: block;
                line-height: 35px;
                border-bottom: 1px solid #ddd;
            }
        }
        .mark-form{
            .img-list{
                list-style: none;
                padding:0;
                margin: 0;
                .img-item{
                    margin: 6px 0;
                    height: 62px;
                    line-height: 50px;
                    background: #eee;
                    padding: 6px;
                    img{
                        float: left;
                        width: 85px;
                        height:50px;
                    }
                    .name{
                        float: left;
                        padding-left: 10px;
                    }
                    .del-btn{
                        float: right;
                        background: transparent;
                        border: none;
                        padding: 0;
                        height: 50px;
                        font-size: 26px;
                        color:#F56C6C;
                    }
                }
            }
            .btn-group{
                overflow: hidden;
                .fr{
                    float: right;
                }
                .btn{
                    padding: 6px 10px;
                    font-size: 12px;
                }
            }
        }
    }
    
</style>
