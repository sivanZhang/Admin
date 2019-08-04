<template>
  <div class="video-cont">
    <ul id="videoSliderList">
      <li v-for="(item,index) in selectProjects" :key="index" @click="initSource(index)">
        <span class="color-slider" :class="index%2==0?'on':''">
          {{item.time}}
          <font v-if="currentPlayId==item.id">正在播放</font>
          </span>
      </li>
      
    </ul>
    <!--<el-button type="primary" style="margin:10px 0 0 10px;" @click="addVideoList">加入播放队列{{selectProjectIds}}</el-button> -->
    <ul class="list">
        <li class="item" v-for="(item,index) in projectList" :key="index">
          <input type="checkbox" v-model="selectProjectIds" style="margin:10px 0px 0px 5px;" :value="item.id"   @change="changeCheckedProject"/>
          <div>
            <p class="pro-name">{{item.proName}}</p>
            <div class="pro-video">
                <img :src="item.videoImage"/>
            </div>
            <p>当前版本：{{item.version}}</p>
          </div>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'VideoList',
  data() {
    return {
      projectList:[],
      selectProjectIds:[],
      selectProjects:[],
      currentPlayId:-1,
    };
  },
  created(){
    this.initInfo();
  },
  methods: {
    initInfo(){
        //读取AJAX获取数据
      for(let i=0;i<5;i++){
        if( i % 2 == 0){
          let project={
            id:i,
            proName:"项目名称11"+i,
            version:"00" + i,
            time:"02:33",
            url:'https://chiship.oss-cn-shanghai.aliyuncs.com/banner02.mp4',
            videoImage:"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          };
          this.projectList.push(project);
        }else{
          let project={
              id:i,
              proName:"项目名称11"+i,
              version:"00" + i,
              time:"12:33",
              url:'https://chiship.oss-cn-shanghai.aliyuncs.com/banner01.mp4',
              videoImage:"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            };
            this.projectList.push(project);
        }
        
      }
    },
    getCurrentPlayId(id){
      this.currentPlayId=id;

    },
    initSource(index){
      let selectProject=this.selectProjects[index];
      this.currentPlayId=selectProject.id;
      console.log(selectProject)
      let projectList=new Array();
      projectList[0]=selectProject;
      if(index+1!=this.selectProjects.length){
        projectList[1]=this.selectProjects[index+1];
      }else{
        projectList[1]=null;
      }
      this.$emit("initSource",projectList);
    },
    checkedProject(data){
      console.log("监听点击",data);
    },
    changeCheckedProject(data){
      this.selectProjects.length=0;
      for(let k=0;k<this.selectProjectIds.length;k++){
        for(let i=0;i<this.projectList.length;i++){
          if(this.projectList[i].id==this.selectProjectIds[k]){
            this.selectProjects.push(this.projectList[i])
          }
        }
      }
      
     // console.log(this.selectProjectIds,121,this.selectProjects);
    },
    addVideoList(){

    }
  }
};
</script>
<style lang="scss" scoped>
  #videoSliderList{
    display:block;
    white-space:nowrap;
    width:100%;
    overflow:auto;
    li{
      width: 20%;
      display: inline-block;
      margin: 10px 2%;
      .color-slider{
        display:block;
        width:100%;
        height:25px;
        background: red;
        cursor: pointer;
        text-align:center;
        color:#fff;
        line-height:25px;
      }
      .on{
        background: #67C23A;
      }
    }
  }
  .video-cont{
    width:100%;
    height:100%;
    .list{
      list-style: none;
      padding: 10px;
      margin: 0;
      overflow: hidden;
      // height: 100%;
      height:calc(100% - 90px);
      .item{
        float: left;
        width: 19%;
        height: 100%;
        border: 1px dotted #ddd;
        margin: 0 0.5%;
        background: #fff;
        p{
          padding: 0 5px 0 5px;
          margin: 0 0 10px 0;
          font-weight: normal;

        }
        .pro-name{

        }
        .pro-video{
          img{
            width:100%;
            height:90px;
          }
          p{

          }
        }
      }
    }
  }
</style>
