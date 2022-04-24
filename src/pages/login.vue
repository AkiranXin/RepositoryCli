<template lang="">
    <div class="loginPageDiv">
      <el-form :rules="data.rules" class="login_form">
        <el-header class="header">
          欢迎登录仓库管理系统
        </el-header>
        <el-form-item label="">
          <el-input v-model="data.account" placeholder="用户名：" clearable ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="data.password" placeholder="密码：" show-password clearable ></el-input>
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
    <el-form :rules="data.rules" >
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_acc" placeholder="请输入账号："></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="regi_input" v-model="data.regi_pwd" placeholder="请输入密码："></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-tooltip content="提交注册之后，请等待管理员审核" placement="top" effect="dark">
          <el-button type="primary" @click="onRegit, dialogVisible = false"
            >注册</el-button
          >
        </el-tooltip>
        

        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
    
</template>
<script>
import { reactive } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  setup() {
    const router = useRouter();
    const dialogVisible = ref(false);
    const data = reactive({
      account: "",
      password: "",
      regi_acc: "",
      regi_pwd: "",
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    });

    const getData = async () => {
      const res = await axios.get("http://localhost:8080/selectByPageHelper");
      if (
        res.data.userList[0].user_account == data.account &&
        res.data.userList[0].user_pwd == data.password
      ) {
        console.log("OK");
        router.push({ path: "/main" });
      } else {
        alert("密码错误或者账号不存在！");
      }
    };

    const registry = async () =>{
      const res = await axios.post();
      
    }

    const onSubmit = () => {
      getData();
    };

    const onRegit = () => {

    };
    return {
      data,
      onSubmit,
      dialogVisible,
      onRegit
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
.btn {
  margin: 0 auto;
  font-size: 18px;
  width: 100px;
}
.regi_input{
  font-size: 16px;
  height: 30px;
  width: 300px;
  margin: 0 auto;
}
</style>