<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <img class="logo" src="../assets/shiyou.jpg" />
          <span class="title">基于Vue和SpringBoot的仓库管理系统</span>
        </div>

        <div :style="{ display: 'flex', alignItems: 'center' }">
          <el-dropdown trigger="hover" @command="handleCommand">
            <span class="el-dropdown-link">
              欢迎回来,{{ store.state.name }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="clearfix" command="setting">
                  设置
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" command="quit">
                  注销
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-divider direction="horizontal"></el-divider>
      <el-container class="mainPage">
        <!-- 侧边菜单栏 -->
        <el-aside>
          <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">折叠</el-radio-button>
          </el-radio-group>

          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
            :router="true"
          >
            <el-menu-item index="/main">
              <el-icon><icon-menu /></el-icon>
              <template #title>首页</template>
            </el-menu-item>

            <el-sub-menu index="">
              <template #title>
                <el-icon><location /></el-icon>
                <span>信息管理</span>
              </template>

                <el-menu-item index="/selfInfoManage"
                  >个人信息管理</el-menu-item
                >
              <template v-if="auth == 0">
                <el-menu-item index="/userInfoManage">
                  用户信息管理
                </el-menu-item>
              </template>
              <template v-if="auth <= 1">
                <el-menu-item index="/validateInfo">
                  用户注册审核
                </el-menu-item>
              </template>
            </el-sub-menu>

            <el-menu-item index="/repoInfoManage">
              <el-icon><setting /></el-icon>
              <template #title>仓库信息管理</template>
            </el-menu-item>

            <el-menu-item index="/IOInfoManage">
              <el-icon></el-icon>
              <template #title>出入库信息管理</template>
            </el-menu-item>

            <el-menu-item index="/productInfoManage">
              <el-icon></el-icon>
              <template #title>商品信息管理</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 这里就是主体页面跳转 -->
        <el-main>
          <!-- 权限（状态管理） -->
            <!-- 主体页面部分跳转路由 -->
            <router-view></router-view>
        </el-main>
      </el-container>
      <el-divider direction="horizontal"></el-divider>
      <el-footer>
        <template>
          <div>Hello world!</div>
        </template>
      </el-footer>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import store from "../store";
import { reactive } from "@vue/reactivity";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";

//状态管理

//数据定义
const data = reactive({
  user_account: "",
  user_pwd: "",
  user_name: "",
  user_email: "",
  authority: "",
});

const auth = computed(()=>{
  if(store.state.hasPermission == '0'){
    return 0
  }else if(store.state.hasPermission == '1'){
    return 1
  }else{
    return 2
  }
})

//路由
const router = useRouter();
const isCollapse = ref(false);
//处理点击事件
const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};
//处理关闭事件
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};

const handleCommand = (command: string | number | object) => {
  if(command == 'setting'){
    router.push('/selfInfoManage');
  }else{
    sessionStorage.clear();
    router.go(0);
  }
}
</script>


<style>
.mainPage{
  height: 750px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-header {
  display: flex;
  justify-content: space-between;
}

.logo {
  width: 80px;
  margin-right: 10px;
}
.title {
  font-size: 24px;
  margin-left: 10px;
  position: relative;
  top: -18px;
  width: auto;
  display: inline-block;
}

.avatar {
}

.item {
}
.el-dropdown-link {
  font-size: 18px;
  margin-top: 10px;

  display: inline-block;
  cursor: pointer;
}
</style>
