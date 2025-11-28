<script setup>
import {computed, ref} from "vue";
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import SrAchievementImg3 from "@/assets/sr-image/sr-achievement-level-3.png";
import SrAchievementImg2 from "@/assets/sr-image/sr-achievement-level-2.png";
import SrAchievementImg1 from "@/assets/sr-image/sr-achievement-level-1.png";

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

const extendVisible = ref(false);
const handleClick = () => {
  extendVisible.value = !extendVisible.value;
}
</script>

<template>
  <div :class="['sr-statistic-total-wrapper', { active: extendVisible}]" @click="handleClick">
    <div class="sr-statistic-total">
      <p class="sr-statistic-total-title">达成成就</p>
      <p class="sr-statistic-total-count">{{completeNumber}}/{{totalNumber}}</p>
    </div>

    <div v-if="extendVisible" class="sr-statistic-detail-wrapper">
      <div class="vertical-divider"></div>
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
  </div>
</template>

<style scoped>
.sr-statistic-total-wrapper {
  height: 76px;
  width: auto;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 38px;

  display: flex;
  flex-direction: row;
}

/* 左侧主体 */
.sr-statistic-total {
  margin-left: 20px;
  margin-right: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sr-statistic-total-title {
  color: rgba(213, 213, 213, 0.75);
}

.sr-statistic-total-count {
  font-size: 24px;
}

/* 分割线 */
.vertical-divider {
  width: 1px;        /* 很细 */
  height: 80%;      /* 撑满父容器高度 */
  background-color: rgba(204, 204, 204, 0.64); /* 灰色，可以换别的颜色 */
}

/* 右侧统计 */
.sr-statistic-detail-wrapper {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
}

.sr-statistic-level {
  margin-left: 25px;
  position: relative;

  display: flex;
}

.sr-statistic-level+.sr-statistic-level {
  margin-left: 15px;
}

.sr-statistic-img {
  max-height: 55px;
  object-fit: contain;
}

.sr-statistic-level-count {
  margin-left: 10px;
  margin-right: 20px;
  margin-top: 34px;
  position: static;

  font-weight: bold;
  font-size: 16px;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>