<template lang="">
  <el-card shadow="always" class="box_card" >
    <template #header>
      <div class="header_card">
        <span>个人信息</span>
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
          <span class="right_text" v-if="store.state.authority='0'">Administrator</span>
          <span class="right_text" v-else-if="store.state.authority='1'">管理者</span>
          <span class="right_text" v-else>普通用户</span>
      </div>
    </div>
    <el-divider direction="horizontal" content-position="left"></el-divider>
    <el-button type="primary" size="default" @click="">修改</el-button>
  </el-card>
</template>
<script lang="ts" setup>

import axios from "axios";
import { onMounted } from "vue";
import { reactive } from "vue-demi";
// import { useStore } from "vuex";
import store from "../../store";
// const store = useStore();

const data = reactive({
  user_account: "",
  user_pwd: "",
  user_name: "",
  user_email: "",
  authority: "",
});

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
</style>