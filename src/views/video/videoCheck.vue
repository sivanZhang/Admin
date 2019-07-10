<template>
    <div id="videoCheck">
        <el-row class="page">
            <el-col :span="15" class="page-left">
                <div class="video-player">
                    <!-- 播放器 -->
                    <video-player :url="url" @getCutImg="getCutImg"/>
                </div>
                <div class="video-list">
                    <!-- 视频项目列表 -->
                    <ul class="mark-list">
                        <li class="item" v-for="(item,index) in imgList" :key="index">
                            <img :src="item.imgUrl" @click="zoomImg(item.imgUrl)"/>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="9" class="page-right">
                <div class="video-info">
                    <!-- 视频基本信息 -->
                    <div>
                        <img src=""/>
                    </div>
                    <div>
                        <p>版本链接：www.baidu.com</p>
                        <p>版本：初始版本</p>
                        <p>状态：最新</p>
                        <p>资产类型：上传视频</p>
                        <p>发布者：JSon</p>
                        <p>已发布：7小时前</p>
                    </div>
                </div>
                <div class="video-tabs">
                    <!-- 视频tab页（Notes、Versions） -->
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane label="标注" name="first">标注</el-tab-pane>
                        <el-tab-pane label="版本" name="second">版本</el-tab-pane>
                    </el-tabs>
                </div>
                <div class="video-comment">
                    <!-- 视频标注列表 -->
                    <ul>
                        <li>
                            <div></div>
                            <div>
                                <p><span>JSon.li</span><span>7小时前</span></p>
                                <p>标注正确，还不错！</p>
                                <p>
                                    <img/>
                                    <span>新项目/初始版本</span>
                                </p>
                            </div>
                        </li>
                    </ul>

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
export default {
    components: {VideoPlayer,ZoomImg},
    data () {
      return {
          url:"http://localhost:8080/banner01.mp4",
          imgList:[],
          zoomImgUrl:"",
          activeTab: 'first'
      }
    },
    created() {

    },
    mounted (){

    },
    methods:{
       getCutImg(obj){
           this.imgList.push(obj);
           console.log(this.imgList);
       },
       zoomImg(imgUrl){
           this.$refs.zoomImg.zoomImg(imgUrl);
       },
       handleTabClick(tab, event) {
        console.log(tab, event);
      }

    }
}
</script>

<style lang="scss" scoped>
    #videoCheck{
        width:100%;
        height:100%;
        background-color:#fff;
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
                    padding: 0 10px;
                    height: 30%;
                    margin-bottom: 10px;
                    background: #fff;
                }
                .video-tabs{
                    padding: 0 10px;
                    background: #fff;
                    max-height: 30%;
                    margin-bottom: 10px;
                    min-height: 10%;
                }
                .video-comment{
                    padding: 0 10px;
                    min-height: 40%;
                    background: #fff;
                    max-height: 60%;
                    height: 57%;
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
</style>
