<template lang="">
<el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
        <span><!-- card title --></span>
    </div>
    <!-- card body -->
</el-card>

</template>
<script lang="ts" setup>
import axios from "axios";
import { reactive } from "vue-demi";
import { useStore } from "vuex";

const store = useStore();

const data = reactive({
  user_account: "",
  user_pwd: "",
  user_name: "",
  user_email: "",
  authority: "",
});


const getSelfInfo = () => {
  const res = axios.get("localhost:8080/login", {
    params: {
      user_account: sessionStorage.getItem("account"),
    },
  });
  console.log(res);
  
};
</script>
<style lang="">
</style>