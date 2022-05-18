<template lang="">
    <div>
        <el-button type="primary" @Click="openInsert">
        <el-icon><CirclePlus /></el-icon>
        出库添加</el-button>
        <el-button type="success" 
        ><el-icon><Download /></el-icon>
          导出数据</el-button>
        <el-table :data="pageData.completeData[pageInfo.currentPage]" stripe>
            <el-table-column type="selection" width="55" />
            <el-table-column prop="output_id" label="出库ID" width="150" sortable/>
            <el-table-column prop="output_repository" label="出库仓库" width="150"
            :filters="filterRepo.data"
            :filter-method="filterRepoHandler"
            />
            <el-table-column prop="output_product" label="出库产品" width="150"
            :filters="filterPro.data"
            :filter-method="filterProHandler"
             />
            <el-table-column prop="Operator" label="操作人" width="150" />
            <el-table-column prop="output_quantity" label="操作数量" width="150" sortable/>
            <el-table-column prop="total" label="总价" width="150" sortable/>
            <el-table-column prop="output_time" label="出库时间" width="180" sortable/>
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" style="width: 300px; display: inline-block" placeholder="Type to search account" clearable/>
                <el-button type="primary" style="margin-left: 10px" @Click="searchFun">
                <el-icon><Search/></el-icon>
                搜 索</el-button>
              </template>
              <template #default="scope">
  <el-button round type="warning" @click="handleEdit(scope.$index, scope.row)"
    >修 改</el-button
  >
  <el-button round type="danger" @click="handleDelete(scope.$index, scope.row)"
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
      title="出库记录修改"
      v-model="editView"
      width="30%">
      <el-form v-loading="EditLoading"
      ref="ruleFormRef"
      :model="currentData"
      :rules="rules"
      label-width="200px"
      >
        <el-form-item label="出库仓库：" prop="output_repository">
          <el-select
            v-model="currentData.output_repository"
            placeholder="请选择仓库"
          >
            <el-option
              v-for="item in repoInfo.data"
              :key="item.repository_name"
              :label="item.repository_name"
              :value="item.repository_name" 
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库货物：" prop="output_product">
          <el-select
            v-model="currentData.output_product"
            placeholder="请选择货物"
          >
            <el-option
              v-for="item in productInfo.data"
              :key="item.product_name"
              :label="item.product_name"
              :value="item.product_name" 
            ></el-option>
          </el-select>
        </el-form-item>     
        <el-form-item label="出库数量：" prop="quantity">
          <el-input class="edit_input" v-model="currentData.output_quantity" placeholder="操作数量" maxlength="10" minlength="1" show-word-limit clearable></el-input>
        </el-form-item>  
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button :disabled="disbutton" type="primary" @click="updateInfo(ruleFormRef)" 
              >修 改</el-button
            >
          <el-button :disabled="disbutton" @click="editView = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

      <el-dialog
      title="出库记录添加"
      v-model="insertView"
      width="30%">
      <el-form v-loading="EditLoading"
      ref="ruleFormRef"
      status-icon
      :model="EditData"
      :rules="rules"
      label-width="150px"
      >
        <el-form-item label="出库仓库：" prop="output_repository">
          <el-select
            v-model="EditData.output_repository"
            placeholder="请选择仓库"
          >
          <el-option
            v-for="item in repoInfo.data"
            :key="item.repository_name"
            :label="item.repository_name"
            :value="item.repository_name" 
          ></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="出库货物：" prop="output_repository">
          <el-select
            v-model="EditData.output_product"
            placeholder="请选择货物"
          >
          <el-option
            v-for="item in productInfo.data"
            :key="item.product_name"
            :label="item.product_name"
            :value="item.product_name" 
          ></el-option>
          </el-select>
        </el-form-item>      
        <el-form-item label="出库数量：" prop="output_quantity">
          <el-input class="edit_input" type="text" v-model.number="EditData.output_quantity" placeholder="操作数量" maxlength="10" minlength="1" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button :disabled="disbutton" type="primary" @click="AddInfo(ruleFormRef)" 
              >添 加</el-button
            >
          <el-button :disabled="disbutton" @click="insertView = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { Edit, User } from "@element-plus/icons-vue/dist/types";
import { DOMNodeTransforms } from "@vue/compiler-dom";
import axios from "axios";
import { ElLoading, ElMessageBox, ElTable, ElMessage } from "element-plus";
import { fa, tr } from "element-plus/lib/locale";
import { serve } from "esbuild";
import type { FormInstance, FormRules } from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
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
import { find } from "lodash";

interface Output {
  output_id: string;
  output_repository: string;
  output_product: string;
  Operator: string;
  output_quantity: string;
  output_time: string;
}

interface IData {
  tableData: Output[];
}
const data = reactive({
  tableData: [],
});

const currentData = reactive({
  output_id: "",
  output_repository: "",
  output_product: "",
  Operator: "",
  output_quantity: "",
  output_time: "",
});

const EditData = reactive({
  output_id: "",
  output_repository: "",
  output_product: "",
  Operator: "",
  output_quantity: "",
  output_time: "",
});

const repoInfo = reactive({
  data: [],
});

const productInfo = reactive({
  data: [],
});

const filterRepo = reactive({
  data: [],
});

const filterPro = reactive({
  data: [],
});

const search = ref("");

const EditLoading = ref(false);

const disbutton = ref(false);

const editView = ref(false);

const insertView = ref(false);

const str = ref("");

const checkQuantity = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入数量！"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入数字！"));
    } else {
      callback();
    }
  }, 1000);
};

