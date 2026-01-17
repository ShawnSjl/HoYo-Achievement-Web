<script setup>
import {computed} from "vue";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore";
import {zzzGetClassByCategory, zzzGetClassIdByName} from "@/scripts/utils/zzzAchievementClass";
import CardZzzStatisticTotal from "@/views/ZzzAchievement/CardZzzStatisticTotal.vue";
import {branchAchievementCountByClass} from "@/scripts/utils/countBranchAchievement.js";
import {completeAchievementCountByClass} from "@/scripts/utils/countCompleteAchievement.js";

// 传入只读数据
const props = defineProps({
  uuid: String,
  category: String,
})

// 传入可写数据
const achievementClass = defineModel();

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore();

// 根据大类别获取小类别列表
const classes = computed(() => zzzGetClassByCategory(props.category));

// 计算完成度百分比
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
  <div class="zzz-aside">
    <el-segmented v-model="achievementClass" :options="classes" direction="vertical" size="large">
      <template #default="each">
        <div class="zzz-class-option">
          <div style="flex: 1"></div>
          <div style="flex: 1">
            <p>{{ each.item }}</p>
          </div>
          <div class="zzz-class-option-percentage">
            <p>{{ completePercentage(each.item) }}%</p>
          </div>
        </div>
      </template>
    </el-segmented>
    <card-zzz-statistic-total :uuid="props.uuid" class="zzz-container-statistic-total"/>
  </div>
</template>

<style scoped>
.zzz-aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  font-weight: bold;
}

.zzz-container-statistic-total {
  margin: 10px 10px 18px;
  max-height: 360px;
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

.zzz-class-option {
  display: flex;
  flex-direction: row;
}

.zzz-class-option-percentage {
  flex: 1;
  display: flex;
  flex-direction: row-reverse;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>