<template>
  <div >
     <div class="comment-cont">
        <div class="search-header">
            <input class="keyword" placeholder="在此输入筛选条件"/>
            <el-select class="select-item" v-model="listQuery.category">
                <el-option value="任何类别">任何类别</el-option>
                <el-option value="类别1">类别1</el-option>
                <el-option value="类别2">类别2</el-option>
            </el-select>
            <el-select class="select-item" v-model="listQuery.days">
                <el-option value="最近30天">最近30天</el-option>
                <el-option value="最近2周">最近2周</el-option>
                <el-option value="最近一周">最近一周</el-option>
            </el-select>
            <el-select class="select-item" v-model="listQuery.mark">
                <el-option value="任何备注">任何备注</el-option>
                <el-option value="不合格">不合格</el-option>
                <el-option value="标记不准确">标记不准确</el-option>
            </el-select>
        </div>
        <ul class="comment-list">
            <li class="comment-item" v-for="(item,index) in videoComments" :key="index">
                <div class="user-shot"><span>{{item.uertShot}}</span></div>
                <div class="desc">
                    <p class="user-text"><span>{{item.userName}}</span><span>{{item.publishTime}}</span></p>
                    <p class="desc-text">{{item.markText}}</p>
                    <p class="pro-text">
                        <img :src="item.markImage"/>
                        <span>{{item.desc}}</span>
                    </p>
                    <p class="reply-text">
                        <input placeholder="回复..."/>
                    </p>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VideoComment',
  data() {
    return {
      id:null,
      videoComments:[],
      listQuery:{
          category:"任何类别",
          days:"最近30天",
          mark:"任何备注"
      }
    };
  },
  methods: {
     initInfo(id){
         this.id=id;
         //根据ID读取AJAX获取数据
         for(let i=0;i<10;i++){
           let videoComment={
           uertShot:"LJ"+i,
           userName:"lijian"+i,
           publishTime:'7小时前',
           markText:'不脆不错',
           markImage:'http://tl.chidict.com:8081/test/demo.jpg',
           desc:'新项目/初始版本'
         };
         this.videoComments.push(videoComment);
         }
        
     }
  }
};
</script>
<style lang="scss" scoped>
  .comment-cont{
        .search-header{
            .keyword{
                border:none;
                border-bottom:1px solid #eee;
                outline: none;
                line-height: 32px;
            }
            .select-item{
                border:none;
                width:110px;
                margin-left:6px;
            }
        }
        .comment-list{
            list-style: none;
            padding: 0;
            margin: 0;
            .comment-item{
                margin:6px 0;
                overflow: hidden;
                .user-shot{
                    float: left;
                    width:10%;
                    span{
                        display: block;
                        width:40px;
                        height:40px;
                        margin-top:10px;
                        text-align: center;
                        line-height:40px;
                        font-size: 18px;
                        background: #409EFF;
                        color:#fff;
                        border-radius:50%;
                    }
                }
                .desc{
                    float: left;
                    width:90%;
                    font-size: 12px;
                    border:1px solid #ddd;
                    .user-text{
                        padding:10px;
                        overflow: hidden;
                        span:first-child{
                            float:left;
                            color: #999;
                        }
                        span:last-child{
                            float:right;
                            color:#666;
                        }
                    }
                    .desc-text{
                        padding:10px;
                    }
                    .pro-text{
                        padding:10px;
                        img{
                            width: 50px;
                            height:50px;
                            vertical-align: middle;
                        }
                        span{
                            vertical-align: middle;
                            padding-left: 10px;
                            color: #409EFF;
                            font-size: 14px;
                        }
                    }
                    .reply-text{
                        padding:10px;
                        input{
                            display: block;
                            width: 100%;
                            background: #eee;
                            border: 1px solid #ddd;
                            line-height: 25px;
                            padding: 0 5px;
                        }
                    }
                }
            }
        }
    }
</style>
