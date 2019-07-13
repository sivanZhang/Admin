<template>
  <div id="playerBox" class="player-box" v-loading="playerLoading"
       :element-loading-text="playerLoadingText"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <image-draw ref="imageDraw" class="img-vision" :style="{display:!videoPlayerIsShow?'block':'none'}" :width="width"
                :height="height" @getDrawImage="getDrawImage" @getEditMode="getEditMode"></image-draw>
    <div id="videoPlayer" :style="{display:videoPlayerIsShow?'block':'none'}">Loading the player...</div>
    <el-row id="playerToolbar" v-if="isLoadVideo">
      <el-col :span="1" class="bar-item">
        <el-button class="btn-item btn-play" :icon="playerControls.stateIcon" @click="playerPlay"></el-button>
      </el-col>
      <el-col :span="18" class="bar-item">
        <span class="text">{{playerFormatCurrentPostion}}</span>
        <div class="slider">
          <el-slider v-model="playerPercentage" :show-tooltip='false' @change="handleSliderChange"></el-slider>
        </div>
        <span class="text">{{playerFormatDuration}}</span>
      </el-col>
      <el-col :span="5" class="bar-item">
        <span style="color:#fff;">音量:{{playerVolume}}</span>
        <el-button-group class="btn-group">
          <el-button class="btn-item" @click="changeVolume('sub')"><img :src="iconLower"/></el-button>
          <el-button class="btn-item" @click="changeVolume('add')"><img :src="iconIncrease"/></el-button>
          <el-button class="btn-item" @click="handleMark"><img :src="iconMark"/></el-button>
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
        width: 0,
        height: 0,
        videoUrl: null,
        isLoadVideo: true,
        playerLoading: false,
        playerLoadingText: '视频加载中',
        iconIncrease: iconIncrease,
        iconLower: iconLower,
        iconFullscreen: iconFullscreen,
        iconMark: iconMark,
        videoPlayerIsShow: true,
        videoPlayer: null,
        kscreenshot: null,
        fullscreen: false,
        playerControls: {
          stateIcon: 'el-icon-video-pause'
        },
        playerVolume: 10,
        playerDuration: 0,
        playerFormatDuration: '00:00',
        playerCurrentPostion: 0,
        playerFormatCurrentPostion: '00:00',
        playerPercentage: 0
      }
    },
    created() {
      console.log('chongxinjiaz')
    },
    mounted() {
      if (this.url) {
        this.videoUrl = this.url
        this.initVideoPlayer()
      } else {
        this.isLoadVideo = false
      }

    },
    methods: {
      /**
       * 加载视频资源
       */
      initVideoUrl(url) {
        if (url == this.videoUrl) {
          this.$message.error('该视频已处于播放模式')
        } else {
          if (this.videoPlayer) {
            if (this.videoPlayer.getState() == 'PLAYING') {
              this.$message.error('该视频已处于播放模式不能切换,请先暂停')
              return
            } else {
              console.log('切换视频')
              this.isLoadVideo = true
              this.videoUrl = url
              this.playerCurrentPostion = 0
              this.playerFormatCurrentPostion = '00:00'
              this.playerDuration = 0
              this.playerFormatDuration = '00:00'
              this.playerPercentage = 0
              this.initVideoPlayer()
            }
          } else {
            this.isLoadVideo = true
            this.videoUrl = url
            this.initVideoPlayer()
          }

        }

      },

      /**
       * 初始化视频播放器
       */
      initVideoPlayer() {

        let _self = this

        this.videoPlayer = jwplayer('videoPlayer').setup({
          flashplayer: '/lib/jwplayer-v6.1.2972/player.swf',
          file: this.videoUrl,
          height: '100%',
          width: '100%',
          bgcolor: '#ffffff',
          abouttext: '',
          primary: 'flash',
          controls: false,
          controlbar: 'bottom',
          autostart: false,//自动播放
          events: {
            onComplete: function() {
              _self.playerControls.stateIcon = 'el-icon-video-play'
              console.log('播放结束!!!')

            },
            onVolume: function() {
              console.log('声音大小改变!!!')
            },
            onReady: function() {
              console.log('准备就绪!!!')
              this.seek(0)
              _self.playerControls.stateIcon = 'el-icon-video-play'

            },
            onPlay: function() {
              console.log('开始播放!!!')
              _self.playerLoading = false
              _self.playerControls.stateIcon = 'el-icon-video-pause'
              this.setVolume(_self.playerVolume)
              _self.playerVolume = this.getVolume()
              _self.playerCurrentPostion = this.getPosition()
              _self.playerFormatCurrentPostion = _self.formatSeconds(_self.playerCurrentPostion)
              _self.playerPercentage = ((_self.playerCurrentPostion / _self.playerDuration) * 100)
              _self.changeSlider()
            },
            onPause: function() {
              console.log('暂停!!!')
              _self.playerControls.stateIcon = 'el-icon-video-play'

            },
            onBufferChange: function() {
              let buffer = this.getBuffer()
              console.log('缓冲改变!!!' + buffer)
              if (buffer == 100) {
                _self.playerLoading = false
              } else {

              }

            },
            onBufferFull: function() {
              console.log('视频缓冲完成!!!' + this.getBuffer())
              _self.playerLoading = false
              setTimeout(() => {
                _self.initPostion()
              }, 1000)
              _self.width = document.getElementById('playerBox').offsetWidth
              _self.height = document.getElementById('playerBox').offsetHeight
            },
            onError: function(obj) {
              console.log('播放器出错!!!' + obj.message)
              _self.$message.error('视频加载出错,请检查视频路径')
            },
            onFullscreen: function(obj) {
              if (obj.fullscreen) {
                console.log('全屏')
                _self.fullscreen = true
              } else {
                _self.fullscreen = false
              }
            },
            onMute: function(obj) {
              console.log('静音/取消静音')
            }
          }

        })

      },
      changeSlider() {
        let _self = this
        setInterval(function() {
          console.log(_self.videoPlayer.getPosition())
          if (_self.videoPlayer.getPosition() != null) {
            _self.playerCurrentPostion = _self.videoPlayer.getPosition()
            _self.playerFormatCurrentPostion = _self.formatSeconds(_self.playerCurrentPostion)
            _self.playerPercentage = ((_self.playerCurrentPostion / _self.playerDuration) * 100)
          }
        }, 1000)
      },
      initPostion() {
        console.log('init', this.videoPlayer.getDuration())
        this.playerFormatDuration = (this.formatSeconds(this.videoPlayer.getDuration()))
        this.playerDuration = this.videoPlayer.getDuration()
      },
      getEditMode(mode) {
        this.videoPlayerIsShow = mode
        this.$emit('getCurrentVideoMode', mode)

      },
      handleSliderChange(data) {
        if (this.videoPlayerIsShow) {
          this.videoPlayer.seek(this.playerDuration * data / 100)
          this.playerCurrentPostion = this.playerDuration * data / 100
          this.playerFormatCurrentPostion = this.formatSeconds(this.playerDuration * data / 100)
        } else {
          this.$message.error('处于视频标注模式')
        }

      },
      async handleMark() {
        this.$emit('getCurrentVideoMode', !this.videoPlayerIsShow)
        if (this.videoPlayerIsShow) {
          let _self = this
          if (this.videoPlayer.getPosition() > 0) {
            _self.playerLoading = true
            _self.playerLoadingText = '正在获取视频流...'
            this.videoPlayer.pause(true)
            this.playerControls.stateIcon = 'el-icon-video-play'

            let { dataURL, width, height } = await new VideoCapture(this.videoUrl).capture(this.videoPlayer.getPosition())
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
          currentPosition: this.videoPlayer.getPosition()
        }
        this.$emit('getCutImg', obj)
        this.videoPlayerIsShow = true
        this.$emit('getCurrentVideoMode', true)

      },
      playerPlay: function() {
        if (this.videoPlayerIsShow) {
          if (this.videoPlayer.getState() != 'PLAYING') {
            this.videoPlayer.play(true)
            this.playerControls.stateIcon = 'el-icon-video-pause'
          } else {
            this.videoPlayer.play(false)
            this.playerControls.stateIcon = 'el-icon-video-play'
          }
        } else {
          this.$message.error('处于视频标注模式')
        }

      },
      changeVolume: function(type) {
        if (this.videoPlayerIsShow) {
          if ('add' == type) {
            if (this.playerVolume < 100) {
              this.playerVolume += 5
            }
          } else if ('sub' == type) {
            if (this.playerVolume > 0) {
              this.playerVolume -= 5
            }
          }
          this.videoPlayer.setVolume(this.playerVolume)
        } else {
          this.$message.error('处于视频标注模式')
        }

      },
      changeFullscreen: function() {
        this.videoPlayer.setFullscreen(true)
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
    background-color: transparent;
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
