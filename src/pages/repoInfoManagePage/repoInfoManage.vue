<template lang="">
    <div>
      <el-button type="primary" @Click="openDialog">新增仓库</el-button>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="repository_id" label="仓库ID" width="180" />
            <el-table-column prop="repository_name" label="仓库名字" width="180" />
            <el-table-column prop="repository_address" label="仓库地址" width="180" />
            <el-table-column prop="repository_catgory" label="仓库类别" width="180" />
            <el-table-column prop="description" label="描述" width="180" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" style="width: 400px" placeholder="Type to search account" clearable/>
                <el-button type="primary" style="margin-left: 10px" @Click="searchFun">搜 索</el-button>
              </template>
              <template #default="scope">
  <el-button round type="primary" @click="handleEdit(scope.$index, scope.row)"
    >修改</el-button
  >
  <el-button round type="danger" @click="handleDelete(scope.$index, scope.row)"
    >删除</el-button
  >
</template>
            </el-table-column>
        </el-table>
    </div>
    <div>
        <el-pagination background layout="prev, pager, next" :total="pageInfo.totalPage" v-model:currentPage="pageInfo.page"
          @current-change="handleCurrentPage" 
        />
    </div>

    <el-dialog
      title="仓库信息"
      v-model="editView"
      width="30%">
      <el-form v-loading="EditLoading" 
      ref="ruleFormRef"
      :model="EditData"
      :rules="rules">
        <el-form-item prop="repository_name">
          <el-input class="edit_input" v-model="EditData.repository_name" placeholder="仓库名：" maxlength="20" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item prop="repository_address">
          <el-input class="edit_input" v-model="EditData.repository_address" placeholder="仓库地址：" maxlength="30" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item prop="repository_catgory">
          <el-input class="edit_input" v-model="EditData.repository_catgory" placeholder="仓库类别：" maxlength="10"  show-word-limit  clearable></el-input>
        </el-form-item>      
        <el-form-item prop="description">
          <el-input class="edit_input" v-model="EditData.description" placeholder="仓库描述" maxlength="30"  show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button :disabled="disbutton" type="primary" @click="switchFun(ruleFormRef)" 
              >{{str}}</el-button
            >
          <el-button :disabled="disbutton" @click="editView = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { User } from "@element-plus/icons-vue/dist/types";
import { DOMNodeTransforms } from "@vue/compiler-dom";
import axios from "axios";
import { ElLoading, ElMessageBox, ElTable, ElMessage } from "element-plus";
import { fa, tr } from "element-plus/lib/locale";
import { serve } from "esbuild";
import type { FormInstance, FormRules } from "element-plus";
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  toRef,
  toRefs,
} from "vue-demi";
import store from "../../store";
import router from "../../router";

interface Repo {
  repository_id: string;
  repository_name: string;
  repository_address: string;
  repository_catgory: string;
  description: string;
}

interface IData {
  tableData: Repo[];
}
const data = reactive<IData>({
  tableData: [],
});

const currentData = reactive<Repo>({
  repository_id: "",
  repository_name: "",
  repository_address: "",
  repository_catgory: "",
  description: "",
});

const EditData = reactive({
  repository_id: "",
  repository_name: "",
  repository_address: "",
  repository_catgory: "",
  description: "",
});

const search = ref("");

const EditLoading = ref(false);

const disbutton = ref(false);

const editView = ref(false);

const str = ref("");

const rules = reactive<FormRules>({
  repository_name: [
    { required: true, message: "请输入仓库名字", trigger: "blur" },
    {
      min: 2,
      max: 30,
      message: "仓库名字长度须在2-30个字符之间",
      trigger: "blur",
    },
  ],
  repository_address: [
    { required: true, message: "请输入仓库地址", trigger: "blur" },
    {
      min: 2,
      max: 30,
      message: "仓库地址长度须在2-30个字符之间",
      trigger: "blur",
    },
  ],
  repository_catgory: [
    { required: true, message: "请输入仓库类别", trigger: "blur" },
    {
      min: 1,
      max: 20,
      message: "仓库类别长度须在1-20个字符之间",
      trigger: "blur",
    },
  ],
  description: [
    { required: true, message: "请输入仓库描述", trigger: "blur" },
    {
      min: 2,
      max: 30,
      message: "仓库描述长度须在2-30个字符之间",
      trigger: "blur",
    },
  ],
});

const ruleFormRef = ref<FormInstance>();

//页面数据，用于分页
/**
 * currentPage 当前页数
 * row 指定一页多少行
 * totalPage 指定总共页数（在表里面是*10的结果才行，比如2页就是20，3页就是30）
 */
const pageInfo = reactive({
  currentPage: 0,
  row: 10,
  totalPage: 0,
});
//被切割后的数据，这里面就是页面显示的数据
const pageData = reactive({
  completeData: [],
});

const openDialog = () => {
  str.value = "添 加";
  editView.value = true;
};

const UpdateProduct = async () => {
  str.value = "修 改";
  editView.value = true;
};

