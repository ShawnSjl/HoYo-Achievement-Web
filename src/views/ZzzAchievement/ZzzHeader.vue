<script setup>
import { categories } from "@/utils/zzzAchievementClass";
import Avatar from "@/components/Avatar.vue";
import GameSwitch from "@/components/GameSwitch.vue";
import ZzzSettingButton from "@/views/ZzzAchievement/ZzzSettingButton.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";

const isMobileStore = useIsMobileStore();

const category = defineModel();
</script>

<template>
  <div class="zzz-header">
    <div class="zzz-header-left">
      <div class="zzz-header-left-start">
        <avatar />
        <game-switch style="margin-left: 30px" />
      </div>
      <div class="zzz-header-left-end">
        <zzz-setting-button />
      </div>
    </div>
    <div v-if="!isMobileStore.isMobile" class="zzz-header-right">
      <el-segmented v-model="category" :options="categories" size="large" block/>
    </div>
  </div>
</template>

<style scoped>
.zzz-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  width: 100%;
}

.zzz-header-left {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
  align-items: center;
  flex: 1;
}

.zzz-header-left-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.zzz-header-left-end {
  margin-right: 20px;
}

@media (max-width: 900px) {
  .zzz-header-left-end {
    margin-right: 0;
  }
}

.zzz-header-right {
  align-content: center;
  font-weight: bold;
  flex: 1;
}

.el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: #ffd100;
  --el-border-radius-base: 16px;
  --el-segmented-color: #cacaca;
  --el-segmented-bg-color: #161817;
  --el-segmented-item-hover-bg-color: rgb(58, 58, 58);
  --el-segmented-item-hover-color: #fbfbfb;
  --el-segmented-item-active-bg-color: #3f4242;
}
</style>