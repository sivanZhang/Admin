<template>
  <div id="playerBox" class="player-box" v-loading="playerLoading"
       :element-loading-text="playerLoadingText"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <image-draw ref="imageDraw" class="img-vision" :style="{display:!videoPlayerIsShow?'block':'none'}" :width="width"
                :height="height" @getDrawImage="getDrawImage" @getEditMode="getEditMode"></image-draw>
    <div id="videoPlayer" :style="{display:videoPlayerIsShow?'block':'none'}">
              <div :style="{display:videoPlayerNoVideoIsShow?'block':'none'}">暂无视频</div>

       <video    
        id="myVideo"
        class="video-js">
        <source
            :src="videoUrl"
            type="video/mp4" >
        </video>
    </div>
   
    <el-row id="playerToolbar" v-if="isLoadVideo">
      <el-col :span="1" class="bar-item">
        <el-button class="btn-item btn-play" title="播放/暂停" :icon="playerControls.stateIcon" @click="playerPlay"></el-button>
      </el-col>
      <el-col :span="18" class="bar-item">
        <span class="text">{{playerFormatCurrentPostion}}</span>
        <div class="slider">
          <el-slider v-model="playerPercentage" :show-tooltip='false' @change="handleSliderChange"></el-slider>
        </div>
        <span class="text">{{playerFormatDuration}}</span>
      </el-col>
      <el-col :span="5" class="bar-item">
        <span style="color:#fff;">音量:{{playerVolume*10}}</span>
        <el-button-group class="btn-group">
          <el-button class="btn-item" title="音量调小" @click="changeVolume('sub')"><img :src="iconLower"/></el-button>
          <el-button class="btn-item" title="音量调大" @click="changeVolume('add')"><img :src="iconIncrease"/></el-button>
          <el-button class="btn-item" title="截图" @click="handleMark"><img :src="iconMark"/></el-button>
          <!--<el-button class="btn-item" @click="changeFullscreen"><img :src="iconFullscreen"/></el-button>-->
        </el-button-group>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import VideoCapture from 'video-capture'
  import kscreenshot from 'kscreenshot'
  import { setInterval, clearInterval } from 'timers'
  import iconIncrease from './icons/icon-increase.png'
  import iconLower from './icons/icon-lower.png'
  import iconFullscreen from './icons/icon-fullscreen.png'
  import iconMark from './icons/icon-mark.png'
  import { Loading } from 'element-ui'
  import ImageDraw from '@/components/ImageDraw'
  import { constants } from 'crypto'

  export default {
    components: { ImageDraw },
    name: 'VideoPlayer',
    props: {
      url: {
        type: String,
        required: false

      }


    },
    data() {
      return {
        width:0,
        height:0,
        videoUrl: "",
        videoPlayer: null,
        isLoadVideo: false,
        playerLoading: false,
        videoPlayerNoVideoIsShow:true,
        playerLoadingText: '视频加载中',
        iconIncrease: iconIncrease,
        iconLower: iconLower,
        iconFullscreen: iconFullscreen,
        iconMark: iconMark,
        videoPlayerIsShow: true,
        kscreenshot: null,
        fullscreen: false,
        playerControls: {
          stateIcon: 'el-icon-video-pause'
        },
        playerVolume: 0.8,
        playerDuration: 0,
        playerFormatDuration: '00:00',
        playerCurrentPostion: 0,
        playerFormatCurrentPostion: '00:00',
        playerPercentage: 0,
        initNextVideoUrl:null,
      }
    },
    created() {
      console.log('chongxinjiaz');
      this.keyup();
     
       
    },
    mounted() {
      this.initVideo();
      this.width = document.getElementById('playerBox').offsetWidth
      this.height = document.getElementById('playerBox').offsetHeight
    },
    methods: {
      keyup(){ 
        var _self=this;
         let frameTime = 1 / 25;
         document.onkeydown = function (event) {
          let e = event || window.event || arguments.callee.caller.arguments[0];
          console.log(e.keyCode,_self.videoPlayer)
           /** /if (_self.videoPlayer.paused()) { //or you can force it to pause here
             
          }else{
            if ((e && e.keyCode === 37) || (e && e.keyCode === 39)) { //left arrow
                  //one frame back
                _self.$message.error('必须处于暂停模式下方可使用上一帧下一帧')
              }
          }*/
         
          _self.playerControls.stateIcon = 'el-icon-video-play'
           if (e && e.keyCode === 37) { //left arrow
            _self.videoPlayer.pause()
              _self.videoPlayer.currentTime ( Math.max(0, _self.videoPlayer.currentTime() - frameTime));
          } else if (e && e.keyCode === 39) { //right arrow
              _self.videoPlayer.pause()
              _self.videoPlayer.currentTime(Math.min(_self.videoPlayer.duration(), _self.videoPlayer.currentTime() + frameTime));
          }else if(e && e.keyCode === 32){
            console.log(_self.videoPlayer.paused())
            if (_self.videoPlayer.paused()) {
                _self.videoPlayer.play()
                _self.playerControls.stateIcon = 'el-icon-video-pause';
                _self.playerStepInterval();
              } else {
                _self.videoPlayer.pause()
                _self.playerControls.stateIcon = 'el-icon-video-play'
              }
          }
        };
 
      },
      /**
       * 加载视频资源
       */
      initVideoUrl(url,pWidth,pHeight) {
        var _self=this;
        this.isLoadVideo = true;

        if (url == this.videoUrl) {
          this.$message.error('该视频已处于播放模式')
        } else {
           _self.playerControls.stateIcon = 'el-icon-video-play'

          this.videoPlayerNoVideoIsShow=false,
           this.videoUrl = url;
           this.videoPlayer.width(pWidth + 'px');
           this.videoPlayer.height(pHeight +'px');
           this.videoPlayer.src(this.videoUrl);
           this.videoPlayer.load(this.videoUrl);
           this.videoPlayer.pause();
           setTimeout(() => {
             _self.playerStepInterval();
           }, 1000);
          


        }
      },
      initNextVideo(videoProject){
        this.initNextVideoUrl=videoProject;
      },
      /**
       * video.js
       */
      initVideo() {
        var _self=this;
         this.videoPlayer = videojs(myVideo, {
            controls: false,
            autoplay: true,
            width: '0px',
            //设置视频播放器的显示高度（以像素为单位）
            height: '0px',
            preload: 'auto',
            volume:(this.playerVolume/100),
            plugins: {
              framebyframe: {
                fps: 25,
                steps: [
                  { text: '-5', step: -5 },
                  { text: '-1', step: -1 },
                  { text: '+1', step: 1 },
                  { text: '+5', step: 5 },
                ]
              }
            }
          },function(){
            this.on('ended',function () {
              console.log('播放完毕');
              if(_self.initNextVideoUrl==null){
                _self.$message.error('暂无下一个视频源');
              _self.playerControls.stateIcon = 'el-icon-video-play'

              }else{
                 _self.$message.error('正在切换下一个视频源');
                  //_self.playerDuration= 0,
                  //_self.playerFormatDuration= '00:00',
                //_self. playerCurrentPostion= 0,
                  //_self.playerFormatCurrentPostion= '00:00',
                  //_self.playerPercentage= 0,
                  _self.videoUrl=_self.initNextVideoUrl.url
                  _self.videoPlayer.src(_self.initNextVideoUrl.url);
                  _self.videoPlayer.load(_self.initNextVideoUrl.url);
                  _self.videoPlayer.pause();
                  _self.videoPlayer.autoplay(true);
                  setTimeout(() => {
                    _self.playerStepInterval();
                  }, 1000);
              }
              console.log(_self.initNextVideoUrl)
            });
          });
      },

      playerPlay(){
           console.log(this.videoPlayer);
           if(this.videoPlayer.paused()){

           }
           if (this.videoPlayerIsShow) {
              if (this.videoPlayer.paused()) {
                this.videoPlayer.play()
                this.playerControls.stateIcon = 'el-icon-video-pause';
                this.playerStepInterval();
              } else {
                this.videoPlayer.pause()
                this.playerControls.stateIcon = 'el-icon-video-play'
              }
            } else {
              this.$message.error('处于视频标注模式')
            }
      },
      playerStepInterval(){
          this.playerDuration=this.videoPlayer.duration();
          this.playerFormatDuration = (this.formatSeconds( this.playerDuration));
          var _self=this;
          setInterval(function() {
           _self.playerCurrentPostion = _self.videoPlayer.currentTime();
            _self.playerFormatCurrentPostion = _self.formatSeconds(_self.playerCurrentPostion);
            _self.playerPercentage = ((_self.playerCurrentPostion / _self.playerDuration) * 100);
        }, 1000);
      },
      changeVolume: function(type) {
        if (this.videoPlayerIsShow) {
          this.videoPlayer.muted(false);
          console.log(this.playerVolume)
          if ('add' == type) {
            if (this.playerVolume < 1) {
              this.playerVolume += 0.1
            }
          } else if ('sub' == type) {
            if (this.playerVolume > 0) {
              this.playerVolume -= 0.1
            }
          }
          this.playerVolume=Math.round(this.playerVolume*10)/10;
          this.videoPlayer.volume(this.playerVolume)
        } else {
          this.$message.error('处于视频标注模式')
        }
      },
       
      getEditMode(mode) {
        this.videoPlayerIsShow = mode
        this.$emit('getCurrentVideoMode', mode)

      },
      handleSliderChange(data) {
        if (this.videoPlayerIsShow) {
         
        } else {
          this.$message.error('处于视频标注模式')
        }

      },
      async handleMark() {
        this.$emit('getCurrentVideoMode', !this.videoPlayerIsShow)
        if (this.videoPlayerIsShow) {
          let _self = this
          if (this.videoPlayer.currentTime() > 0) {
            _self.playerLoading = true
            _self.playerLoadingText = '正在获取视频流...'
            this.videoPlayer.pause()
            this.playerControls.stateIcon = 'el-icon-video-play'
            let { dataURL, width, height } = await new VideoCapture(this.videoUrl).capture(_self.playerCurrentPostion)
            this.$refs.imageDraw.loadImage(dataURL)
            this.videoPlayerIsShow = false
            _self.playerLoading = false
          } else {
            this.$message.error('时间是大于0的数字')
          }
        } else {
          this.$message.error('已处于视频标注模式')
        }

      },
      getDrawImage(drawImage) {
        var obj = {
          imgUrl: drawImage,
          currentPosition: this.videoPlayer.currentTime()
        }
        this.$emit('getCutImg', obj)
        this.videoPlayerIsShow = true
        this.$emit('getCurrentVideoMode', true)

      },
      
      formatSeconds(value) {
        var theTime = parseInt(value)// 秒
        var middle = 0// 分
        var hour = 0// 小时

        if (theTime > 60) {
          middle = parseInt(theTime / 60)
          theTime = parseInt(theTime % 60)
          if (middle > 60) {
            hour = parseInt(middle / 60)
            middle = parseInt(middle % 60)
          }
        }
        var result = '00:00'
        theTime = parseInt(theTime)
        if (theTime < 10) {
          result = '0' + theTime
        } else {
          result = theTime
        }
        if (middle > 0) {
          middle = parseInt(middle)
          if (middle < 10) {
            result = '0' + middle + ':' + result
          } else {
            result = '' + middle + ':' + result

          }
        }
        if (hour > 0) {
          result = '' + parseInt(hour) + ':' + result
        }
        if ((result + '').split(':').length == 1) {
          result = '00:' + result
        }
        return result
      }

    }
  }
</script>


<style lang="scss">
  .player-box {
    width: 100%;
    height: 100%;
    position: relative;
    #videoPlayer{
      text-align: center;
      font-size: 18px;
      line-height: 200px;
    }
    .img-vision {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 109;
      text-align: center;
      background: #000;
    }
  }

  #playerToolbar {
    height: 38px;
    line-height: 38px;
    width: 100%;
    background-color: #303133;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;

    .bar-item {
      text-align: center;
      height: 38px;

      .text {
        float: left;
        width: 10%;
        color: #fff;
        line-height: 38px;
        text-align: center;
      }

      .slider {
        float: left;
        width: 80%;
        color: #fff;
      }
    }

    .btn-item {
      border: none;
      border-radius: none;
      background: transparent;
      padding: 0;
      color: #fff;
      margin-left: 6px;
    }

    .btn-play {
      font-size: 30px;

      i {
        font-weight: bold;
      }
    }
  }
</style>
