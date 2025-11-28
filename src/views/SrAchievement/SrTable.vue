<script setup>
import SrTableRow from "@/views/SrAchievement/SrTableRow.vue";

defineProps({
  sortedAchievements: Array,
  tableHeight: Number,
})
const achievementClass = defineModel()
</script>

<template>
  <el-scrollbar :height="tableHeight">
    <div class="sr-table">
      <el-card
        v-for="(row, index) in sortedAchievements"
        :key="index"
        class="sr-table-row"
        shadow="hover"
        >
        <sr-table-row :achievement="row" />
      </el-card>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.sr-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
}

.sr-table-row {
  border-radius: 0 16px 0 0;
}

:deep(.sr-table-row .el-card__body) {
  padding: 4px 16px;
}

@media (max-width: 900px) {
  :deep(.sr-table-row .el-card__body) {
    padding: 4px 10px;
  }
}
</style>