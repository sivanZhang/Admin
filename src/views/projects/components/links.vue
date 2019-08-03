<template>
  <div id="links">
    <template v-if="!LinkList.length">
      <el-button icon="el-icon-plus" type="primary" @click="showLinksForm">添加环节</el-button>
    </template>
    <template v-else>
      <el-steps direction="vertical" :active="1" :space="180">
        <el-step v-for="item of LinkList" :key="item.link_id" status="process">
          <div slot="title" style="font-size:14px">{{item.dept.name}}</div>
          <ul slot="description" style="width:400px;">
            <li>
              制作要求: {{item.content}}
            </li>
            <template>
              <li>
              开始日期: {{item.date_and_user.date_start?new Date(item.date_and_user.date_start*1000).toLocaleDateString():''}}
            </li>
            <li>
              截止日期: {{item.date_and_user.date_end?new Date(item.date_and_user.date_end*1000).toLocaleDateString():''}}
            </li>
            </template>
          </ul>
        </el-step>
      </el-steps>
    </template>
    <el-dialog title="添加环节" :visible.sync="isDrawerShow" width="512px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="20">
          <el-form :model="item" label-width="80px">
            <el-form-item
              label="环节内容"
              prop="content"
              :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
            >
              <el-input type="textarea" v-model="item.content" style="width:100%"></el-input>
            </el-form-item>
            <el-form-item
              label="当前工种"
              prop="dept"
              :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
            >
              <el-cascader
                v-model="item.dept"
                placeholder="输入搜索工种"
                :options="selectList"
                :props="{ checkStrictly: true}"
                filterable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="时间" prop="datetime">
              <el-date-picker
                v-model="item.datetime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <el-divider />
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addLinks } from "@/api/links";
export default {
  name: "links",
  data() {
    return {
      isDrawerShow: false,
      LinkForm: {},
      createLoading: false,
      selectList: [],
      FormList: [{}]
    };
  },
  props: ["LinkList", "assetId"],
  computed: {
    DeptList() {
      return this.$store.state.admin.DeptList;
    }
  },
  methods: {
    before(ind) {
      this.FormList.splice(ind, 0, {});
    },
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
    },
    showLinksForm() {
      this.isDrawerShow = true;
    },
    cancel() {
      this.isDrawerShow = false;
    },
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.assetId
        });

        if (
          "datetime" in this.FormList[index] &&
          this.FormList[index].datetime.length
        ) {
          this.FormList[index] = {
            ...this.FormList[index],
            date_start: dataFormat(this.FormList[index].datetime[0]),
            date_end: dataFormat(this.FormList[index].datetime[1])
          };
          delete this.FormList[index].datetime;
        }
        if (index === 0) {
          this.FormList[index].pid = 0;
        } else {
          this.FormList[index].pid = this.FormList[index - 1].dept;
        }
      });
      this.createLoading = true;
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      addLinks({ links: [...this.FormList] })
        .then(({ data }) => {
          this.createLoading = false;
          this.$message(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
            this.isDialogShow = false;
          }
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.selectList);
    }
  },
  async created() {
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

