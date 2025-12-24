<script setup>
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import {computed} from "vue";
import SrAchievementImg1 from '@/assets/sr-image/sr-achievement-level-1.png';
import SrAchievementImg2 from '@/assets/sr-image/sr-achievement-level-2.png';
import SrAchievementImg3 from '@/assets/sr-image/sr-achievement-level-3.png';
import {branchAchievementCountByClass, branchAchievementCountByClassAndLevel} from "@/utils/countBranchAchievement.js";

// 使用Pinia作为本地缓存
const achievementStore = useSrAchievementStore()

// 传入只读数据
const props = defineProps({
  uuid: String,
  achievementClass: String,
})

// 计算成就数量
const totalNumber = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.class_name === props.achievementClass).length
      - branchAchievementCountByClass('SR', props.achievementClass);
})
const completeNumber = computed(() => {
  return achievementStore.getCompleteRecordNumberByClass(props.uuid, props.achievementClass);
})

const getLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1
          && achievement.class_name === props.achievementClass).length
      - branchAchievementCountByClassAndLevel('SR', props.achievementClass, 1);
})
const getCompleteLevel1Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByClassAndLevel(props.uuid, props.achievementClass, 1);
})

const getLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2
          && achievement.class_name === props.achievementClass).length
      - branchAchievementCountByClassAndLevel('SR', props.achievementClass, 2);
})
const getCompleteLevel2Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByClassAndLevel(props.uuid, props.achievementClass, 2);
})

const getLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3
          && achievement.class_name === props.achievementClass).length
      - branchAchievementCountByClassAndLevel('SR', props.achievementClass, 3);
})
const getCompleteLevel3Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByClassAndLevel(props.uuid, props.achievementClass, 3);
})
</script>

<template>
  <div class="sr-statistic-class-wrapper">
    <el-scrollbar>
      <div class="sr-statistic-class">
        <div class="sr-statistic-left">
          <p class="sr-statistic-title">{{ props.achievementClass }}</p>
          <p class="sr-statistic-count">成就进度 {{ completeNumber }}/{{ totalNumber }}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg3" alt="achievement image" class="sr-statistic-img"/>
          <p class="sr-statistic-level-count">{{ getCompleteLevel3Number }}/{{ getLevel3Number }}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg2" alt="achievement image" class="sr-statistic-img"/>
          <p class="sr-statistic-level-count">{{ getCompleteLevel2Number }}/{{ getLevel2Number }}</p>
        </div>
        <div class="sr-statistic-level">
          <img :src="SrAchievementImg1" alt="achievement image" class="sr-statistic-img"/>
          <p class="sr-statistic-level-count">{{ getCompleteLevel1Number }}/{{ getLevel1Number }}</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sr-statistic-class {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
}

.sr-statistic-left {
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .sr-statistic-class-wrapper {
    margin-top: 10px;
    height: 50px;
  }
}

/* 类别总计 */
.sr-statistic-title {
  color: #ffffff;
  font-weight: bold;
  font-size: 36px;
  white-space: nowrap
}

.sr-statistic-count {
  color: #fae5c0;
  font-weight: bold;
  font-size: 18px;
}

@media (max-width: 900px) {
  .sr-statistic-title {
    font-size: 20px;
  }

  .sr-statistic-count {
    font-size: 14px;
  }
}

/* 级别统计 */
.sr-statistic-level {
  margin-left: 45px;
  position: relative;

  display: flex;
}

.sr-statistic-level + .sr-statistic-level {
  margin-left: 75px;
}

.sr-statistic-img {
  max-height: 65px;
  object-fit: contain;
}

.sr-statistic-level-count {
  position: absolute;
  margin-left: 55px;
  margin-top: 40px;

  color: #fae5c0;
  font-weight: bold;
  font-size: 18px;
}

@media (max-width: 900px) {
  .sr-statistic-level {
    margin-left: 25px;
  }

  .sr-statistic-level + .sr-statistic-level {
    margin-left: 55px;
  }

  .sr-statistic-img {
    max-height: 40px;
  }

  .sr-statistic-level-count {
    margin-left: 35px;
    margin-top: 25px;

    font-size: 14px;
  }
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>