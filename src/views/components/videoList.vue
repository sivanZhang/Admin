<template>
  <div class="video-cont">
    <ul class="list">
        <li class="item" v-for="(item,index) in projectList" :key="index" @click="initSource(index)">
          <div>
            <p class="pro-name">{{item.proName}}</p>
            <div class="pro-video">
                <img :src="item.videoImage"/>
                <p>当前版本：{{item.version}}</p>
            </div>
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
            url:'http://localhost:8080/test/banner01.mp4',
            videoImage:"http://localhost:8080/test/demo.jpg"
          };
          this.projectList.push(project);
        }else{
          let project={
              id:i,
              proName:"项目名称11"+i,
              version:"00" + i,
              url:'http://localhost:8080/test/banner02.mp4',
              videoImage:"http://localhost:8080/test/demo.jpg"
            };
            this.projectList.push(project);
        }
        
      }
    },
    initSource(index){
      this.$emit("initSource",index);
    }
  }
};
</script>
<style lang="scss" scoped>
  .video-cont{
    width:100%;
    height:100%;
    .list{
      list-style: none;
      padding: 10px;
      margin: 0;
      overflow: hidden;
      height: 100%;
      .item{
        float: left;
        width: 19%;
        height: 100%;
        border: 1px dotted #ddd;
        margin: 0 0.5%;
        background: #fff;
        p{
          padding: 5px;
          margin: 10px 0;
          font-weight: normal;

        }
        .pro-name{

        }
        .pro-video{
          img{
            width:100%;
            height:100%;
          }
          p{

          }
        }
      }
    }
  }
</style>