const deleteRepo = async () => {
  ElMessageBox.confirm("确认删除?").then(async () => {
    const res = await axios({
      url: "http://localhost:8080/repo/deleteRepo",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        repository_id: currentData.repository_id,
        repository_name: currentData.repository_name,
        repository_address: currentData.repository_address,
        repository_catgory: currentData.repository_catgory,
        description: currentData.description,
      },
    }).then(function (response) {
      console.log(response);
      disbutton.value = true;
      EditLoading.value = true;
      if (response.data == "删除成功") {
        ElMessage({
          message: "删除成功",
          type: "success",
        });
        setTimeout(() => {
          disbutton.value = false;
          EditLoading.value = false;
          router.go(0);
        }, 750);
      } else {
        ElMessage({
          message: "删除失败",
          type: "error",
        });
        setTimeout(() => {
          disbutton.value = false;
          EditLoading.value = false;
          router.go(0);
        }, 750);
      }
    });
  });
};

const handleEdit = (index: number, row: Repo) => {
  currentData.repository_id = row.repository_id;
  currentData.repository_name = row.repository_name;
  currentData.repository_address = row.repository_address;
  currentData.repository_catgory = row.repository_catgory;
  currentData.description = row.description;
  UpdateProduct();
};

const handleDelete = (index: number, row: Repo) => {
  currentData.repository_id = row.repository_id;
  currentData.repository_name = row.repository_name;
  currentData.repository_address = row.repository_address;
  currentData.repository_catgory = row.repository_catgory;
  currentData.description = row.description;
  deleteRepo();
};

const AddInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await axios({
        url: "http://localhost:8080/repo/insertRepo",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          repository_id: EditData.repository_id,
          repository_name: EditData.repository_name,
          repository_address: EditData.repository_address,
          repository_catgory: EditData.repository_catgory,
          description: EditData.description,
        },
      })
        .then(function (response) {
          if (response.data == "添加成功") {
            ElMessageBox({
              message: "添加成功",
              type: "success",
            });
            router.go(0);
          } else if (response.data == "重复添加") {
            ElMessageBox({
              message: "重复添加",
              type: "warning",
            });
          } else {
            ElMessageBox({
              message: "添加失败",
              type: "error",
            });
          }
        })
        .catch(function (response) {
          ElMessageBox({
            message: "发生错误，请联系管理员",
            type: "error",
          });
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const updateInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await axios({
        url: "http://localhost:8080/repo/updateRepository",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          repository_id: currentData.repository_id,
          repository_name: EditData.repository_name,
          repository_address: EditData.repository_address,
          repository_catgory: EditData.repository_catgory,
          description: EditData.description,
        },
      }).then(function (response) {
        if (response.data == "修改成功") {
          ElMessageBox({
            message: "修改成功",
            type: "success",
          });
          router.go(0);
        } else if (response.data == "修改失败") {
          ElMessageBox({
            message: "修改失败",
            type: "warning",
          });
        } else {
          ElMessageBox({
            message: "修改失败",
            type: "error",
          });
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

//处理pageNavigation的点击事件，用于分页跳转
const handleCurrentPage = (val: number) => {
  //因为数组是从0开始的，这个是1开始的，所以要减1
  pageInfo.currentPage = val - 1;
};

// const switchFun = async (formEl: FormInstance | undefined) => {
// if (!formEl) {
//   return;
// }
// await formEl.validate((valid, fields) => {
//   if (valid) {
//     if (str.value === "添 加") {
//       AddInfo();
//     } else {
//       updateInfo();
//     }
//   }else{
//     console.log('error submit!', fields);
//   }
// });
// };

const switchFun = async (formEl: FormInstance | undefined) => {
  if (str.value === "添 加") {
    AddInfo(formEl);
  } else {
    updateInfo(formEl);
  }
};

const searchFun = async () => {
  const res = await axios({
    url: "http://localhost:8080/repo/selectRepoByName",
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      name: search.value,
    },
  });
  data.tableData = res.data;
  pageData.completeData = [];
  //分割数组，通过PageInfo指定的行数来分割
  for (let i = 0, len = data.tableData.length; i < len; i += pageInfo.row) {
    pageData.completeData.push(data.tableData.slice(i, i + pageInfo.row));
  }
  //最后给pageInfo里面的总页数进行赋值
  pageInfo.totalPage = pageData.completeData.length * 10;
};

const getData = async () => {
  const res = await axios.get("http://localhost:8080/repo/selectAllRepo");
  data.tableData = res.data;
  //分割数组，通过PageInfo指定的行数来分割
  for (let i = 0, len = data.tableData.length; i < len; i += pageInfo.row) {
    pageData.completeData.push(data.tableData.slice(i, i + pageInfo.row));
  }
  //最后给pageInfo里面的总页数进行赋值
  pageInfo.totalPage = pageData.completeData.length * 10;
};

onMounted(() => {
  getData();
});
</script>

<style>
.edit_input {
  margin: 0 auto;
}
</style>