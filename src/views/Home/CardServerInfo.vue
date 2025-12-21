<script setup>
import {useServerInfoStore} from "@/stores/serverInfoStore.js";

// 使用Pinia作为本地缓存
const serverInfoStore = useServerInfoStore();
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" style="height: 360px">
      <template #header>
        <div slot="header">
          <b>网站公告</b>
          版本：v{{ serverInfoStore.lastestInfo.server_version }}
        </div>
      </template>

      <div>
        <b>更新内容</b>
        <p>{{ serverInfoStore.lastestInfo.update_description }}</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-bg {
  min-height: 360px;
  border-radius: 16px;
  overflow: hidden;
}

</style>