<template lang="">
    <div class="loginPageDiv">
      <el-form  class="login_form" v-loading="loginLoading"
      :rules="rules"
      ref="ruleFormRef"
      :model="data"
      status-icon
      >
        <el-header class="header">
          欢迎登录仓库管理系统
        </el-header>
        <el-form-item prop="account">
          <el-input class="login_input" v-model="data.account" placeholder="账号" clearable ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="login_input" v-model="data.password" placeholder="密码" show-password clearable ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input class="login_input" v-model="data.checkPass" placeholder="请再次输入密码" show-password clearable ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input class="login_input" style="display:inline-block; width:290px" v-model="data.email" placeholder="请输入邮箱" clearable ></el-input>
          <el-button type="success" style="font-size: 12px; width:100px; margin-left:10px" @click="sendEmail">发送邮箱验证码</el-button>
        </el-form-item>
        <el-form-item prop="checkCode">
          <el-input class="login_input" v-model="data.checkCode" placeholder="请输入邮箱验证码" clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm(ruleFormRef)" class="btn" type="primary">登录</el-button>
          <el-button type="warning" @click="dialogVisible = true" class="btn">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>
  <el-dialog
    v-model="dialogVisible"
    title="注册账号"
    width="20%"    
  >
    <el-form v-loading="screenLoading"
    :rules="rules"
    ref="ruleFormRef2"
    :model="data"
    status-icon
    >
      <el-form-item prop="regi_acc">
        <el-input class="regi_input" v-model="data.regi_acc" placeholder="请输入账号：" maxlength="20" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item prop="regi_name">
        <el-input class="regi_input" v-model="data.regi_name" placeholder="请输入用户名：" maxlength="30" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item prop="regi_pwd">
        <el-input class="regi_input" v-model="data.regi_pwd" placeholder="请输入密码：" maxlength="30" minlength="6" show-word-limit show-password clearable></el-input>
      </el-form-item>
      <el-form-item prop="regi_pwd_check">
        <el-input class="regi_input" v-model="data.regi_pwd_check" placeholder="请再次输入密码：" maxlength="30" minlength="6" show-word-limit show-password clearable></el-input>
      </el-form-item>        
      <el-form-item prop="regi_email">
        <el-input class="regi_input" v-model="data.regi_email" placeholder="请输入邮箱：" maxlength="30" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-tooltip content="提交注册之后，请等待管理员审核" placement="top" effect="dark">
          <el-button :disabled="disbutton" type="primary" @click="onRegit(ruleFormRef2)" 
            >注册</el-button
          >
        </el-tooltip>
        <el-button :disabled="disbutton" @click="dialogVisible = false" >取消</el-button>
      </span>
    </template>
  </el-dialog>
    
</template>
<script lang="ts" setup>
import { reactive } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { useStore } from "vuex";
import { method } from "lodash";
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter();
const dialogVisible = ref(false);
const screenLoading = ref(false);
const loginLoading = ref(false);
const disbutton = ref(false);
const data = reactive({
  account: "",
  password: "",
  checkPass:"",
  email: "",
  checkCode: "",
  regi_acc: "",
  regi_name: "",
  regi_pwd: "",
  regi_pwd_check: "",
  regi_email: "",
  regi_message: "",
});

const ruleFormRef = ref<FormInstance>()

const ruleFormRef2 = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
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
    callback(new Error('请再次输入密码！'))
  } else if (value !== data.password) {
    callback(new Error("两次输入不一致！"))
  } else {
    callback()
  }
}

const validateRegiPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    if (data.regi_pwd_check !== '') {
      if (!ruleFormRef2.value) return
      ruleFormRef2.value.validateField('regi_pwd_check', () => null)
    }
    callback()
  }
}
const validateRegiPass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== data.regi_pwd) {
    callback(new Error("两次输入不一致！"))
  } else {
    callback()
  }
}

const re = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
const validateEmail = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入邮箱！"));
  } else if (!re.test(value)) {
    callback(new Error("请输入正确的邮箱"));
  } else {
    callback();
  }
};

const rules = reactive({
  account:[{required: true, message: '请输入账号！', trigger: 'blur' }],
  password:[{required: true,  validator:validatePass, trigger: 'blur' }],
  checkPass:[{required: true, validator:validatePass2, trigger: 'blur' }],
  email:[{required: true, validator:validateEmail, trigger: 'blur' }],
  regi_acc:[{require:true, trigger: 'blur', min:1, max: 30}],
  regi_name:[{required: true, trigger: 'blur', min:1, max: 30}],
  regi_pwd:[{required: true, trigger: 'blur', validator:validateRegiPass}],
  regi_pwd_check:[{required: true, trigger: 'blur', validator:validateRegiPass2}],
  regi_email:[{required: true, validator:validateEmail, trigger: 'blur' }],
  checkCode:[{required: true, message: '请输入邮箱验证码！', trigger: 'blur' }]
})

