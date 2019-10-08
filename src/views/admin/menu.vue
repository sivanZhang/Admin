<template>
  <div id="menu">
    <el-tabs tab-position="left" style="height: ;overflow: auto;padding-top:10px">
      <el-tab-pane label="正式成员" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:35%;padding:3px">
            <div style="display:flex">
              <el-form
                ref="saveForm"
                :label-position="labelPosition"
                label-width="100px"
                :model="saveForm"
                :rules="saveRules"
                class="save-form"
              >
                <el-form-item label="上班时间" prop="official_worktime_on">
                  <el-time-select
                    v-model="saveForm.official_worktime_on"
                    :picker-options="{
                    start:'00:00',
                    step:'00:15',
                    end:'24:00'
                }"
                    placeholder="上班时间"
                    name="official_worktime_on"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="下班时间" prop="official_worktime_off">
                  <el-time-select
                    v-model="saveForm.official_worktime_off"
                    :picker-options="{
                    start:'00:00',
                    step:'00:15',
                    end:'24:00',
                    minTime:saveForm.official_worktime_on
                }"
                    placeholder="下班时间"
                    name="official_worktime_off"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="工时" prop="official_worktime_long">
                  <el-input
                    ref="official_worktime_long"
                    v-model="saveForm.official_worktime_long"
                    type="text"
                    placeholder="工时"
                    name="official_worktime_long"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="save(1)">保存</el-button>
                  <el-button @click="resetForm('saveForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- <div style="width:65%;padding-top:3px">
            <el-row>
              <el-col :span="14">
                <el-checkbox-group v-model="counterNum">
                  <el-checkbox label="考勤"></el-checkbox>
                  <el-checkbox label="评分"></el-checkbox>
                  <el-checkbox label="提交时间"></el-checkbox>
                  <el-checkbox label="任务排名"></el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col :span="10">
                <el-button type="primary" @click="counter(1)">总排名</el-button>
              </el-col>
            </el-row>
          </div> -->
          <div style="width:65%;padding-top:3px">
            <div style="display:flex">
              <el-table>
                <el-table-column label="正式成员"></el-table-column>
                <el-table-column label="考勤" align="center">
                  <el-table-column label="上班时间" ></el-table-column>
                  <el-table-column label="下班时间"></el-table-column>
                  <el-table-column label="工时(小时)"></el-table-column>
                </el-table-column>
                <el-table-column label="评分"></el-table-column>
                <el-table-column label="提交时间"></el-table-column>
                <el-table-column label="任务排名"></el-table-column>
                <el-table-column label="总排名"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实训成员">
        <div style="display:flex">
          <div style="width:35%;padding:3px">
            <div style="display:flex">
              <el-form
                ref="saveForm1"
                :label-position="labelPosition"
                label-width="100px"
                :model="saveForm1"
                :rules="saveRules1"
                class="save-form"
              >
                <el-form-item label="上班时间" prop="training_worktime_on">
                  <el-time-select
                    v-model="saveForm1.training_worktime_on"
                    :picker-options="{
                    start:'00:00',
                    step:'00:15',
                    end:'24:00'
                }"
                    placeholder="上班时间"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="下班时间" prop="training_worktime_off">
                  <el-time-select
                    v-model="saveForm1.training_worktime_off"
                    :picker-options="{
                    start:'00:00',
                    step:'00:15',
                    end:'24:00',
                    minTime:saveForm1.training_worktime_on
                }"
                    placeholder="下班时间"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="工时" prop="training_worktime_long">
                  <el-input
                    ref="training_worktime_long"
                    v-model="saveForm1.training_worktime_long"
                    type="text"
                    placeholder="工时"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading1" @click="save(2)">保存</el-button>
                  <el-button @click="resetForm('saveForm1')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="width:65%;padding-top:3px">
          <el-row>
            <el-col :span="14">
              <el-checkbox-group v-model="counterNum">
                <el-checkbox label="考勤" prop="attendance"></el-checkbox>
                <el-checkbox label="评分" prop="score"></el-checkbox>
                <el-checkbox label="提交时间" prop="submit_time"></el-checkbox>
                <el-checkbox label="任务排名" prop="range"></el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="counter">总排名</el-button>
            </el-col>
          </el-row>
          </div>
          <!-- <div style="width:65%;padding-top:3px">
          <div style="display:flex">
            <el-table>
              <el-table-column label="实训成员"></el-table-column>
              <el-table-column label="考勤" align="center">
                <el-table-column label="上班时间"></el-table-column>
                <el-table-column label="下班时间"></el-table-column>
                <el-table-column label="工时"></el-table-column>
              </el-table-column>
              <el-table-column label="评分"></el-table-column>
              <el-table-column label="提交时间"></el-table-column>
              <el-table-column label="任务排名"></el-table-column>
              <el-table-column label="总排名"></el-table-column>
            </el-table>
          </div>
          </div>-->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

  <script>
import { officialWorktime, trainingWorktime, rankList } from "@/api/admin";
export default {
  data() {
    name = "menu";
    return {
      saveForm: {},
      saveForm1: {},
      counterNum: [],
      labelPosition: "right",
      saveRules: {
        official_worktime_on: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上班时间"
          }
        ],
        official_worktime_off: [
          {
            required: true,
            trigger: "blur",
            message: "请输入下班时间"
          }
        ],
        official_worktime_long: [
          {
            required: true,
            trigger: "blur",
            message: "请输入工时"
          }
        ]
      },
      saveRules1: {
        training_worktime_on: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上班时间"
          }
        ],
        training_worktime_off: [
          {
            required: true,
            trigger: "blur",
            message: "请输入下班时间"
          }
        ],
        training_worktime_long: [
          {
            required: true,
            trigger: "blur",
            message: "请输入工时"
          }
        ]
      },
      loading: false,
      loading1: false
    };
  },
  methods: {
    //排名权重计算
    counter() {
        rankList({ training_range: "" ,...this.counterNum}).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    //成员的上下班和工时设置
    save(Type) {
      //正式成员设置
      if (Type == 1) {
        this.$refs["saveForm"].validate(valid => {
          if (valid) {
            this.loading = true;
            officialWorktime({ official_worktime: "" }).then(({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.loading = false;
                this.$refs["saveForm"].resetFields();
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
      //实训成员设置
      if (Type == 2) {
        this.$refs["saveForm1"].validate(valid => {
          if (valid) {
            this.loading1 = true;
            trainingWorktime({ training_worktime: "" }).then(({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.loading1 = false;
                this.$refs["saveForm1"].resetFields();
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>