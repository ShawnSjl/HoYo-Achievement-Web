<script setup>
import ZzzStatisticClassCard from "@/views/ZzzAchievement/ZzzStatisticClassCard.vue";
import ZzzTableRow from "@/views/ZzzAchievement/ZzzTableRow.vue";
import ZzzClassSelect from "@/views/ZzzAchievement/ZzzClassSelect.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";

defineProps({
  sortedAchievements: Array,
  tableHeight: Number,
})
const achievementClass = defineModel()

const isMobileStore = useIsMobileStore();
</script>

<template>
  <div v-if="isMobileStore.isMobile" class="zzz-table-header">
    <zzz-class-select v-model="achievementClass" class="zzz-table-header-select" />
    <zzz-statistic-class-card :achievement-class="achievementClass" class="zzz-table-header-card" />
  </div>
  <div v-else>
    <zzz-statistic-class-card :achievement-class="achievementClass" style="margin-bottom: 10px" />
  </div>

  <el-scrollbar :height="tableHeight">
    <div class="zzz-card-table">
      <el-card
          v-for="(row, index) in sortedAchievements"
          :key="index"
          class="zzz-card-row"
          shadow="hover"
      >
        <zzz-table-row :achievement="row" />
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