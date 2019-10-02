<!--  -->
<template>
  <div id="team-manager">
    <el-tabs v-model="activeName">
      <el-tab-pane label="未分配镜头" name="first">
        <el-table
          ref="scene"
          :data="scene"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :cell-style="{borderRight:0}"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :row-key="(row)=>{ return row.id}"
          :border="false"
        >
          <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="镜头号" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="缩略图" prop="image">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.image"
                style="width: 48px;height: 27px;cursor: pointer;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="session" label="场次" align="center"></el-table-column>
          <el-table-column prop="episode" label="集数" align="center"></el-table-column>
          <el-table-column prop="frame" label="帧数" align="left"></el-table-column>
          <el-table-column prop="frame_range" label="帧数范围" align="left" width="120px"></el-table-column>
          <el-table-column prop="reference" label="制作参考" align="left" width="120px"></el-table-column>
          <el-table-column prop="report" label="画面调整信息" align="left" width="120px"></el-table-column>
          <el-table-column prop="retime" label="变速信息" align="left"></el-table-column>
          <el-table-column prop="content" label="制作内容" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
          </el-table-column>
          <el-table-column prop="level" label="难度等级">
            <template slot-scope="scope">{{scope.row.level|Level}}</template>
          </el-table-column>
          <el-table-column
            label="创建日期"
            align="left"
            width="160px"
            v-if="show_create_date"
            prop="date"
            class-name="date"
            sortable="custom"
          >
            <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hours" label="总工时" align="left" v-if="show_total_hours"></el-table-column>
          <el-table-column prop="remark" label="备注" align="left"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已分配镜头" name="second">
        <el-table
          ref="sceneUnneed"
          :data="sceneUnneed"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :cell-style="{borderRight:0}"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :row-key="(row)=>{ return row.id}"
          :border="false"
        >
          <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="镜头号" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="缩略图" prop="image">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.image"
                style="width: 48px;height: 27px;cursor: pointer;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="session" label="场次" align="center"></el-table-column>
          <el-table-column prop="episode" label="集数" align="center"></el-table-column>
          <el-table-column prop="frame" label="帧数" align="left"></el-table-column>
          <el-table-column prop="frame_range" label="帧数范围" align="left" width="120px"></el-table-column>
          <el-table-column prop="reference" label="制作参考" align="left" width="120px"></el-table-column>
          <el-table-column prop="report" label="画面调整信息" align="left" width="120px"></el-table-column>
          <el-table-column prop="retime" label="变速信息" align="left"></el-table-column>
          <el-table-column prop="content" label="制作内容" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
          </el-table-column>
          <el-table-column prop="level" label="难度等级">
            <template slot-scope="scope">{{scope.row.level|Level}}</template>
          </el-table-column>
          <el-table-column
            label="创建日期"
            align="left"
            width="160px"
            v-if="show_create_date"
            prop="date"
            class-name="date"
            sortable="custom"
          >
            <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hours" label="总工时" align="left" v-if="show_total_hours"></el-table-column>
          <el-table-column prop="remark" label="备注" align="left"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { allocationScene } from "@/api/assets";
export default {
  name: "team-manager",
  components: {},
  data() {
    return {
      activeName: "first",
      sceneNeed: [],
      sceneUnneed: []
    };
  },
  watch: {},
  methods: {
    getScene() {
      allocationScene().then(({ data }) => {
        this.sceneNeed = [...data.need];
        this.sceneUnneed = [...data.not_need];
      });
    },
    //难度等级格式化显示
    Level: function(row, column) {
      switch (row.level) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "复杂";
          break;
        case 3:
          return "高难度";
          break;
      }
    },
    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    }
  },
  created() {
    this.getScene();
  }
};
</script>
<style lang='scss' scoped>
</style>