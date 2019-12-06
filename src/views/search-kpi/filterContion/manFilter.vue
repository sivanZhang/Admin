<!-- 任务多条件筛选时的筛选条件 -->
<template>
  <div
    style="display:flex;padding-top:10px;overflow-x:auto;height:45px"
    class="tags-view-container"
  >
    <label for style="width:80px">筛选条件：</label>
    <scroll-pane class="tags-view-wrapper">
      <div
        class="tags-view-item"
        :class="showMulChoose.assetname?'active':''"
        v-if="showMulChoose.assetname&&selShowAssetName"
      >
        镜头号：{{showMulChoose.assetname}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('assetname')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.episode?'active':''"
        v-if="showMulChoose.episode&&selShowEpisode"
      >
        集数：{{showMulChoose.episode}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('episode')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.session?'active':''"
        v-if="showMulChoose.session&&selShowSession"
      >
        场次：{{showMulChoose.session}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('session')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.name?'active':''"
        v-if="showMulChoose.name&&selShowName"
      >
        任务名称：{{showMulChoose.name}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('name')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.dept&&selShowDept"
        :class="showMulChoose.dept?'active':''"
      >
        制作环节：{{showMulChoose.dept}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('dept')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.start&&selStart"
        :class="showMulChoose.start?'active':''"
      >
        开始日期：{{showMulChoose.start}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('start')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.end&&selEnd"
        :class="showMulChoose.end?'active':''"
      >
        结束日期：{{showMulChoose.end}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('end')"
        />
      </div>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from "@/layout/components/TagsView/ScrollPane";
export default {
  name: "taskFilter",
  components: { ScrollPane },
  data() {
    return {
      selShowMonthNum: true,
      selShowDeptId: true,
      selShowUserId: true,
      selStart: true,
      selEnd: true,
      showMulChoose: [],
      sortSelForm: {}
    };
  },
  watch: {},
  methods: {
    filterCondition(showMulChoose, sortSelForm) {
      this.showMulChoose = showMulChoose;
      this.sortSelForm = sortSelForm;
    },
    //删除筛选条件，剩余条件再搜索
    closeSelectedTag(tag) {
      switch (tag) {
        case "month_num":
          delete this.sortSelForm.month_num;
          this.selShowMonthNum = false;
          break;
        case "dept_id":
          delete this.sortSelForm.dept_id;
          this.selShowDeptId = false;
          break;
        case "user_id":
          delete this.sortSelForm.user_id;
          this.selShowUserId = false;
          break;
        case "start_date":
          delete this.sortSelForm.start_date;
          this.selStart = false;
          break;
        case "end_date":
          delete this.sortSelForm.end_date;
          this.selEnd = false;
          break;
      }
      this.$emit("refresh_close", this.sortSelForm);
    },
    //重置筛选条件
    showMul() {
      this.selShowMonthNum = true;
      this.selShowDeptId = true;
      this.selShowUserId = true;
      this.selStart = true;
      this.selEnd = true;
      this.showMulChoose = [];
      this.sortSelForm = {};
    }
  },
  created() {}
};
</script>
<style lang="scss" scope>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>