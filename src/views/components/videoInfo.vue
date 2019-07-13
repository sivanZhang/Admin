<template>
  <div >
      <div v-if="!isHasData">暂无数据</div>
      <div class="info-cont" v-if="isHasData">
        <img class="image" :src="videoInfo.videoImage"/>
        <div class="desc">
            <p><span>项目名称</span><span>{{videoInfo.videoName}}</span></p>
            <p><span>项目编码</span><span>{{videoInfo.videoCode}}</span></p>
            <p><span>结束日期</span><span>{{videoInfo.videoEndTime}}</span></p>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VideoInfo',
  data() {
    return {
      id:null,
      isHasData:false,
      videoInfo:{}
    };
  },
  methods: {
     initInfo(id){
         this.id=id;
         //根据ID读取AJAX获取数据
         this.videoInfo={
             videoImage:'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
             videoName:"测试名称",
             videoCode:'测试编号'+id,
             videoEndTime:'2019-12-31'
         }
         this.isHasData=true;
     }
  }
};
</script>
<style lang="scss" scoped>
  .info-cont{
        width: 100%;
        height:100%;
        font-family: 'Microsoft YaHei';
        overflow: hidden;
        .image{
            float:left;
            width:200px;
            height: 115px;
        }
        .desc{
            float:left;
            padding-left: 10px;
            p{
                font-size: 14px;
                padding:10px 0;
                span:first-child{
                    color: #555666;
                    min-width: 75px;
                    display: inline-block;
                }
                span:last-child{

                }
            }
        }
    }
</style>
