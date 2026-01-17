<script setup>
import ZzzTableRow from "@/views/ZzzAchievement/ZzzTableRow.vue";
import ZzzClassSelect from "@/views/ZzzAchievement/ZzzClassSelect.vue";
import {useIsMobileStore} from "@/scripts/stores/isMobileStore";
import CardZzzStatisticClass from "@/views/ZzzAchievement/CardZzzStatisticClass.vue";
import {computed, ref} from "vue";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {zzzGetClassIdByName} from "@/scripts/utils/zzzAchievementClass.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";

// 传入只读数据
const props = defineProps({
  uuid: String,
  tableHeight: Number,
})

// 传入可写数据
const achievementClass = defineModel();

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const achievementStore = useZzzAchievementStore();
const isMobileStore = useIsMobileStore();

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账号成就
const account = computed(() =>
    accounts.value.find(account => account.uuid === props.uuid)
);

// 计算records的map
const recordMap = computed(() => {
  const map = new Map();

  account.value.records.forEach(r => {
    map.set(r.achievement_id, r);
  })

  return map;
})

function getProgress(achievementId) {
  return recordMap.value.get(achievementId)?.complete || 0;
}

// 根据类别筛选成就
const filteredAchievements = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.class_id === zzzGetClassIdByName(achievementClass.value))
});

// 根据条件排序
const sortedAchievements = computed(() => {
  if (achievementStore.isCompleteFirst) {
    return [...filteredAchievements.value].sort((a, b) => {
      const statusA = getProgress(a.achievement_id);
      const statusB = getProgress(b.achievement_id);

      const completeA = statusA === 2 ? 1 : statusA;
      const completeB = statusB === 2 ? 1 : statusB;

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

// 渲染优化部分
const num = ref(30);
const displayList = computed(() => sortedAchievements.value.slice(0, num.value));

const loadMore = (direction) => {
  if (direction === 'bottom') {
    num.value += 10
  }
}
</script>

<template>
  <div v-if="isMobileStore.isMobile" class="zzz-table-header">
    <zzz-class-select v-model="achievementClass" :uuid="props.uuid" class="zzz-table-header-select"/>
    <card-zzz-statistic-class :achievement-class="achievementClass" :uuid="props.uuid" class="zzz-table-header-card"/>
  </div>
  <div v-else>
    <card-zzz-statistic-class :achievement-class="achievementClass" :uuid="props.uuid" style="margin-bottom: 10px"/>
  </div>

  <el-scrollbar :height="props.tableHeight" @end-reached="loadMore">
    <div class="zzz-card-table">
      <el-card
          v-for="achievement in displayList"
          :key="achievement.achievement_id"
          class="zzz-card-row"
          shadow="hover"
      >
        <zzz-table-row :achievement="achievement" :status="getProgress(achievement.achievement_id)" :uuid="props.uuid"/>
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