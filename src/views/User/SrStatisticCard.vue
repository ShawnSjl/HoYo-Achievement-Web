<script setup>
import {computed} from "vue";
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import router from "@/router";
import {srVersion} from "@/utils/config";
import SrAchievementImg3 from "@/assets/sr-image/sr-achievement-level-3.png";
import SrAchievementImg2 from "@/assets/sr-image/sr-achievement-level-2.png";
import SrAchievementImg1 from "@/assets/sr-image/sr-achievement-level-1.png";
import SrAchievement from "@/assets/sr-image/sr-achievement.png";

const handleClick = () => {
  router.push({ path: '/sr' });
}

// 使用Pinia作为本地缓存
const achievementStore = useSrAchievementStore()

const totalNumber = computed(() => {
  return achievementStore.achievements.length
      - achievementStore.getBranchAchievementsNumber();
})
const completeNumber = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.complete === 1).length;
})

const getLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1).length
      - achievementStore.getBranchAchievementNumberByLevel(1);
})
const getCompleteLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1
      && achievement.complete === 1).length;
})

const getLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2).length
      - achievementStore.getBranchAchievementNumberByLevel(2);
})
const getCompleteLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2
      && achievement.complete === 1).length;
})

const getLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3).length
      - achievementStore.getBranchAchievementNumberByLevel(3);
})
const getCompleteLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3
      && achievement.complete === 1).length;
})
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" @click="handleClick">
      <template #header>
        <div slot="header">
          崩坏：星穹铁道 游戏版本：{{srVersion}}
          <br/>
          成就完成度统计
        </div>
      </template>

      <div class="sr-profile-statistic-wrapper">
        <div class="sr-statistic-total-wrapper">
          <div class="sr-statistic-total">
            <img :src="SrAchievement" class="sr-header-title-img" alt="sr achievement">
            <p class="sr-statistic-total-title">达成成就</p>
          </div>
          <p class="sr-statistic-total-count">{{completeNumber}}/{{totalNumber}}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg3" alt="achievement image" class="sr-statistic-img" />
          <p class="sr-statistic-level-count">{{getCompleteLevel3Number}}/{{getLevel3Number}}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg2" alt="achievement image" class="sr-statistic-img" />
          <p class="sr-statistic-level-count">{{getCompleteLevel2Number}}/{{getLevel2Number}}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg1" alt="achievement image" class="sr-statistic-img" />
          <p class="sr-statistic-level-count">{{getCompleteLevel1Number}}/{{getLevel1Number}}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-bg {
  background-image: url("@/assets/image-sr/sr-bg-3.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 16px;
  overflow: hidden;
  min-height: 360px;
}

.el-card {
  --el-card-bg-color: rgba(22, 24, 23, 0);
  --el-card-border-color: rgba(35, 37, 36, 0);
  --el-card-border-width: 2px;
  color: #f4f4f4;
}

:deep(.el-card__body) {
  padding-top: 0 !important;
}

.sr-profile-statistic-wrapper {
  display: flex;
  flex-direction: column;
}

/* 左侧主体 */
.sr-statistic-total-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sr-header-title-img {
  height: 30px;
  object-fit: contain;
}

.sr-statistic-total {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}

.sr-statistic-total-title {
  color: rgba(213, 213, 213, 0.75);
}

.sr-statistic-total-count {
  font-size: 24px;
}

/* 级别统计 */
.sr-statistic-level {
  position: relative;

  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.sr-statistic-level+.sr-statistic-level {
  margin-top: 10px;
}

.sr-statistic-img {
  max-height: 55px;
  object-fit: contain;
}

.sr-statistic-level-count {
  margin-top: 30px;

  color: #fae5c0;
  font-weight: bold;
  font-size: 18px;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>