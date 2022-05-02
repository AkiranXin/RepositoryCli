<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <img class="logo" src="../assets/shiyou.jpg" />
        <span class="title">仓库管理系统</span>
      </el-header>
      <el-container>
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
          >
            <el-menu-item index="/main">
              <el-icon><icon-menu /></el-icon>
              <template #title>首页</template>
            </el-menu-item>

            <el-sub-menu index="/userInfoManage">
              <template #title>
                <el-icon><location /></el-icon>
                <span>信息管理</span>
              </template>

              <el-item-group>
                <el-menu-item index="2-1">个人信息管理</el-menu-item>
              </el-item-group>
            </el-sub-menu>

            <el-menu-item index="/repoInoManage">
              <el-icon><setting /></el-icon>
              <template #title>仓库信息管理</template>
            </el-menu-item>

            <el-menu-item index="/repoIOManage">
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
          <span>{{store.state}}</span>
          <template v-if="store.state.hasPermission == ''">没有权限</template>
          <template v-else>
            <!-- 主体页面部分跳转路由 -->
            <router-view></router-view>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import { ref,computed } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { reactive } from "@vue/reactivity";

//状态管理
const store = useStore();

//数据定义
const data = reactive({
  test: true,
});
//路由
const router = useRouter();
const isCollapse = ref(false);
//处理点击事件
const handleOpen = (key: string, keyPath: string[]) => {
  // router.push(key);
  console.log(key, keyPath);
};
//处理关闭事件
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>


<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.logo {
  width: 60px;
  margin-right: 10px;
}
.title {
  font-size: 26px;
  margin-left: 10px;
}
</style>
