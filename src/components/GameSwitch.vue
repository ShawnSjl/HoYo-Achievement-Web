<script setup>
import { ArrowDown } from '@element-plus/icons-vue';
import router from "@/router";
import Zzz from '@/assets/zzz-image/zzz-logo.png'
import Sr from "@/assets/sr-image/sr-logo.png"

const handleClick = (command) => {
  switch (command) {
    case 'sr':
      router.push({ path: '/sr' });
      break
    case 'zzz':
      router.push({ path: '/zzz' });
      break
    default:
      router.push({ path: '/' })
      break
  }
}
</script>

<template>
  <el-dropdown size="large" trigger="click" placement="bottom-start" @command="handleClick">
    <el-button type="primary">
      切换游戏
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="sr">
          <div class="game-switch-item">
            <el-avatar shape="square" :src="Sr" />
            <p>崩坏：星穹铁道</p>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="zzz">
          <div class="game-switch-item">
            <el-avatar shape="square" :src="Zzz" />
            <p>绝区零</p>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.game-switch-item {
  display: flex;
  flex-direction: row;
  align-content: center;
}

p {
  margin-left: 10px;
  margin-block-start: 0;
  margin-block-end: 0;
  align-self: center;
}
</style>