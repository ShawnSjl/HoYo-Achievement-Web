<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {computed, onMounted} from "vue";

// 使用Pinia作为本地缓存
const userStore = useUserStore();

// 获取用户是否有Root权限
const isUserRoot = computed(() => {
  return userStore.isUserRoot();
})
onMounted(async () => {
  await userStore.forceCheckIsUserRoot();
})
</script>

<template>
  <el-button v-if="isUserRoot" plain style="width: 100%" type="primary">
    上传数据文件
  </el-button>

  <!--        TODO 添加上传功能 只有Root可以上传文件 -->
</template>

<style scoped>

</style>