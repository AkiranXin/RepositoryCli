<template lang="">
    <div>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="repository_id" label="仓库ID" width="180" />
            <el-table-column prop="repository_address" label="仓库地址" width="180" />
            <el-table-column prop="repository_catgory" label="仓库类别" width="180" />
            <el-table-column prop="description" label="描述" width="180" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" placeholder="Type to search account" clearable/>
              </template>
              <template #default="scope">
              <el-button
                round
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
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

interface Repo{
    repository_id: string,
    repository_name: string,
    repository_address: string,
    repository_catgory: string,
    description: string,
}

const search = ref('')

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

const handleEdit = (index: number, row: Repo) =>{

}

const handleDelete = (index: number, row: Repo) =>{

}

//处理pageNavigation的点击事件，用于分页跳转
const handleCurrentPage = (val: number) => {
  //因为数组是从0开始的，这个是1开始的，所以要减1
  pageInfo.currentPage = val - 1;
};

onMounted(()=>{

})
</script>
<style lang="">
    
</style>