const rules = reactive({
  output_repository: [
    { required: true, message: "请选择仓库", trigger: "blur" },
    {
      message: "仓库不能为空",
      trigger: "blur",
    },
  ],
  output_product: [
    { required: true, message: "请选择产品", trigger: "blur" },
    {
      message: "产品不能为空",
      trigger: "blur",
    },
  ],
  output_quantity: [
    {
      required: true,
      validator: checkQuantity,
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
  editView.value = true;
};

const openInsert = () => {
  insertView.value = true;
};

const UpdateProduct = async () => {
  str.value = "修 改";
  editView.value = true;
};

const deleteInput = async () => {
  ElMessageBox.confirm("确认删除?").then(async () => {
    const res = await axios({
      url: "http://localhost:8080/output/deleteInput",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        output_id: currentData.output_id,
        output_repository: currentData.output_repository,
        output_product: currentData.output_product,
        output_operator: currentData.Operator,
        output_quantity: currentData.output_quantity,
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

const handleEdit = (index: number, row: Output) => {
  currentData.output_id = row.output_id;
  currentData.output_repository = row.output_repository;
  currentData.output_product = row.output_product;
  currentData.output_quantity = row.output_quantity;
  UpdateProduct();
};

const handleDelete = (index: number, row: Output) => {
  currentData.output_id = row.output_id;
  currentData.output_repository = row.output_repository;
  currentData.output_product = row.output_product;
  currentData.output_quantity = row.output_quantity;
  deleteInput();
};

//处理pageNavigation的点击事件，用于分页跳转
const handleCurrentPage = (val: number) => {
  //因为数组是从0开始的，这个是1开始的，所以要减1
  pageInfo.currentPage = val - 1;
};

const AddInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await axios({
        url: "http://localhost:8080/output/insertOutput",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          output_id: EditData.output_id,
          output_repository: EditData.output_repository,
          output_product: EditData.output_product,
          Operator: EditData.Operator,
          output_quantity: EditData.output_quantity,
        },
      })
        .then(function (response) {
          if (response.data == "添加成功") {
            ElMessage({
              message: "添加成功",
              type: "success",
            });
            router.go(0);
          } else if (response.data == "重复添加") {
            ElMessage({
              message: "重复添加",
              type: "warning",
            });
          } else {
            ElMessage({
              message: "添加失败",
              type: "error",
            });
          }
        })
        .catch(function (response) {
          ElMessage({
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
        url: "http://localhost:8080/output/updateOutput",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          output_id: currentData.output_id,
          output_repository: currentData.output_repository,
          output_product: currentData.output_product,
          Operator: currentData.Operator,
          output_quantity: currentData.output_quantity,
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

const searchFun = async () => {
  const res = await axios({
    url: "http://localhost:8080/output/searchByName",
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
  const res = await axios.get("http://localhost:8080/output/selectAll");
  data.tableData = res.data;
  //分割数组，通过PageInfo指定的行数来分割
  for (let i = 0, len = data.tableData.length; i < len; i += pageInfo.row) {
    pageData.completeData.push(data.tableData.slice(i, i + pageInfo.row));
  }
  var tempStr = "";
  //处理时间
  for (let i = 0, len = pageData.completeData.length; i < len; i++) {
    for (let j = 0, len = pageData.completeData[i].length; j < len; j++) {
      //pageData.completeData[i][j].output_time = pageData.completeData[i][j].output_time.slice(0, 19);
      tempStr += pageData.completeData[i][j].output_time.slice(0, 10);
      tempStr += " ";
      tempStr += pageData.completeData[i][j].output_time.slice(11, 19);
      pageData.completeData[i][j].output_time = tempStr;
      tempStr = "";

      //处理下总价格
      let temp = productInfo.data.find((element) => {
        return (
          element.product_name === pageData.completeData[i][j].output_product
        );
      });
      pageData.completeData[i][j].total =
        temp.product_price * pageData.completeData[i][j].output_quantity;
    }
  }
  console.log(pageData.completeData);

  //最后给pageInfo里面的总页数进行赋值
  pageInfo.totalPage = pageData.completeData.length * 10;
};

const InputData = reactive({
  completeData: [],
});

const getInputData = async () => {
  const res = await axios.get("http://localhost:8080/input/selectAll");
  InputData.completeData = res.data;
  var tempStr = "";
  //处理时间
  for (let i = 0, len = InputData.completeData.length; i < len; i++) {
    tempStr += InputData.completeData[i].input_time.slice(0, 10);
    tempStr += " ";
    tempStr += InputData.completeData[i].input_time.slice(11, 19);
    InputData.completeData[i].input_time = tempStr;
    tempStr = "";
    //处理下总价格
    let temp = productInfo.data.find((element) => {
      return element.product_name === InputData.completeData[i].input_product;
    });
    InputData.completeData[i].total =
      temp.product_price * InputData.completeData[i].input_quantity;
  }
  console.log(InputData.completeData);
};

const getRepoData = async () => {
  const res = await axios.get("http://localhost:8080/repo/selectAllRepo");
  repoInfo.data = res.data;
  for (let i = 0; i < repoInfo.data.length; i++) {
    filterRepo.data.push({
      text: repoInfo.data[i].repository_name,
      value: repoInfo.data[i].repository_name,
    });
  }
};

const getProData = async () => {
  const res = await axios.get("http://localhost:8080/product/selectAll");
  productInfo.data = res.data;
  for (let i = 0; i < productInfo.data.length; i++) {
    filterPro.data.push({
      text: productInfo.data[i].product_name,
      value: productInfo.data[i].product_name,
    });
  }
};

const filterProHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

const filterRepoHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

onMounted(() => {
  EditData.Operator = currentData.Operator = sessionStorage.getItem("name");
  getRepoData();
  getProData();
  getData();
  getInputData();
});
</script>
<style>
.edit_output {
  margin: 0 auto;
  width: 400px;
}
.el-select__popper {
  z-index: 9999 !important;
}
</style>