<script setup>
import ZzzTableRow from "@/views/ZzzAchievement/ZzzTableRow.vue";
import SelectorZzzClass from "@/views/ZzzAchievement/SelectorZzzClass.vue";
import {useIsMobileStore} from "@/scripts/stores/isMobileStore";
import CardZzzStatisticClass from "@/views/ZzzAchievement/CardZzzStatisticClass.vue";
import {computed, ref, watch} from "vue";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {zzzGetClassIdByName} from "@/scripts/utils/zzzAchievementClass.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import FilterZzzAchievement from "@/views/ZzzAchievement/FilterZzzAchievement.vue";
import {useServerInfoStore} from "@/scripts/stores/serverInfoStore.js";

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
const serverInfoStore = useServerInfoStore();
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

// 根据类别获取成就
const achievementsInClass = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.class_id === zzzGetClassIdByName(achievementClass.value))
});

// 根据条件排序
const sortedAchievements = computed(() => {
  if (achievementStore.isCompleteFirst) {
    return [...achievementsInClass.value].sort((a, b) => {
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
    return achievementsInClass.value;
  }
});

// 过滤器
const input = ref("");
const type = ref("全部");

const filteredAchievements = computed(() => {
  let achievementsInType;

  switch (type.value) {
    case '全部':
      achievementsInType = sortedAchievements.value;
      break;
    case '未完成':
      achievementsInType = sortedAchievements.value.filter(achieve => getProgress(achieve.achievement_id) === 0);
      break;
    case '已完成':
      achievementsInType = sortedAchievements.value.filter(achieve => getProgress(achieve.achievement_id) !== 0);
      break;
    case '最新版本':
      achievementsInType = sortedAchievements.value.filter(achieve => achieve.game_version === serverInfoStore.lastestInfo.zzz_version);
      break;
    default:
      achievementsInType = sortedAchievements.value;
  }

  if (input.value !== "") {
    return achievementsInType.filter(achieve => achieve.name.includes(input.value) || achieve.game_version === input.value);
  } else {
    return achievementsInType;
  }
})

// 渲染优化部分
const num = ref(30);
const displayList = computed(() => filteredAchievements.value.slice(0, num.value));

const loadMore = (direction) => {
  if (direction === 'bottom') {
    num.value += 10
  }
}

watch([input, type], () => {
  // 1. 重置渲染数量，避免之前的长列表影响性能
  num.value = 30;
});
</script>

<template>
  <div class="zzz-table-header">
    <selector-zzz-class v-if="isMobileStore.isMobile" v-model="achievementClass" :uuid="props.uuid"
                        class="zzz-table-header-select"/>
    <card-zzz-statistic-class :achievement-class="achievementClass" :uuid="props.uuid" class="zzz-table-header-card"/>
  </div>

  <filter-zzz-achievement v-model:input="input" v-model:type="type" class="zzz-filter-container"/>

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
/* header */
.zzz-table-header-card {
  margin-bottom: 10px
}

@media (max-width: 900px) {
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
    margin-bottom: 0;
    margin-left: 5px;
    flex: 3;
  }
}

/* filter */
.zzz-filter-container {
  margin-bottom: 10px;
}

/* table */
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
}
</style>