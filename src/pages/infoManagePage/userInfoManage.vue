<template lang="">
    <div>
        <el-table :data="filterTableData" stripe>
            <el-table-column prop="user_account" label="账号" width="180" />
            <el-table-column prop="user_pwd" label="密码" width="180" />
            <el-table-column prop="user_name" label="用户名" width="180" />
            <el-table-column prop="user_email" label="邮箱" width="180" />
            <el-table-column prop="authority" label="权限" width="180" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" placeholder="Type to search account" @change="handleInputChange" clearable/>
              </template>
              <template #default="scope">
  <el-button
    size="large"
    round
    type="primary"
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


</template>
<script lang="ts" setup>
import { User } from "@element-plus/icons-vue/dist/types";
import axios from "axios";
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

//搜索框
const search = ref("");
//编辑窗口的显示
const editView = ref(false);
//删除窗口的显示
const deleteVie = ref(false);

//处理修改按钮点击事件
const handleEdit = (index: number, row: User) => {
  console.log(index, row);
};
//处理删除按钮点击事件
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
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

onMounted(() => {
  getUserData();
});
</script>
<style lang="">
</style>