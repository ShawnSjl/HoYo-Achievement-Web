<script setup>
import {useUserStore} from "@/scripts/stores/userStore.js";
import router from "@/scripts/router/index.js";
import {nextTick} from "vue";

// 使用Pinia作为本地缓存
const userStore = useUserStore();

const handleClick = async () => {
  await router.replace({
    path: '/'
  });

  await nextTick(); // 等待页面卸载掉

  await userStore.logoutUser();
}
</script>

<template>
  <el-button plain round type="danger" @click="handleClick">
    退出登录
  </el-button>
</template>

<style scoped>

</style>