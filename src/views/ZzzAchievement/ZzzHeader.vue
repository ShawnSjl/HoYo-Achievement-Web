<script setup>
import {categories, zzzGetClassByCategory} from "@/scripts/utils/zzzAchievementClass";
import Avatar from "@/views/components/Avatar.vue";
import ButtonZzzSetting from "@/views/ZzzAchievement/ButtonZzzSetting.vue";
import {useIsMobileStore} from "@/scripts/stores/isMobileStore";
import AccountSwitch from "@/views/components/AccountSwitch.vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 传入可写数据
const category = defineModel('category');
const achievementClass = defineModel('achievementClass');

// 使用Pinia作为本地缓存
const isMobileStore = useIsMobileStore();

// 处理大类别变更
const handleCategoryChange = (newCategory) => {
  category.value = newCategory;

  const newClasses = zzzGetClassByCategory(newCategory);
  if (newClasses && newClasses.length > 0) {
    achievementClass.value = newClasses[0];
  }
}
</script>

<template>
  <div class="zzz-header">
    <div class="zzz-header-left">
      <div class="zzz-header-left-start">
        <avatar :uuid="props.uuid"/>
        <account-switch :uuid="props.uuid" class="zzz-header-switch-button"/>
      </div>
      <div class="zzz-header-left-end">
        <button-zzz-setting :uuid="props.uuid"/>
      </div>
    </div>
    <div v-if="!isMobileStore.isMobile" class="zzz-header-right">
      <el-segmented v-model="category" :options="categories" block size="large"
                    @change="handleCategoryChange"/>
    </div>
  </div>
</template>

<style scoped>
.zzz-header {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}

.zzz-header-left {
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
  align-items: center;
}

.zzz-header-left-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.zzz-header-switch-button {
  margin-left: 30px;
}

.zzz-header-left-end {
  margin-right: 20px;
}

@media (max-width: 900px) {
  .zzz-header-switch-button {
    margin-left: 10px;
  }

  .zzz-header-left-end {
    margin-right: 0;
  }
}

.zzz-header-right {
  flex: 1;

  align-content: center;
  font-weight: bold;
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