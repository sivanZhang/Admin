<!-- 自定义属性绑定 -->
<template>
  <div id="attr_bind" style="border-top:2px #999999 solid;padding-top:5px">
    <el-button type="primary" @click="showDialog()" style="margin-bottom:10px">自定义属性绑定</el-button>

    <el-table
      :data="customAttrs"
      ref="attrsList"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="{borderRight:0}"
      highlight-current-row
      :border="false"
    >
      <el-table-column label="属性名" prop="attr_name"></el-table-column>
      <el-table-column label="属性值" prop="attr_value">
        <template slot-scope="scope" >
          <el-input
            size="small"
            v-model="scope.row.attr_value"
            placeholder="请输入属性值"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.attr_value}}</span>
          </el-input>
          <span v-if="!editing||clickId !== scope.row.id">{{scope.row.attr_value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认值" prop="atr_default"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              icon="el-icon-edit"
              style="color:green"
              type="text"
              v-if="!editing||clickId !== scope.row.id"
              @click="putAttrtsEntity(scope.row,1)"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="确认" placement="top">
            <el-button
              v-if="editing&&clickId === scope.row.id"
              type="text"
              icon="el-icon-check"
              style="color:green"
              @click="putAttrtsEntity(scope.row,2)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="解绑" placement="top">
            <el-button
              icon="el-icon-delete"
              style="color:red"
              type="text"
              @click="removeBind(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="isDialog">
      <div style="margin-top:20px;border:1px solid">
        <div style="padding-top:10px">
          <el-form :model="bindForm" label-width="90px">
            <el-form-item label="属性类型" prop="attr_type">
              <el-select v-model="bindForm.attr_type" @change="entityNameChoose()">
                <el-option
                  v-for="(item,index) of entityTpe"
                  :key="index"
                  :label="item.type"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性名称" prop="attr_name">
              <el-select v-model="bindForm.attr_name">
                <el-option
                  v-for="(item,index) of EntityName"
                  :key="index"
                  :label="item.attr_name"
                  :value="item.attr_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性值" prop="attr_value">
              <template v-if="this.bindForm.attr_type&&(this.bindForm.attr_type <=2) ">
                <el-input v-model="bindForm.attr_value"></el-input>
              </template>
              <template v-if="this.bindForm.attr_type&&this.bindForm.attr_type === 3">
                <el-date-picker v-model="bindForm.attr_value" type="date" placeholder="选择日期时间"></el-date-picker>
              </template>
              <template v-if="this.bindForm.attr_type&&this.bindForm.attr_type === 4">
                <el-radio-group v-model="bindForm.attr_value">
                  <el-radio :label="0">false</el-radio>
                  <el-radio :label="1">true</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveAttrs">立即绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  createAttrsEntity,
  delAttrsEntity,
  updateAttrsEntity
} from "@/api/attrs";
export default {
  name: "attr_bind",
  components: {},
  props: ["project", "customAttrs", "attrsList", "attrsTypeNum"],
  data() {
    return {
      bindForm: {},
      entityTpe: [
        {
          type: "NUMBER（数字）",
          value: 1
        },
        {
          type: "CHARACTER（字符）",
          value: 2
        },
        {
          type: "DATE（日期）",
          value: 3
        },
        {
          type: "BOOLEAN（布尔值）",
          value: 4
        },
        {
          type: "ENUMERATE（枚举）",
          value: 5
        }
      ],
      EntityName: [],
      isDialog: false,
      editing: false,
      clickId: null,
      iconShow: false
    };
  },
  watch: {},
  methods: {
    //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
      this.rowClick = true;
    },
    //修改属性实体
    putAttrtsEntity(row, Type) {
      if (Type === 1) {
        if (this.iconShow === true) {
          this.$confirm("当前修改未保存", "注意", {
            type: "warning"
          });
        } else {
          this.editing = true;
          this.clickId = row.id;
        }
      } else {
        //console.log(row)
        updateAttrsEntity({ value: row.attr_value, method: "put", id: row.id })
          .then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("refresh_customAttrs");
              this.editing = false;
            } else {
              this.$message.error(data.msg);
              this.editing = false;
            }
          })
          .catch(res => {});
      }
    },
    showDialog() {
      this.isDialog = true;
    },
    saveAttrs() {
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.bindForm.attr_type === 3) {
        this.bindForm.attr_value = dateFormat(this.bindForm.attr_value);
      }
      let data = {
        attr_type: this.bindForm.attr_type,
        attr_name: this.bindForm.attr_name,
        attr_value: this.bindForm.attr_value,
        entity_id: this.project.id,
        entity_type: this.attrsTypeNum
      };

     // console.log(data);
      createAttrsEntity(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$emit("refresh_customAttrs");
          this.isDialog = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    entityNameChoose() {
      this.EntityName = [];
      //console.log(this.attrsList)
      this.attrsList.forEach(item => {
        if (item.attr_type === this.bindForm.attr_type) {
          this.EntityName.push(item);
        }
      });
    },
    removeBind(id) {
      this.$confirm("此操作将永久解绑属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delAttrsEntity({ id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$emit("refresh_customAttrs");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>