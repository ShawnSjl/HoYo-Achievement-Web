<script setup>
import ZzzTableRow from "@/views/ZzzAchievement/ZzzTableRow.vue";
import ZzzClassSelect from "@/views/ZzzAchievement/ZzzClassSelect.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";
import CardZzzStatisticClass from "@/views/ZzzAchievement/CardZzzStatisticClass.vue";
import {computed} from "vue";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import {zzzGetClassIdByName} from "@/utils/zzzAchievementClass.js";

// 传入只读数据
const props = defineProps({
  uuid: String,
  tableHeight: Number,
})

// 传入可写数据
const achievementClass = defineModel();

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore();
const isMobileStore = useIsMobileStore();

// 根据类别筛选成就
const filteredAchievements = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.class_id === zzzGetClassIdByName(achievementClass.value))
});

// 根据条件排序
const sortedAchievements = computed(() => {
  if (achievementStore.isCompleteFirst) {
    return [...filteredAchievements.value].sort((a, b) => {
      const completeA = a.complete === 2 ? 1 : a.complete;
      const completeB = b.complete === 2 ? 1 : b.complete;

      // 1️⃣ 优先按 complete 状态
      if (completeA !== completeB) {
        return completeA - completeB;
      }

      // 2️⃣ 如果 complete 相同，按 id 升序排序
      return a.id - b.id;
    });
  } else {
    return filteredAchievements.value;
  }
});
</script>

<template>
  <div v-if="isMobileStore.isMobile" class="zzz-table-header">
    <zzz-class-select v-model="achievementClass" :uuid="props.uuid" class="zzz-table-header-select"/>
    <card-zzz-statistic-class :achievement-class="achievementClass" :uuid="props.uuid" class="zzz-table-header-card"/>
  </div>
  <div v-else>
    <card-zzz-statistic-class :achievement-class="achievementClass" :uuid="props.uuid" style="margin-bottom: 10px"/>
  </div>

  <el-scrollbar :height="props.tableHeight">
    <div class="zzz-card-table">
      <el-card
          v-for="(row, index) in sortedAchievements"
          :key="index"
          class="zzz-card-row"
          shadow="hover"
      >
        <zzz-table-row :achievement="row" :uuid="props.uuid"/>
      </el-card>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.zzz-card-table {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 控制卡片之间的间隔 */
  padding: 10px;
}

.zzz-card-row {
  border-radius: 12px;
  transition: all 0.3s ease;

  --el-card-bg-color: #242424;
  --el-card-border-color: #000000;
  border: 2px solid #000000;
}

:deep(.zzz-card-row .el-card__body) {
  padding: 4px 16px;
}

@media (max-width: 900px) {
  .zzz-card-table {
    gap: 8px; /* 控制卡片之间的间隔 */
    padding: 5px;
  }

  :deep(.zzz-card-row .el-card__body) {
    padding: 4px 8px;
  }

  .zzz-table-header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
  }

  .zzz-table-header-select {
    align-self: center;
    min-width: 128px;
    flex: 1;
  }

  .zzz-table-header-card {
    margin-left: 5px;
    flex: 3;
  }
}
</style>