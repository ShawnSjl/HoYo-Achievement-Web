<script setup>
import {siteVersion} from "@/utils/config.js";
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" style="height: 360px">
      <template #header>
        <div slot="header">
          网站公告 版本：v{{ siteVersion }}
        </div>
      </template>

      <div>
        <b>更新内容</b>
        <p>1. 《崩坏：星穹铁道》3.7版本成就</p>
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