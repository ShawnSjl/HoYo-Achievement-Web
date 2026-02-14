<script setup>
import SrTableRow from "@/views/SrAchievement/SrTableRow.vue";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {computed, ref, watch} from "vue";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import FilterSrAchievement from "@/views/SrAchievement/FilterSrAchievement.vue";
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
const achievementStore = useSrAchievementStore();
const serverInfoStore = useServerInfoStore();

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
  return achievementStore.achievements.filter(achievement => achievement.class_name === achievementClass.value)
})

// 过滤器
const input = ref("");
const type = ref("全部");

const filteredAchievements = computed(() => {
  let achievementsInType;

  switch (type.value) {
    case '全部':
      achievementsInType = achievementsInClass.value;
      break;
    case '未完成':
      achievementsInType = achievementsInClass.value.filter(achieve => getProgress(achieve.achievement_id) === 0);
      break;
    case '已完成':
      achievementsInType = achievementsInClass.value.filter(achieve => getProgress(achieve.achievement_id) !== 0);
      break;
    case '最新版本':
      achievementsInType = achievementsInClass.value.filter(achieve => achieve.game_version === serverInfoStore.lastestInfo.sr_version);
      break;
    default:
      achievementsInType = achievementsInClass.value;
  }

  if (input.value !== "") {
    return achievementsInType.filter(achieve => achieve.name.includes(input.value) || achieve.game_version === input.value);
  } else {
    return achievementsInType;
  }
})

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

      // 2️⃣ complete 相同，按 id 升序
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

watch([input, type], () => {
  // 1. 重置渲染数量，避免之前的长列表影响性能
  num.value = 30;
});
</script>

<template>
  <filter-sr-achievement v-model:input="input" v-model:type="type" class="sr-filter-container"/>

  <el-scrollbar :height="tableHeight" @end-reached="loadMore">
    <div class="sr-table">
      <el-card
          v-for="(row, index) in displayList"
          :key="index"
          class="sr-table-row"
          shadow="hover"
      >
        <sr-table-row :achievement="row"
                      :status="getProgress(row.achievement_id)"
                      :uuid="props.uuid"/>
      </el-card>
    </div>
  </el-scrollbar>
</template>

<style scoped>
/* filter */
.sr-filter-container {
  margin-bottom: 10px;
}

/* table */
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