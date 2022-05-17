<template lang="">
    <div>
        <el-button type="primary" @Click="openDialog">新增商品</el-button>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="product_id" label="商品ID" width="180" />
            <el-table-column prop="product_name" label="商品名字" width="180" />
            <el-table-column prop="product_catgory" label="商品类别" width="180" />
            <el-table-column prop="product_price" label="商品价格" width="180" />
            <el-table-column prop="product_vendor" label="商品供货商" width="180" />
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

interface Product {
  product_id: string;
  product_name: string;
  product_catgory: string;
  product_vendor: string;
  product_price: string;
}

interface IData {
  tableData: Product[];
}
const data = reactive<IData>({
  tableData: [],
});

const currentData = reactive<Product>({
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

const handleEdit = (index: number, row: Product) => {
  currentData.product_id = row.product_id;
  currentData.product_name = row.product_name;
  currentData.product_catgory = row.product_catgory;
  currentData.product_vendor = row.product_vendor;
  currentData.product_price = row.product_price;
  UpdateProduct();
};

const deleteProduct = async () => {
  ElMessageBox.confirm("确认删除?").then(async () => {
    const res = await axios({
      url: "http://localhost:8080/product/deleteProduct",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        product_id: EditData.product_id,
        product_name: currentData.product_name,
        product_catgory: currentData.product_catgory,
        product_vendor: currentData.product_vendor,
        product_price: currentData.product_price,
      },
    }).then(function (response) {
      console.log(response);

      disbutton.value = true;
      EditLoading.value = true;
      if (response.data == "删除成功") {
        setTimeout(() => {
          ElMessageBox({
            message: "删除成功",
            type: "success",
          });
          disbutton.value = false;
          EditLoading.value = false;
          router.go(0);
        }, 750);
      } else {
        setTimeout(() => {
          ElMessageBox({
            message: "删除失败",
            type: "error",
          });
          disbutton.value = false;
          EditLoading.value = false;
          router.go(0);
        }, 750);
      }
    });
  });
};

const handleDelete = (index: number, row: Product) => {
  currentData.product_id = row.product_id;
  currentData.product_name = row.product_name;
  currentData.product_catgory = row.product_catgory;
  currentData.product_vendor = row.product_vendor;
  currentData.product_price = row.product_price;
  deleteProduct();
};

const AddInfo = async () => {
  const res = await axios({
    url: "http://localhost:8080/product/insertProduct",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      product_id: EditData.product_id,
      product_name: EditData.product_name,
      product_catgory: EditData.product_catgory,
      product_vendor: EditData.product_vendor,
      product_price: EditData.product_price,
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
};

const updateInfo = async () => {
  const res = await axios({
    url: "http://localhost:8080/product/updateProduct",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      product_id: currentData.product_id,
      product_name: EditData.product_name,
      product_catgory: EditData.product_catgory,
      product_vendor: EditData.product_vendor,
      product_price: EditData.product_price,
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
};

//处理pageNavigation的点击事件，用于分页跳转
const handleCurrentPage = (val: number) => {
  //因为数组是从0开始的，这个是1开始的，所以要减1
  pageInfo.currentPage = val - 1;
};

const getData = async () => {
  const res = await axios.get("http://localhost:8080/product/selectAll");
  data.tableData = res.data;
  //分割数组，通过PageInfo指定的行数来分割
  for (let i = 0, len = data.tableData.length; i < len; i += pageInfo.row) {
    pageData.completeData.push(data.tableData.slice(i, i + pageInfo.row));
  }
  //最后给pageInfo里面的总页数进行赋值
  pageInfo.totalPage = pageData.completeData.length * 10;
};

const switchFun = () => {
  if (str.value === "添 加") {
    AddInfo();
  } else {
    updateInfo();
  }
};

const searchFun = async () => {
  const res = await axios({
    url: "http://localhost:8080/product/searchByName",
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
  getData();
});
</script>

<style>
.edit_input {
  margin: 0 auto;
}
</style>