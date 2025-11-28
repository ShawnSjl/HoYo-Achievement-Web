<script setup>
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <el-button round plain type="danger" @click="authStore.logoutUser()">
    退出登录
  </el-button>
</template>

<style scoped>

</style>