const store = useStore();
//登录信息获取，用于判断和验证登录
const getData = async () => {
  const res = await axios.get("http://localhost:8080/user/login", {
    params: {
      user_account: data.account,
      user_pwd: data.password,
    },
  });
  console.log(res);
  
  //loading一下优化下用户体验
  loginLoading.value = true;
  
  setTimeout(() => {
    if (res.data.code == "账号不存在") {
      ElMessage({
        message: "账号不存在,请重新输入账号!",
        type: "warning",
      });
    } else if(sessionStorage.getItem("valCode") != data.checkCode){
      ElMessage({
        message: '邮箱验证码错误！',
        type: "warning",
      })
    } else if (
      res.data.code == "登录成功" && sessionStorage.getItem("valCode") == data.checkCode
    ) {
      console.log("OK");
      //将权限给状态管理全局
      store.commit("changeAuthority", {
        authoriy: res.data.data.authority,
      });
      //存入本地缓存，用于判断是否还登录在线
      sessionStorage.setItem("account", data.account);
      sessionStorage.setItem("hasPermission", store.state.hasPermission);
      sessionStorage.setItem("name", res.data.data.user_name);
      sessionStorage.setItem("email", res.data.data.user_email)
      //路由跳转
      router.push({ path: "/MainPage" });
      ElMessage({
        message: "登录成功",
        type: "success",
      });
    } else {
      ElMessage({
        message: "密码错误！",
        type: "warning",
      });
    }
    loginLoading.value = false;
  }, 1000);
};
//登录按钮提交事件
const submitForm = (formEl: FormInstance | undefined) => {
  
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      if (data.account == "") {
        ElMessage({
          message: "账号不能为空",
          type: "error",
        });
      } else if (data.password == "") {
        ElMessage({
          message: "密码不能为空",
          type: "error",
        });
      } else {
        //若数据都填写上了，就想服务器发送请求
        getData();
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const sendEmail = async () =>{
  const res = await axios.get("http://localhost:8080/user/sendEmail",{
    params:{
      email: data.email,
    }
  })
  sessionStorage.setItem("valCode", res.data.valCode);
}

//注册用户信息
const registry = async () => {
  const res = await axios
    .get("http://localhost:8080/user/registryRedis", {
      params: {
        user_account: data.regi_acc,
        user_pwd: data.regi_pwd,
        user_name: data.regi_name,
        user_email: data.regi_email,
        authority: 2,
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
//注册按钮提交事件
const onRegit = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return;
    }
    formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
    if (data.regi_acc == "") {
      ElMessage({
        message: "账号不能为空",
        type: "error",
      });
    } else if (data.regi_pwd == "") {
      ElMessage({
        message: "密码不能为空",
        type: "error",
      });
    } else if (data.regi_name == "") {
      ElMessage({
        message: "用户名不能为空",
        type: "error",
      });
    } else if (data.regi_email == "") {
      ElMessage({
        message: "邮箱不能为空",
        type: "error",
      });
    } else {
      const res = await registry(); //异步接受状态码
      screenLoading.value = true;
      disbutton.value = true;
      setTimeout(() => {
        disbutton.value = false;
        screenLoading.value = false;
        if (res == "注册成功") {
          ElMessage({
            message: "已提交注册申请，等待管理员审核",
            type: "success",
          });
        } else if (res == "重复注册") {
          ElMessage({
            message: "注册的账号已存在，请更换账号！",
            type: "warning",
          });
        } else {
          ElMessage({
            message: "出现错误，请等待管理员排查",
            type: "error",
          });
        }
      }, 1500);
    }
    } else {
      console.log('error submit!')
      return false
    }
  })
};

onMounted(()=>{
})
</script>
<style>
.loginPageDiv {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: fixed;
  margin: 0 auto;
  margin-top: 100px;
  padding: 0;
}
.header {
  text-align: center;
  font-size: 24px;
  color: #303133;
}
.login_form {
  border-radius: 15px;
  margin: 90px auto;
  width: 400px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_input {
  font-size: 16px;
}
.btn {
  margin: 0 auto;
  font-size: 18px;
  width: 100px;
}
.regi_input {
  font-size: 16px;
  height: 30px;
  width: 400px;
  margin: 0 auto;
}
</style>