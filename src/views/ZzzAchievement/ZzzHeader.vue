<script setup>
import {categories} from "@/utils/zzzAchievementClass";
import Avatar from "@/components/Avatar.vue";
import ButtonZzzSetting from "@/views/ZzzAchievement/ButtonZzzSetting.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";
import AccountSwitch from "@/components/AccountSwitch.vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 传入可写数据
const category = defineModel();

// 使用Pinia作为本地缓存
const isMobileStore = useIsMobileStore();
</script>

<template>
  <div class="zzz-header">
    <div class="zzz-header-left">
      <div class="zzz-header-left-start">
        <avatar/>
        <account-switch :uuid="props.uuid" style="margin-left: 30px"/>
      </div>
      <div class="zzz-header-left-end">
        <button-zzz-setting :uuid="props.uuid"/>
      </div>
    </div>
    <div v-if="!isMobileStore.isMobile" class="zzz-header-right">
      <el-segmented v-model="category" :options="categories" block size="large"/>
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