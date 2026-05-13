<script setup>
import {useServerUpdateLogStore} from "@/scripts/stores/serverUpdateLogStore.js";
import ButtonServerInfoList from "@/views/Home/ButtonServerInfoList.vue";

// 使用Pinia作为本地缓存
const serverUpdateLogStore = useServerUpdateLogStore();
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" style="height: 360px">
      <template #header>
        <div slot="header" style="display: flex; justify-content: space-between">
          <b style="align-content: center">网站公告</b>
          <button-server-info-list/>
        </div>
      </template>

      <div>
        <b>版本：</b>
        <p>v{{ serverUpdateLogStore.lastestLog.server_version }}</p>
        <b>更新内容</b>
        <p class="content">{{ serverUpdateLogStore.lastestLog.update_description }}</p>
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

.content {
  white-space: pre-line;
}

p {
  margin-block-start: 0;
}
</style>