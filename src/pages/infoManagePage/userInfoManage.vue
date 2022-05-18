<template lang="">
    <div>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="user_account" label="账号" width="180" />
            <el-table-column prop="user_pwd" label="密码" width="180" />
            <el-table-column prop="user_name" label="用户名" width="180" />
            <el-table-column prop="user_email" label="邮箱" width="180" />
            <el-table-column prop="authority" label="权限" width="180">
               <template #default="scope">
               {{optionsDetail[scope.row.authority]}}</template>
             </el-table-column >
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" style="width: 400px" placeholder="Type to search account" clearable/>
                <el-button type="primary" style="margin-left: 10px" @Click="searchFun">
                <el-icon><Search/></el-icon>
                搜 索</el-button>
</template>
              <template #default="scope">
  <el-button
    size="large"
    round
    type="warning"
    @click="handleEdit(scope.$index, scope.row)"
    >修改</el-button
  >
  <el-button
    size="large"
    round
    type="danger"
    @click="handleDelete(scope.$index, scope.row)"
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
      title="信息修改"
      v-model="editView"
      width="30%">
      <el-form v-loading="EditLoading" label-width="150px">
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.user_account" :placeholder="currentData.user_account" maxlength="20" minlength="6" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.user_pwd" :placeholder="currentData.user_pwd" maxlength="30" minlength="6" show-word-limit show-password clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.user_name" :placeholder="currentData.user_name" maxlength="30" minlength="6" show-word-limit  clearable></el-input>
        </el-form-item>      
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.user_email" :placeholder="currentData.user_email" maxlength="30" minlength="6" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="EditData.authority" clearable :placeholder="currentData.authority">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" 
            ></el-option>
          </el-select> -->
          <el-radio-group v-model="EditData.authority">
            <el-radio-button label="0"> 超级管理员</el-radio-button>
            <el-radio-button label="1">管理员</el-radio-button>
            <el-radio-button label="2">普通用户</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button :disabled="disbutton" type="primary" @click="UpdateInfo" 
              >修改</el-button
            >
          <el-button :disabled="disbutton" @click="editView = false" >取消</el-button>
        </span>
      </template>
    </el-dialog>

  
</template>
<script lang="ts" setup>
import { User } from "@element-plus/icons-vue/dist/types";
import { DOMNodeTransforms } from "@vue/compiler-dom";
import axios from "axios";
import { ElLoading, ElMessageBox, ElTable } from "element-plus";
import { fa, tr } from "element-plus/lib/locale";
import { serve } from "esbuild";
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

//用户数据, 临时存储, 用了ts的类型限定
interface User {
  user_account: string;
  user_pwd: string;
  user_name: string;
  user_email: string;
  authority: string;
}
interface IData {
  tableData: User[];
}
const data = reactive<IData>({
  tableData: [],
});

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

const currentData = reactive<User>({
  user_account: "",
  user_pwd: "",
  user_name: "",
  user_email: "",
  authority: "",
});

const EditData = reactive<User>({
  user_account: "",
  user_pwd: "",
  user_name: "",
  user_email: "",
  authority: "",
});

//搜索框
const search = ref("");
//编辑窗口的显示
const editView = ref(false);
//删除窗口的显示
const deleteView = ref(false);

const EditLoading = ref(false);

const disbutton = ref(false);

const options = [
  {
    value: 0,
    label: "超级管理员",
  },
  {
    value: 1,
    label: "管理员",
  },
  {
    value: 2,
    label: "普通用户",
  },
];
const optionsDetail = {
  "0": "超级管理员",
  "1": "管理员",
  "2": "普通用户",
};
const computedData = computed((str: string) => {
  if (str == "超级管理员") return 0;
  else if (str == "管理员") return 1;
  else return 2;
});

//处理修改按钮点击事件
const handleEdit = (index: number, row: User) => {
  console.log(index, row);
  editView.value = true;
  currentData.user_account = row.user_account;
  currentData.user_pwd = row.user_pwd;
  currentData.user_name = row.user_name;
  currentData.user_email = row.user_email;
  currentData.authority = row.authority;
  EditData.user_account = row.user_account;
  EditData.user_pwd = row.user_pwd;
  EditData.user_name = row.user_name;
  EditData.user_email = row.user_email;
  EditData.authority = row.authority;
};

const commitDelete = async () => {
  ElMessageBox.confirm("确定删除数据?").then(async () => {
    const res = await axios.get("http://localhost:8080/user/deleteUser", {
      params: {
        user_account: currentData.user_account,
      },
    });
    console.log(res);
    disbutton.value = true;
    EditLoading.value = true;
    setTimeout(() => {
      disbutton.value = false;
      EditLoading.value = false;
      router.go(0);
    }, 750);
  });
};

//处理删除按钮点击事件
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
  deleteView.value = true;
  currentData.user_account = row.user_account;
  currentData.user_pwd = row.user_pwd;
  currentData.user_name = row.user_name;
  currentData.user_email = row.user_email;
  currentData.authority = row.authority;
  commitDelete();
};
//处理pageNavigation的点击事件，用于分页跳转
const handleCurrentPage = (val: number) => {
  //因为数组是从0开始的，这个是1开始的，所以要减1
  pageInfo.currentPage = val - 1;
};

const handleInputChange = () => {
  console.log(search);
};

const getUserData = async () => {
  const res = await axios.get("http://localhost:8080/user/selectAllUser");
  //先将数据给临时数组
  data.tableData = res.data;
  //分割数组，通过PageInfo指定的行数来分割
  for (let i = 0, len = data.tableData.length; i < len; i += pageInfo.row) {
    pageData.completeData.push(data.tableData.slice(i, i + pageInfo.row));
  }
  //最后给pageInfo里面的总页数进行赋值
  pageInfo.totalPage = pageData.completeData.length * 10;
};

const sendUpdateInfo = async () => {
  const res = await axios
    .get("http://localhost:8080/user/updateUser", {
      params: {
        user_account: EditData.user_account,
        user_pwd: EditData.user_pwd,
        user_name: EditData.user_name,
        user_email: EditData.user_email,
        authority: EditData.authority,
      },
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.status);
        return error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
  // console.log(res);
  //console.log(res.status);
  //返回状态码用于完成后续判断
  return res.data;
};

const UpdateInfo = async (done: () => void) => {
  console.log(EditData);
  ElMessageBox.confirm("确定提交修改数据?")
    .then(async () => {
      const res = await sendUpdateInfo();
      EditLoading.value = true;
      disbutton.value = true;
      setTimeout(() => {
        if (res == "修改成功") {
          ElMessageBox({
            message: "修改成功",
            type: "success",
          });
        } else {
          ElMessageBox({
            message: "修改失败",
            type: "error",
          });
        }
        EditLoading.value = false;
        disbutton.value = false;
      }, 750);
      done();
    })
    .catch(() => {
      console.log(Error);
    });
};

const searchFun = async () => {
  const res = await axios({
    url: "http://localhost:8080/user/searchByName",
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params:{
      name: search.value,
    }
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

onMounted(() => {
  getUserData();
});
</script>
<style>
.edit_input {
  margin: 0 auto;
}
</style>