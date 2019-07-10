<template>
    <div class="player-box">
        <img id="imgVision" class="img-vision" :style="{display:!videoPlayerIsShow?'block':'none'}">
        <div id="videoPlayer" :style="{display:videoPlayerIsShow?'block':'none'}">Loading the player...</div>
        <el-row id="playerToolbar">
          <el-col :span="1" class="bar-item">  
            <el-button class="btn-item btn-play" :icon="playerControls.stateIcon" @click="playerPlay"></el-button>
          </el-col>
           <el-col :span="18" class="bar-item">
             <span class="text">{{playerFormatCurrentPostion}}</span>
             <div class="slider"><el-slider v-model="playerPercentage" :show-tooltip='false' @change="handleSliderChange"></el-slider></div>
             <span class="text">{{playerFormatDuration}}</span>
          </el-col>
           <el-col :span="5" class="bar-item">
            <span style="color:#fff;">音量:{{playerVolume}}</span>
            <el-button-group class="btn-group">
              <el-button class="btn-item" @click="changeVolume('sub')"><img :src="iconLower"/></el-button>
              <el-button class="btn-item" @click="changeVolume('add')"><img :src="iconIncrease"/></el-button>
              <el-button class="btn-item" @click="handleMark"><img :src="iconMark"/></el-button>
              <el-button class="btn-item" @click="changeFullscreen"><img :src="iconFullscreen"/></el-button>
            </el-button-group>
          </el-col>
        </el-row>        
    </div>
</template>

