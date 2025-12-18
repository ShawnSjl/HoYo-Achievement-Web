<script setup>
import {useUserStore} from "@/stores/userStore.js";

const authStore = useUserStore();
</script>

<template>
  <el-button round plain type="danger" @click="authStore.logoutUser()">
    退出登录
  </el-button>
</template>

<style scoped>

</style>