<template>
  <div id="links">
    <template v-if="!LinkTemplateList.length">
      <el-button icon="el-icon-plus" type="primary" @click="showLinkWKForm">添加审批流程</el-button>
    </template>
    <template v-else>
      <el-button icon="el-icon-edit" type="success" @click="editLinkWKForm">修改审批流程</el-button>
      <el-button icon="el-icon-delete" type="danger" @click="delLinkWKForm(LinkTemplateList)">删除审批流程</el-button>
      <el-steps direction="vertical" :active="1" :space="180">
        <el-step v-for="(item,index) of LinkTemplateList" :key="index" status="process">
          <div slot="title" style="font-size:14px">{{index+1|WKLevel}}</div>
          <ul slot="description" style="width:200px;">
            <el-row style="font-size:16px;font-weight:400;padding-top:20px">
              <span>审批角色：{{item.entity_id.role_name}}</span>
            </el-row>
          </ul>
        </el-step>
      </el-steps>
    </template>
    <el-dialog title="添加审批流程" :visible.sync="isDrawerShow" width="514px" center :modal="false">
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'审批级别' + (index+1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{
      required: true, message: '审批角色不能为空', trigger: 'blur'
    }"
        >
          <el-select v-model="domain.value" filterable  placeholder="请选择">
            <el-option
              v-for="(item,index) in rolesList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="addDomain">新增审批级别</el-button>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改审批流程" :visible.sync="isUpdateShow" width="514px" center :modal="false">
      <el-form :model="updateForm" label-width="100px" class="demo-dynamic" ref="updateForm">
        <el-form-item
          v-for="(item,index) of updateForm.domains"
          :label="'审批级别'+ (index+1)"
          :key="item.key"
          :prop="'domains.' + index + '.value'"
          
          
        >
          <el-select v-model="item.value" filterable  placeholder="请选择" @change="rolesListChange">
            <el-option
              v-for="(todo,index) in rolesList"
              :key="index"
              :label="todo.name"
              :value="todo.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel2">取消</el-button>
          <el-button type="primary" @click="update('updateForm')">立即修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  getWKTemplate,
  addWKTemplate,
  updateWKTemplate,
  deleteWKTemplate
} from "@/api/admin";
export default {
  name: "links",
  data() {
    return {
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      isDrawerShow: false,
      isUpdateShow: false,
      rolesList: [],
      value: "",
      updateList: null,
      updateForm: {
        domains: [
          {
            value: ""
          }
        ]
      }
    };
  },
  props: ["LinkTemplateList", "deptId", "deptName"],
  computed: {},
 
  methods: {
    rolesListChange(item){
       this.$forceUpdate();

        // console.log(item);
    },
    showLinkWKForm() {
      this.isDrawerShow = true;
      //获取角色列表
      getRoles().then(({ data }) => {
        this.rolesList = [...data.msg];
        //console.log(this.rolesList);
      });
    },
    cancel() {
      this.isDrawerShow = false;
    },
    cancel2() {
      this.isUpdateShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dynamicValidateForm.domains.forEach((item, index) => {
            this.dynamicValidateForm.domains[index] = Object.assign(
              {},
              {
                role_id: this.dynamicValidateForm.domains[index].value,
                level: index + 1
              }
            );
          });
          const msg = {
            rule: [...this.dynamicValidateForm.domains],
            dept: this.deptId
          };
          console.log(msg);
          addWKTemplate(msg)
            .then(({ data }) => {
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.$emit("refresh");
                this.isDrawerShow = false;
                this.dynamicValidateForm.domains.value = "";
              } else {
                this.$message.error(data.msg);
              }
            })
            .catch(() => {});
        }
      });
    },
    update(formWKName) {
          this.updateForm.domains.forEach((item, index) => {
            this.updateForm.domains[index] = Object.assign(
              {},
              {
                role_id: this.updateForm.domains[index].value,
                level: index + 1
              }
            );
          });
          const msg = {
            method:"put",
            rule: [...this.updateForm.domains],
            id: this.LinkTemplateList[0].id
          };
          console.log(msg);
          updateWKTemplate(msg)
            .then(({ data }) => {
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.$emit("refresh");
                this.isUpdateShow = false;
               
              } else {
                this.$message.error(data.msg);
              }
            })
            .catch(() => {});
      
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== 0) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    //展示修改审批流程
    editLinkWKForm() {
      this.isUpdateShow = true;
      getWKTemplate({
        dept: this.deptId
      }).then(({ data }) => {
        this.updateList = [...data.msg];
        this.updateList.forEach((item, index) => {
          this.updateForm.domains[index] = Object.assign(
            {},
            {
              value: this.updateList[index].entity_id.role_id
            }
          );
        });
      });
      
        //console.log(this.updateForm);
      //获取角色列表
      getRoles().then(({ data }) => {
        this.rolesList = [...data.msg];
        // console.log(this.rolesList);
      });
    },
    //删除审批流程
    delLinkWKForm(LinkTemplateList) {
      const id = LinkTemplateList[0].id;
      this.$confirm("删除模板后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteWKTemplate({
          method: "delete",
          id: id
        }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

