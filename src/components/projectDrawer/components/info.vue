<template>
  <div id="info">
    <!-- 项目消息栏 -->
    <template v-if="project && project.entity_type === 4">
      <div>
        <el-row>
          <el-col :span="6" class="comment">项目名称</el-col>
          <el-col :span="15" class="comment">
            <span v-if="!editing" @dblclick="edit">{{project.name}}</span>
            <input
              type="text"
              ref="input"
              v-if="editing"
              class="input"
              value="project.name"
              v-model="name"
              @blur="save"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目编码</el-col>
          <el-col :span="15" class="comment">{{project.code}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">项目状态</el-col>
          <el-col :span="15" class="comment">{{project.status|projectStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">开始日期</el-col>
          <el-col :span="15" class="comment">{{project.date_start|dateFormat}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">结束日期</el-col>
          <el-col :span="15" class="comment">{{project.date_end|dateFormat}}</el-col>
        </el-row>
      </div>
    </template>
    <!-- 资产消息栏 -->
    <template v-if="project && project.entity_type === 5">
      <div>
        <el-row>
          <el-col :span="6" class="comment">资产名称</el-col>
          <el-col :span="15" class="comment">{{project.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">资产类型</el-col>
          <el-col :span="15" class="comment">{{project.category>0?project.category:"未分类"}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">创建人</el-col>
          <el-col :span="15" class="comment">{{project.creator_name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">优先级</el-col>
          <el-col :span="15" class="comment">{{project.priority |Priority}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="comment">难度等级</el-col>
          <el-col :span="15" class="comment">{{project.level |Level}}</el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import { putProjects } from "@/api/project";
export default {
  props: ["project"],
  name: "info",
  data() {
    return {
      editing: false,
      name: null
    };
  },

  methods: {
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    save() {
      this.editing = false;
      putProjects({
        method: "put",
        id: this.project.id,
        name: this.name
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.project.name = this.name;
          this.name = null;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#info {
  .comment {
    padding: 15px 10px;
    font-size: 14px;
  }
  input {
    width: 240px;
    border: none;
    border-bottom: solid 2px deepskyblue;
  }
  input:focus {
    outline: none;
  }
}
</style>
>
</style>
