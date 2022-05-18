<template lang="">
  <el-card shadow="always" class="box_card" >
    <template #header>
      <div class="header_card">
        <span>个人信息</span>
        <el-button type="warning" style="margin-left:200px" @click="showDialog">修 改</el-button>
      </div>
    </template>
    <div class="text">
      <div>
        <span class="left_text">用户名:</span>
        <span class="right_text">{{data.user_name}}</span>
      </div>
      <div>
        <span class="left_text">账号:</span>
        <span class="right_text">{{data.user_account}}</span>
      </div>
      <div>
        <span class="left_text">邮箱:</span>
        <span class="right_text">{{data.user_email}}</span>
      </div>
      <div>
        <span class="left_text">当前账户拥有的权限：</span>
        <span class="right_text" v-if="store.state.authority='0'">超级管理员</span>
        <span class="right_text" v-else-if="store.state.authority='1'">管理者</span>
        <span class="right_text" v-else>普通用户</span>
      </div>
    </div>
    <el-divider direction="horizontal" content-position="left"></el-divider>
  </el-card>

  <el-dialog
      title="个人信息修改"
      v-model="editView"
      width="30%">
      <el-form v-loading="EditLoading"
      ref="ruleFormRef"
      status-icon
      :model="data"
      :rules="rules"
      label-width="150px"
      >
        <el-form-item label="用户名：" prop="name">
          <el-input class="input"  v-model="data.user_name"  maxlength="30" minlength="1" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input class="input" v-model="data.user_pwd" maxlength="30" minlength="1" show-word-limit clearable></el-input>
        </el-form-item>     
        <el-form-item label="请再次输入密码：" prop="checkPass">
          <el-input class="input" v-model="data.checkPass" maxlength="30" minlength="1" show-word-limit clearable></el-input>
        </el-form-item>  
        <el-form-item label="邮箱：" prop="email">
          <el-input class="input" v-model="data.user_email" maxlength="30" minlength="1" show-word-limit clearable></el-input>
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
</template>
<script lang="ts" setup>

import axios from "axios";
import { onMounted, ref } from "vue";
import { reactive } from "vue-demi";
// import { useStore } from "vuex";
import store from "../../store";
// const store = useStore();
import type { FormInstance, FormRules } from "element-plus";

const data = reactive({
  user_account: "",
  user_pwd: "",
  checkPass:"",
  user_name: "",
  user_email: "",
  authority: "",
});

//修改用的数据
const commitData = reactive({
  user_account: "",
  user_pwd: "",
  user_email: "",
})

//搜索框
const search = ref("");
//编辑窗口的显示
const editView = ref(false);
//删除窗口的显示
const deleteView = ref(false);

const EditLoading = ref(false);

const disbutton = ref(false);

const ruleFormRef = ref<FormInstance>()

const checkQuantity = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入数量！"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入数字！"));
    } else{
      callback();
    }
  }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (data.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== data.user_pwd) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      message: "用户名不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {validator: validatePass, trigger: "blur", required:true,},
  ],
  checkPass: [
    {validator: validatePass2, trigger: "blur", required:true,}
  ],
  email: [
    {required: true, message: "请输入邮箱", trigger: "blur" },
  ],
});

const showDialog = () =>{
  editView.value = true;
}

const getSelfInfo = async () => {
  const res = await axios
    .get("http://localhost:8080/user/login", {
      params: {
        user_account: sessionStorage.getItem("account"),
      },
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.header);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("error", error.message);
      }
    });
  //不用在意，因为项目的模板用的不是ts的，所以会爆红
  data.user_account = res.data[0].user_account;
  data.user_name = res.data[0].user_name;
  data.user_email = res.data[0].user_email;
  data.authority = res.data[0].authority;
};

//页面装载时加载
onMounted(() => {
  getSelfInfo();
});
</script>
<style>
.box_card {
  margin-top: 20px;
  width: 480px;
}
.header_card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.text {
  font-size: 16px;
  margin-bottom: 18px;
}
.left_text{
  /* margin-left: auto; */
  width: 200px;
  display: inline-block;
}
.right_text{
  /* margin-left: 150px; */
}
.commit_div{
  display: flex;
  justify-content: flex-end;
}
</style>