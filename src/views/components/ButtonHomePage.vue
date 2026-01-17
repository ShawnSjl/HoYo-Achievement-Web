<script setup>
import router from "@/scripts/router/index.js";

const handleClick = () => {
  router.push({path: '/'});
}
</script>

<template>
  <el-button plain round type="primary" @click="handleClick">
    首页
  </el-button>
</template>

<style scoped>

</style>