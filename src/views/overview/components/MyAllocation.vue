<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="sceneNeed.length" :hidden="!sceneNeed.length" :max="99" class="item">
        <span style="padding-right: 10px;">待分配镜头</span>
      </el-badge>
      <el-button type="text" @click="$router.push({path:'/team-manager/team-manager'})">查看更多</el-button>
    </el-row>
    <el-table :data="sceneNeed">
      <el-table-column label="镜头号" prop="name" show-overflow-tooltip class-name="links">
        <template slot-scope="scope">
          <span @click="showDrawer(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="content" label="制作内容" align="left" show-overflow-tooltip />

      <el-table-column label="项目名称" class-name="links" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project_id},query:{type:scope.row.project_type}}"
          >{{ scope.row.project_name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template slot-scope="scope">{{ scope.row.priority|Priority }}</template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加任务" :visible.sync="isCreateTaskShow" width="512px" center :modal="false">
      <el-form ref="TaskForm" :model="TaskForm" :rules="rules" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" @input="change($event)" />
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input v-model="TaskForm.content" type="textarea" :rows="3" @input="change($event)" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.grade" :label="0">A+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">A</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">A-</el-radio>
          <el-radio v-model="TaskForm.grade" :label="3">B+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="4">B</el-radio>
          <el-radio v-model="TaskForm.grade" :label="5">B-</el-radio>
          <el-radio v-model="TaskForm.grade" :label="6">C+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="7">C</el-radio>
          <el-radio v-model="TaskForm.grade" :label="8">D+</el-radio>
          <el-radio v-model="TaskForm.grade" :label="9">D</el-radio>
          <el-radio v-model="TaskForm.grade" :label="10">E</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择执行人">
            <el-option
              v-for="item of DeptUsers"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="环节时间">
          <el-row style="padding-left:10px;font-size: 12px;">
            <el-col :span="6">{{ linkstart|dateFormat }}</el-col>
            <el-col :span="3">
              <span>至</span>
            </el-col>
            <el-col :span="15">{{ linkend|dateFormat }}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            @change="changeTime()"
          />
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelTask">取消</el-button>
          <el-button :loading="createTaskLoading" type="primary" @click="addTasks">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { needScene } from '@/api/assets'
import { getLinks } from '@/api/links'
import { getDept } from '@/api/admin'
import { addTask } from '@/api/task'
import myMixin from '@/views/projects/components/mixins'
export default {
  mixins: [myMixin],
  data() {
    return {
      sceneNeed: [],
      value1: false,
      assetId: null,
      assetName: null,
      isCreateTaskShow: false,
      TaskForm: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          }
        ],
        priority: [
          {
            required: true,
            message: '请输入优先等级',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入任务内容',
            trigger: 'blur'
          }
        ],
        executorlist: [
          {
            required: true,
            message: '请输入任务执行人',
            trigger: 'blur'
          }
        ],
        total_hour: [
          {
            required: true,
            message: '请输入总工时',
            trigger: 'blur'
          }
        ],
        datetime: [
          {
            required: true,
            message: '请输入任务时间',
            trigger: 'blur'
          }
        ]
      },
      DeptUsers: [],
      linkstart: null,
      linkend: null,
      createTaskLoading: false
    }
  },
  created() {
    this.getScene()
  },
  methods: {
    change() {
      this.$forceUpdate()
    },
    // 总工时默认值
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString() // 'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24)
      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour
      }
    },
    // 给某一环节添加任务
    addTasks() {
      this.$refs['TaskForm'].validate(valid => {
        if (valid) {
          this.createTaskLoading = true
          function dataFormat(params) {
            return new Date(params).toLocaleDateString() // 'yyyy/mm/dd hh:mm:ss'
          }
          const data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          }
          if (this.TaskForm.executorlist.length) {
            data['executorlist'] = data['executorlist'].join()
          }
          delete data.datetime
          addTask(data)
            .then(({ data }) => {
              this.createTaskLoading = false
              this.$message.success(data.msg)
              if (data.status === 0) {
                this.cancelTask()
                this.isDialogShow = false
                this.value1 = false
                this.getScene()
              }
            })
            .catch(err => {
              this.createTaskLoading = false
            })
        } else {
          return false
        }
      })
    },
    // 取消对话框
    cancelTask() {
      this.isCreateTaskShow = false
      this.TaskForm = {}
    },
    showTaskForm(link_id, dept_id, content, date_and_user) {
      getDept({
        id: dept_id
      }).then(res => {
        this.DeptUsers = [...res.data.users]
        // console.log(this.DeptUsers);
      })
      this.isCreateTaskShow = true
      this.TaskForm = Object.assign(
        {},
        {
          priority: 0,
          grade: 7,
          asset: this.assetId,
          project: this.$route.params.id,
          link_id,
          content
        }
      )
      const linkdatastart = date_and_user.date_start
      const linkdataend = date_and_user.date_end
      this.linkstart = linkdatastart
      this.linkend = linkdataend
      // const data = this.assetTaskList.filter(item => {
      //   return item.asset.id === this.TaskForm.asset;
      // });
      this.TaskForm.name = this.assetName
    },
    showDrawer(row) {
      this.assetId = row.id
      this.assetName = row.name

      getLinks({ asset: row.id }).then(({ data }) => {
        this.$emit('changeLinks', data.msg)
      })
    },
    getScene() {
      const payload = {
        tag: 0,
        pagenum: 5,
        page: 1
      }
      needScene(payload).then(({ data }) => {
        this.sceneNeed = [...data.msg]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.links {
  cursor: pointer;
  color: #2d8cf0;
}
</style>
