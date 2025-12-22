<script setup>
import {computed, watch} from "vue";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore";
import {zzzGetClassByCategory, zzzGetClassIdByName} from "@/utils/zzzAchievementClass";
import {useAccountStore} from "@/stores/accountStore.js";
import CardZzzStatisticTotal from "@/views/ZzzAchievement/CardZzzStatisticTotal.vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
  category: String,
})

// 传入可写数据
const achievementClass = defineModel();

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const achievementStore = useZzzAchievementStore();

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账号成就
const account = computed(() =>
    accounts.value.find(account => account.uuid === props.uuid)
);

// 根据大类别获取小类别列表
const classes = computed(() => zzzGetClassByCategory(props.category));
watch(classes, (newClasses) => {
  achievementClass.value = newClasses[0];
}, {immediate: true});

// 计算完成度百分比
const completePercentage = computed(() => {
  return (className) => {
    const classId = zzzGetClassIdByName(className);

    const numberTotal = account.value.achievements.filter(achievement => achievement.class_id === classId).length
        - achievementStore.getBranchAchievementsNumberByClass(props.uuid, classId);

    const numberComplete = account.value.achievements.filter(achievement => achievement.class_id === classId &&
        achievement.complete === 1).length;

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