<script>
   import VideoCapture from 'video-capture'
   import kscreenshot from 'kscreenshot'
   import { setInterval } from 'timers';
   import iconIncrease from './icons/icon-increase.png';
   import iconLower from './icons/icon-lower.png';
   import iconFullscreen from './icons/icon-fullscreen.png';
   import iconMark from './icons/icon-mark.png';

   export default {
    name: 'VideoPlayer',
    props: {
      url: {
        type: String,
        required: true
      }

    },
    data () {
      return {
        iconIncrease:iconIncrease,
        iconLower:iconLower,
        iconFullscreen:iconFullscreen,
        iconMark:iconMark,
         videoPlayerIsShow:true,
         videoPlayer:null,
         kscreenshot:null,
         fullscreen:false,
         playerControls:{
           stateIcon:"el-icon-video-pause"
         },
         playerVolume:50,
         playerDuration:0,
         playerFormatDuration:"00:00",
         playerCurrentPostion:0,
         playerFormatCurrentPostion:"00:00",
         playerPercentage:0
      }
    },
    created() {
    },
    mounted (){
      console.log(this.url)
      let _self=this;
       this.videoPlayer=jwplayer("videoPlayer").setup({
                flashplayer: "/lib/jwplayer-v6.1.2972/player.swf",
                file:this.url,
                height:"100%",
                width:"100%",
                abouttext:"",
                primary: "flash",
                controls:false,
                controlbar:"bottom",
                autostart:true,//自动播放
                events: {
                  onComplete: function () { 
                    _self.playerControls.stateIcon = 'el-icon-video-play';   
                    console.log("播放结束!!!");
                  },
                  onVolume: function () { console.log("声音大小改变!!!"); },
                  onReady: function () { console.log("准备就绪!!!"); },
                  onPlay: function () { 
                    console.log("开始播放!!!"); 
                    this.setVolume(_self.playerVolume)
                    _self.playerFormatDuration=(_self.formatSeconds(this.getDuration()))
                    _self.playerDuration=this.getDuration();
                    _self.playerVolume=this.getVolume();
                    var playerThis=this;
                    setInterval(function(){
                      _self.playerCurrentPostion=playerThis.getPosition(); 
                      _self.playerFormatCurrentPostion=_self.formatSeconds(_self.playerCurrentPostion);
                      _self.playerPercentage=((_self.playerCurrentPostion/_self.playerDuration)*100)
                    },1000)
                  },
                  onPause: function () { console.log("暂停!!!"); },
                  onBufferChange: function () {
                     console.log("缓冲改变!!!"); 
                  },
                  onBufferFull: function () { console.log("视频缓冲完成!!!"); },
                  onError: function (obj) { console.log("播放器出错!!!" + obj.message); },
                  onFullscreen: function (obj) { 
                    if (obj.fullscreen) { 
                      console.log("全屏"); 
                      _self.fullscreen=true;
                    } else { 
                      _self.fullscreen=false;
                    } 
                  },
                  onMute: function (obj) { console.log("静音/取消静音") }
              }
        
            });
            

     
    },
    methods:{
      handleSliderChange(data){
        console.log(data);
      },
      async handleMark(){
        let _self=this;
        console.log(this.videoPlayer);
        console.log(this.videoPlayer.getDuration())
        console.log(this.videoPlayer.getPosition())
        this.videoPlayer.pause(true);
        let { dataURL, width, height } = await new VideoCapture(this.url).capture(this.videoPlayer.getPosition());
        document.getElementById("imgVision").src = dataURL;
        this.videoPlayerIsShow=false;  
        this.kscreenshot=new kscreenshot({})
        this.kscreenshot.endCB=function(data){
          var obj = {
            imgUrl:data,
            currentPosition:_self.videoPlayer.getPosition()
          };
          _self.$emit("getCutImg",obj);
          _self.videoPlayerIsShow=true;
        }
        this.kscreenshot.cancelCB=function(){
          console.log(111)
        }
        this.kscreenshot.startScreenShot();
      },
      playerPlay:function(){
        if (this.videoPlayer.getState() != 'PLAYING') {  
              this.videoPlayer.play(true);  
              this.playerControls.stateIcon = 'el-icon-video-pause';  
          } else {  
              this.videoPlayer.play(false);  
              this.playerControls.stateIcon = 'el-icon-video-play';  
          }  
      },
      changeVolume:function(type){
        if('add'==type){
          if(this.playerVolume<100){
            this.playerVolume+=5;
          }
        }else if('sub'==type){
          if(this.playerVolume>0){
            this.playerVolume-=5;
          }
        }
        this.videoPlayer.setVolume(this.playerVolume)

      },
      changeFullscreen:function(){
        this.videoPlayer.setFullscreen(true)
      },
      formatSeconds(value) {
          var theTime = parseInt(value);// 秒
          var middle= 0;// 分
          var hour= 0;// 小时

          if(theTime > 60) {
              middle= parseInt(theTime/60);
              theTime = parseInt(theTime%60);
              if(middle> 60) {
                  hour= parseInt(middle/60);
                  middle= parseInt(middle%60);
              }
          }
          var result="00:00";
          theTime=parseInt(theTime);
          if(theTime<10){
            result = "0"+theTime;
          }else{
            result = theTime;
          }
          if(middle > 0) {
              middle=parseInt(middle);
              if(middle<10){
                result = "0"+middle+":"+result;
              }else{
                result = ""+middle+":"+result;

              }
          }
          if(hour> 0) {
              result = ""+parseInt(hour)+":"+result;
          }
          if((result+"").split(":").length==1){
            result="00:"+result;
          }
          return result;
      }
 
    }
  }
</script>


<style lang="scss">
    .player-box{
      width:100%;
      height:100%;
      position:relative;
      .img-vision{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
      }
    }
    #playerToolbar{
      height:38px;
      line-height: 38px;
      width:100%;
      background-color: transparent;
      position: absolute;
      bottom: 0;
      left: 0;
      .bar-item{
        text-align:center;
        height:38px;
        .text{
          float:left;
          width:10%;
          color:#fff;
          line-height:38px;
          text-align:center;
        }
        .slider{
          float:left;
          width:80%;
          color:#fff;
        }
      }
      .btn-item{
        border:none;
        border-radius:none;
        background:transparent;
        padding:0;
        color:#fff;
        margin-left:6px;
      }
      .btn-play{
        font-size:30px;
        i{
          font-weight:bold;
        }
      }
    }
</style>
