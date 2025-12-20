<script setup>
import {useUserStore} from "@/stores/userStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
</script>

<template>
  <el-button plain round type="danger" @click="userStore.logoutUser()">
    退出登录
  </el-button>
</template>

<style scoped>

</style>