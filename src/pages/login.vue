<template lang="">
    <div class="loginPageDiv">
      <el-form :rules="data.rules" class="login_form" v-loading="loginLoading">
        <el-header class="header">
          欢迎登录仓库管理系统
        </el-header>
        <el-form-item label="">
          <el-input class="login_input" v-model="data.account" placeholder="账号：" clearable ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input class="login_input" v-model="data.password" placeholder="密码：" show-password clearable ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" class="btn" type="primary">登录</el-button>
          <el-button type="info" @click="dialogVisible = true" class="btn">注册账号</el-button>
        </el-form-item>
      </el-form>
    </div>
  <el-dialog
    v-model="dialogVisible"
    title="注册账号"
    width="40%"
  >
    <el-form v-loading="screenLoading">
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_acc" placeholder="请输入账号：" maxlength="20" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_name" placeholder="请输入用户名：" maxlength="30" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_pwd" placeholder="请输入密码：" maxlength="30" minlength="6" show-word-limit show-password clearable></el-input>
      </el-form-item>      
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_email" placeholder="请输入邮箱：" maxlength="30" minlength="6" show-word-limit clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-tooltip content="提交注册之后，请等待管理员审核" placement="top" effect="dark">
          <el-button :disabled="disbutton" type="primary" @click="onRegit" 
            >注册</el-button
          >
        </el-tooltip>
        

        <el-button :disabled="disbutton" @click="dialogVisible = false" >取消</el-button>
      </span>
    </template>
  </el-dialog>
    
</template>
<script>
import { reactive } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const dialogVisible = ref(false);
    const screenLoading = ref(false);
    const loginLoading = ref(false);
    const disbutton = ref(false);
    const data = reactive({
      account: "",
      password: "",
      regi_acc: "",
      regi_name: "",
      regi_pwd: "",
      regi_email: "",
      regi_message: "",
    });
    const store = useStore();
    //登录信息获取，用于判断和验证登录
    const getData = async () => {
      const res = await axios.get("http://localhost:8080/user/login", {
        params: {
          user_account: data.account,
        },
      });
      if (res.data == "") {
        loginLoading.value = true;
        setTimeout(() => {
          loginLoading.value = false;
          ElMessage({
            message: "账号不存在,请重新输入账号!",
            type: "warning",
          });
        }, 1000);
      } else if (
        res.data[0].user_account == data.account &&
        res.data[0].user_pwd == data.password
      ) {
        console.log("OK");
        //将权限给状态管理全局
        store.commit("changeAuthority",{
          authoriy: res.data[0].authority,
        })
        loginLoading.value = true;
        setTimeout(() => {
          loginLoading.value = false;
          router.push({ path: "/main" });
        }, 1000);
      } else {
        ElMessage({
          message: "密码错误！",
          type: "warning",
        });
      }
    };

    //登录按钮提交事件
    const onSubmit = () => {
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
        getData();
      }
    };
    //注册用户信息
    const registry = async () => {
      const res = await axios.get("http://localhost:8080/user/registry", {
        params: {
          user_account: data.regi_acc,
          user_pwd: data.regi_pwd,
          user_name: data.regi_name,
          user_email: data.regi_email,
        },
      });
      //console.log(res);
      //console.log(res.status);
      //返回状态码用于完成后续判断
      return res.status;
    };
    //注册按钮提交事件
    const onRegit = async () => {
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
          if (res == 200) {
            ElMessage({
              message: "已提交注册申请，等待管理员审核",
              type: "success",
            });
          } else {
            ElMessage({
              message: "出现错误，请等待管理员排查",
              type: "error",
            });
          }
        }, 1500);
      }
    };

    return {
      data,
      onSubmit,
      dialogVisible,
      onRegit,
      screenLoading,
      disbutton,
      loginLoading,
    };
  },
};
</script>
<style>
.loginPageDiv {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: fixed;
  margin: 0 auto;
  margin-top: 200px;
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
  font-size: 18px;
}
.btn {
  margin: 0 auto;
  font-size: 18px;
  width: 100px;
}
.regi_input {
  font-size: 18px;
  height: 30px;
  width: 400px;
  margin: 0 auto;
}
</style>