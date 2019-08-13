<template>
  <div id="detail">
    <el-row>
      <el-col :span="10">
        <el-image
          class="mini-image"
          :src="project.image?$store.state.BASE_URL+project.image:''"
          fit="cover"
          style="width: 170px;height: 120px;float: left;margin-right: 10px"
        ></el-image>
      </el-col>
      <el-col :span="4">
        <div>项目名称：</div>
        <div>资产名称：</div>
        <div>开始日期：</div>
        <div>结束日期：</div>
        <div>工时：</div>
        <div>状态：</div>
      </el-col>
      <el-col :span="10">
        <div>{{project.name}}</div>
        <div>{{asset.name?asset.name:"-"}}</div>
        <div>{{detail.start_date|dateFormat}}</div>
        <div>{{detail.end_date|dateFormat}}</div>
        <div>{{detail.total_hour}}小时</div>
        <div>{{detail.status|taskStatus}}</div>
      </el-col>
    </el-row>
    <div style="padding-top:20px">
      <el-row style="height:120px">
        <el-col :span="4">
          <span style="font-size:14px">制作内容：</span>
        </el-col>
        <el-col :span="20" style>{{detail.content}}</el-col>
      </el-row>
    </div>
    <div style="padding-top:20px">
      <el-row style="border:2px solid #999999;height:160px">
        <el-col :span="4">
          <span style="font-size:14px">任务反馈：</span>
        </el-col>
        <el-col :span="20" style></el-col>
      </el-row>
    </div>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务执行记录" name="first">
          <el-form
            ref="taskRecord"
            :model="taskRecord"
            label-width="100px"
            label-position="left"
            :rules="rules"
          >
            <el-form-item label="任务状态" prop="status">
              <el-radio v-model="taskRecord.status" label="0">正在进行</el-radio>
              <el-radio v-model="taskRecord.status" label="1">已完成</el-radio>
            </el-form-item>
            <el-form-item label="标题" prop="title" >
              <el-input v-model="taskRecord.title" :disabled="taskRecord.status>0?true:false"></el-input>
            </el-form-item>
            <el-form-item label="完成任务" prop="content" >
              <el-input type="textarea" v-model="taskRecord.content" :disabled="taskRecord.status>0?true:false"></el-input>
            </el-form-item>
            <el-form-item label="工时" prop="labor_hour">
              <el-input v-model="taskRecord.labor_hour" :disabled="taskRecord.status>0?true:false">
                <span slot="append">小时</span>
              </el-input>
            </el-form-item>
            <el-form-item label="完成进度" prop="schedule" >
              <el-slider v-model="taskRecord.schedule" :disabled="taskRecord.status>0?true:false"></el-slider>
            </el-form-item>

            <el-form-item label="完成情况说明" prop="comment">
              <el-input
                v-model="taskRecord.comment"
                type="textarea"
                :disabled="taskRecord.status>0?false:true"
              ></el-input>
            </el-form-item>
            <el-form-item class="subbtn" align="right">
              <el-button type="primary" @click="submitForm(taskRecord.status)">提交审批</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { addTaskRecord } from "@/api/task";
export default {
  name: "detail",
  props: ["detail", "project", "asset"],
  data() {
    return {
      activeName: "first",
      taskRecord: {
        status:"0"
      },

      rules: {
        title: [
          {
           
            message: "请输入任务执行记录的标题",
            trigger: "blur"
          }
        ],
        content: [
          {
            
            message: "请输入任务执行记录的内容",
            trigger: "blur"
          }
        ],
        labor_hour: [
          {  message: "请输入任务执行的工时", trigger: "blur" }
        ]
      },
      rules2: {
        comment: [
          {  message: "请输入任务完成情况说明", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(Type) {
      if (Type === 0) {
        this.$refs["taskRecord"].validate(valid => {
          if (valid) {
            const Data = {
              ...this.taskRecord,
              task_id: this.detail.id,
              type: 0,
              comment: ""
            };
            console.log(Data);
            addTaskRecord(Data).then(({ data }) => {
              this.$message(data.mag);
            });
          }
        });
      } else {
        this.$refs["taskRecord"].validate(valid => {
          if (valid) {
            const Data2 = {
              ...this.taskRecord,
              task_id: this.detail.id,
              type: 1
            };
            console.log(Data2);
            addTaskRecord(Data2).then(({ data }) => {
              this.$message(data.mag);
            });
          }
        });
      }
    }
  },
  mounted(){
    document.body.style.minWidth = 'auto'
  }
};
</script>

<style scoped>
</style> 