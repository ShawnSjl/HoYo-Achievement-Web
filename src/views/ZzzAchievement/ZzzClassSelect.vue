<script setup>
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore";
import {categories, zzzGetClassByCategory, zzzGetClassIdByName} from "@/scripts/utils/zzzAchievementClass"
import {computed} from "vue";
import {branchAchievementCountByClass} from "@/scripts/utils/countBranchAchievement.js";
import {completeAchievementCountByClass} from "@/scripts/utils/countCompleteAchievement.js";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 传入可写数据
const achievementClass = defineModel();

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore();

// 计算完成百分比
const completePercentage = computed(() => {
  return (className) => {
    const classId = zzzGetClassIdByName(className);

    const numberTotal = achievementStore.achievements.filter(achievement => achievement.class_id === classId).length
        - branchAchievementCountByClass('ZZZ', classId);

    const numberComplete = completeAchievementCountByClass('ZZZ', props.uuid, classId);

    if (numberTotal === 0) return 0; // 避免除以 0

    return Math.floor((numberComplete / numberTotal) * 1000) / 10;
  };
});
</script>

<template>
  <el-select
      v-model="achievementClass"
      popper-class="zzz-class-select"
  >
    <el-option-group
        v-for="category in categories"
        :label="category"
    >
      <el-option
          v-for="achieveClass in zzzGetClassByCategory(category)"
          :key="achieveClass"
          :label="achieveClass"
          :value="achieveClass"
      >
        <template #default>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <p>{{ achieveClass }}</p>
            <p style="margin-left: 10px">{{ completePercentage(achieveClass) }}%</p>
          </div>
        </template>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<style scoped>
:deep(.el-select) {
  --el-select-input-focus-border-color: #616161;
}

/* placeholder字体 */
:deep(.el-select__placeholder) {
  font-weight: bold;
  color: #000000;
}

/* 菜单打开时placeholder字体 */
:deep(.el-select__placeholder.is-transparent) {
  font-weight: bold;
  color: #000000;
}

/* 菜单按钮 */
:deep(.el-select__wrapper) {
  background-color: #ffd100;
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-select-group__title) {
  color: #cacaca;
  background-color: #161817;
}

/* 菜单中的选项背景 */
:deep(.el-select-dropdown__item) {
  color: #cacaca;
  background-color: #161817;
  font-weight: bold;
}

/* 菜单中被选中的选项字体 */
:deep(.el-select-dropdown__item.is-selected) {
  color: #000000;
}

/* 菜单中被选中的选项背景 */
:deep(.el-select-dropdown__item.is-hovering) {
  background-color: #ffd100;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

<style>
/* 菜单的背景 */
.zzz-class-select {
  background: #161817 !important;
  border: 1px solid #161817 !important;

  .el-popper__arrow::before {
    background: #161817 !important;
    border: 1px solid #161817 !important;
  }
}
</style>
