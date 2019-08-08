<template>
  <div id="layout_main">
    <top :arr="topArr" />
    <el-divider></el-divider>
    <el-tabs>
      <el-tab-pane label="任务板">
        <div>
          <el-row>
            <el-col :span="18" class="list">
              <span class="svg-container" title="显示小型网格布局">
                <svg-icon icon-class="list_min"></svg-icon>
              </span>
              <span class="svg-container" title="大型网格布局">
                <svg-icon icon-class="list_max"></svg-icon>
              </span>
              <el-select
                v-model="value1"
                multiple
                placeholder="任何项目"
                size="mini"
                collapse-tags
                style="margin-left: 20px;"
              >
                <el-option
                  v-for="item in taskList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="value2"
                multiple
                collapse-tags
                style="margin-left: 20px;"
                placeholder="任何备注"
                size="mini"
              >
                <el-option
                  v-for="item in taskProgress"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="fold-icon">
              <svg-icon icon-class="fold" @click="taskBoardRightShow"></svg-icon>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="space-between" :gutter="15">
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">草稿</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  :list="DraftArr"
                  :group="{name:'task'}"
                  :move="checkMove"
                  class="board-column-content"
                >
                  <transition-group>
                    <el-card
                      @click.native="openDialog(item)"
                      :style="{margin:'10px 0'}"
                      v-for="item of DraftArr"
                      :key="item.id"
                      shadow="never"
                      :body-style="{backgroundColor:'#909399',color:'#fff',padding:'15px'}"
                    >{{item.name}}</el-card>
                  </transition-group>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">进行中</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  :list="InProgressArr"
                  :group="{name:'task'}"
                  :move="checkMove"
                  class="board-column-content"
                >
                  <!-- ($event,1) -->
                  <transition-group>
                    <el-card
                      @click.native="openDialog(item)"
                      :style="{margin:'10px 0'}"
                      v-for="item of InProgressArr"
                      :key="item.id"
                      shadow="never"
                      :body-style="{backgroundColor:'#67C23A',color:'#fff',padding:'15px'}"
                    >{{item.name}}</el-card>
                  </transition-group>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">完成</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  :list="FinishedArr"
                  :group="{name:'task'}"
                  :move="checkMove"
                >
                  <transition-group>
                    <el-card
                      :style="{margin:'10px 0'}"
                      v-for="item of FinishedArr"
                      :key="item.id"
                      shadow="never"
                      :body-style="{backgroundColor:'#E6A23C',color:'#fff',padding:'15px'}"
                    >{{item.name}}</el-card>
                  </transition-group>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">超时</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  :list="TimeOutArr"
                  :group="{name:'task'}"
                  :move="checkMove"
                >
                  <transition-group>
                    <el-card
                      :style="{margin:'10px 0'}"
                      v-for="item of TimeOutArr"
                      :key="item.id"
                      shadow="never"
                      :body-style="{backgroundColor:'#F56C6C',color:'#fff',padding:'15px'}"
                    >{{item.name}}</el-card>
                  </transition-group>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="4">暂停</el-col>
                  <el-col :span="20" style="text-align:right">
                    <span class="sort">排序方式</span>
                    <el-select v-model="notStartedSel" placeholder="截止日期" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  :list="PauseArr"
                  :group="{name:'task'}"
                  :move="checkMove"
                >
                  <transition-group>
                    <el-card
                      :style="{margin:'10px 0'}"
                      v-for="item of PauseArr"
                      :key="item.id"
                      shadow="never"
                      :body-style="{backgroundColor:'#F56C6C',color:'#fff',padding:'15px'}"
                    >{{item.name}}</el-card>
                  </transition-group>
                </draggable>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务列表">
        <div class="task-list"></div>
        <div class="task-list-top">
          <span class="sort">排序方式</span>
          <el-select v-model="taskListSortSel" placeholder="截止日期" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--              select选择器，任务列表中选择项目，默认选择所有-->
          <el-select
            v-model="taskListProgramSel"
            multiple
            placeholder="任何项目"
            size="mini"
            collapse-tags
            style="margin-left: 20px;"
          >
            <el-option
              v-for="item in taskList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--              select选择器，任务列表中选择任务完成进度，默认选择所有-->
          <el-select
            v-model="taskListProgressSel"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="任何备注"
            size="mini"
          >
            <el-option
              v-for="item in taskProgress"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-checkbox v-model="checked">显示已完成/锁定的项目</el-checkbox>
        </div>
        <el-table
          :data="MyTaskList"
          style="width: 100%;margin-top:20px"
          highlight-current-row
          row-key="id"
          :tree-props="{ children: 'sub_task' }"
          borders
        >
          <!-- default-expand-all -->
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="content" label="任务内容"></el-table-column>
          <el-table-column label="任务状态">
            <template slot-scope="scope">
              <!-- <div class="status">
                {{scope.row.status|projectStatus}}
                <icon class="el-icon-edit" />
              </div>
              -->
              <el-select
                :value="scope.row.status"
                placeholder="请选择"
                @change="statusChange($event,scope.row)"
                class="my-select"
              >
                <el-option
                  v-for="item in StatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="优先级">
            <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
          </el-table-column>
          <el-table-column label="开始日期">
            <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="end_date" label="截止日期">
            <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="任务执行" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <task-form :task-record.sync='TaskRecord' :createLoading="createLoading" @addRecord="addRecord" @cancel="cancel"/>
    </el-dialog>
  </div>
</template>

<script src="./task.js">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped src="./task.scss"></style>
