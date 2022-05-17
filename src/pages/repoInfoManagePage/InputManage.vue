<template lang="">
    <div>
        <el-button type="primary" @Click="openDialog">新增商品</el-button>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="product_id" label="入库ID" width="180" />
            <el-table-column prop="product_name" label="入库仓库" width="180" />
            <el-table-column prop="product_catgory" label="入库产品" width="180" />
            <el-table-column prop="product_price" label="操作人" width="180" />
            <el-table-column prop="product_vendor" label="操作数量" width="180" />
            <el-table-column prop="product_vendor" label="入库时间" width="180" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" style="width: 400px" placeholder="Type to search account" clearable/>
                <el-button type="primary" style="margin-left: 10px" @Click="searchFun">搜 索</el-button>
              </template>
              <template #default="scope">
  <el-button
    round
    type="primary"
    @click="handleEdit(scope.$index, scope.row)"
    >修 改</el-button
  >
  <el-button
    round
    type="danger"
    @click="handleDelete(scope.$index, scope.row)"
    >删 除</el-button
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
      title="商品信息"
      v-model="editView"
      width="30%">
      <el-form v-loading="EditLoading">
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.product_name" placeholder="商品名:" maxlength="20" minlength="6" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.product_catgory" placeholder="商品类别" maxlength="30" minlength="6" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.product_vendor" placeholder="供货商" maxlength="30" minlength="6" show-word-limit  clearable></el-input>
        </el-form-item>      
        <el-form-item>
          <el-input class="edit_input" v-model="EditData.product_price" placeholder="产品价格" maxlength="30" minlength="6" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button :disabled="disbutton" type="primary" @click="switchFun" 
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

interface Input {
  product_id: string;
  product_name: string;
  product_catgory: string;
  product_vendor: string;
  product_price: string;
}

interface IData {
  tableData: Input[];
}
const data = reactive<IData>({
  tableData: [],
});

const currentData = reactive<Input>({
  product_id: "",
  product_name: "",
  product_catgory: "",
  product_vendor: "",
  product_price: "",
});

const EditData = reactive({
  product_id: "",
  product_name: "",
  product_catgory: "",
  product_vendor: "",
  product_price: "",
});

const search = ref("");

const EditLoading = ref(false);

const disbutton = ref(false);

const editView = ref(false);

const str = ref("");

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
</script>
<style>
.edit_input {
  margin: 0 auto;
}    
</style>