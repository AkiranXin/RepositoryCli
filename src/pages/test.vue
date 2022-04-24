<template lang="">
    <div>
        {{count}}
        {{te}}
        <button ref="buttonRef" @click='setData'>DIAANWO</button>
        <ul>
          <li v-for='item in list' :key='item.user_account'>
            {{item.user_account}}
          </li>
        </ul>
        <router-link to="/login">Go to Login</router-link> | 
        <router-link to="/main">Go to main</router-link> | 
        <router-link to="/loginPage">Go to LoginPage</router-link>
    </div>
</template>
<script>
import { reactive, toRefs, onBeforeMount, ref } from "vue";
import axios from "axios";
export default {
  setup() {
    const data = reactive({
      count: 1,
      te: 1111,
      list: [],
    });
    onBeforeMount(() => {
      getData();
    });
    const buttonRef = ref(null);
    const getData = async () => {
      const res = await axios.get(
        "http://n3590f8677.qicp.vip/selectByPageHelper"
      );
      data.list = res.data.userList
    };
    const setData = () => {
      //console.log(buttonRef);
      data.count = data.count + 1;
    };
    return {
      setData,
      buttonRef,
      ...toRefs(data),
    };
  },
};
</script>
<style lang="">
    
</style>