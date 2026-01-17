<script setup>
import {computed} from 'vue';
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore";
import ZzzAchievementImg1 from '@/assets/zzz-image/zzz-achievement-level-1.png';
import ZzzAchievementImg2 from '@/assets/zzz-image/zzz-achievement-level-2.png';
import ZzzAchievementImg3 from '@/assets/zzz-image/zzz-achievement-level-3.png';
import {useServerInfoStore} from "@/scripts/stores/serverInfoStore.js";
import {branchAchievementCountByLevel} from "@/scripts/utils/countBranchAchievement.js";
import {completeAchievementCountByLevel} from "@/scripts/utils/countCompleteAchievement.js";

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore();
const serverInfoStore = useServerInfoStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
});

// 计算成就数量
const getTotalNumber = computed(() => {
  return getLevel1Number.value + getLevel2Number.value + getLevel3Number.value;
})
const getTotalCompleteNumber = computed(() => {
  return getCompleteLevel1Number.value + getCompleteLevel2Number.value + getCompleteLevel3Number.value;
})

const getLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1).length
      - branchAchievementCountByLevel('ZZZ', 1);
})
const getCompleteLevel1Number = computed(() => {
  return completeAchievementCountByLevel('ZZZ', props.uuid, 1);
})

const getLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2).length
      - branchAchievementCountByLevel('ZZZ', 2);
})
const getCompleteLevel2Number = computed(() => {
  return completeAchievementCountByLevel('ZZZ', props.uuid, 2);
})

const getLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3).length
      - branchAchievementCountByLevel('ZZZ', 3);
})
const getCompleteLevel3Number = computed(() => {
  return completeAchievementCountByLevel('ZZZ', props.uuid, 3);
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div slot="header">
        成就完成度统计 游戏版本: {{ serverInfoStore.lastestInfo.zzz_version }}
      </div>
    </template>
    <div class="zzz-statistic-total">
      <div style="align-self: center; margin-left: 11px">总计：</div>
      <p> {{ getTotalCompleteNumber }} / {{ getTotalNumber }}</p>
    </div>
    <div class="zzz-statistic-detail">
      <img :src="ZzzAchievementImg1" alt="achievement image" class="zzz-achievement-image"/>
      <p> {{ getCompleteLevel1Number }} / {{ getLevel1Number }}</p>
    </div>
    <div class="zzz-statistic-detail">
      <img :src="ZzzAchievementImg2" alt="achievement image" class="zzz-achievement-image"/>
      <p> {{ getCompleteLevel2Number }} / {{ getLevel2Number }}</p>
    </div>
    <div class="zzz-statistic-detail">
      <img :src="ZzzAchievementImg3" alt="achievement image" class="zzz-achievement-image"/>
      <p> {{ getCompleteLevel3Number }} / {{ getLevel3Number }}</p>
    </div>
  </el-card>
</template>

<style scoped>
.zzz-statistic-total {
  display: flex;
  flex-direction: row;
  align-content: space-between;
}

.zzz-statistic-detail {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  margin-top: 10px;
}

@media (max-height: 900px) {
  .zzz-statistic-detail {
    display: none;
  }
}

.zzz-achievement-image {
  width: 53px;
  height: 53px;
  border-radius: 50%; /* 核心代码：让图片变圆 */
  object-fit: cover; /* 保证图片不变形、居中裁剪 */
  border: 3px solid #000000; /* 可选的边框 */
  background-color: #000000;
}

.el-card {
  --el-card-bg-color: #161817;
  --el-card-border-color: #232524;
  color: #cacaca;
}

:deep(.el-card__body) {
  padding: 15px !important;
}

p {
  margin-left: 30px;
}
</style>