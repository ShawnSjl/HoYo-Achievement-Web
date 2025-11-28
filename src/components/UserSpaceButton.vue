<script setup>
import router from "@/router";

const handleClick = () => {
  router.push({ path: '/space' });
}
</script>

<template>
  <el-button round plain type="primary" @click="handleClick">
    个人空间
  </el-button>
</template>

<style scoped>

</style>