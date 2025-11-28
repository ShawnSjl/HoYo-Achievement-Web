<script setup>
import {computed} from 'vue';
import { useZzzAchievementStore } from "@/stores/zzzAchievementsStore";
import ZzzAchievementImg1 from '@/assets/zzz-image/zzz-achievement-level-1.png';
import ZzzAchievementImg2 from '@/assets/zzz-image/zzz-achievement-level-2.png';
import ZzzAchievementImg3 from '@/assets/zzz-image/zzz-achievement-level-3.png';
import ZzzAchievementReward from '@/assets/zzz-image/zzz-achievement-reward.png';
import {useIsMobileStore} from "@/stores/isMobileStore";
import {showInfo} from "@/utils/notification";

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore()
const isMobileStore = useIsMobileStore();

// 传入参数
const props = defineProps({
  achievement: Object,
})

// 获取成就图片
const achievementImg = computed(() => {
  switch (props.achievement.reward_level) {
    case 3:
      return ZzzAchievementImg3
    case 2:
      return ZzzAchievementImg2
    default:
      return ZzzAchievementImg1
  }
})

// 获取奖励数量
const achievementReward = computed(() => {
  switch (props.achievement.reward_level) {
    case 1:
      return 5;
    case 2:
      return 10;
    case 3:
      return 20;
    default:
      return 0;
  }
});

// 获取按钮状态
const completeButtonMsg = computed(() => {
  if (props.achievement.complete === 0) {return "未完成"}
  else if (props.achievement.complete === 1) {return "已完成"}
  else {return "完成分支"}
})
const isComplete = computed(() => {return props.achievement.complete === 1});
const disableButton = computed(() => {return props.achievement.complete === 2});

const handleComplete = async () => {
  if (props.achievement.complete === 2) {
    showInfo('该分支成就已完成，不可更改')
    return;
  }
  const newState = props.achievement.complete === 1 ? 0 : 1;
  await achievementStore.completeAchievement(props.achievement.achievement_id, newState);
}

// 处理特殊文本
const maleTextPattern = /\{M#([^\}]+)\}/
const femaleTextPattern = /\{F#([^\}]+)\}/
const getAchievementName = computed(() => {
  if (maleTextPattern.test(props.achievement.name) || femaleTextPattern.test(props.achievement.name)) {
    return props.achievement.name.match(achievementStore.isMale ? maleTextPattern : femaleTextPattern)[1]
  } else {
    return props.achievement.name
  }
})
</script>

<template>
  <div class="zzz-table-row">
    <div class="zzz-table-row-left">
      <div class="zzz-achievement-image-bg">
        <img :src="achievementImg" alt="achievement image" class="zzz-achievement-image" />
      </div>
      <div class="zzz-detail">
        <div class="zzz-name">
          {{ getAchievementName }}
          <span v-if="props.achievement.hidden !== 0" class="zzz-hidden-badge">
            隐藏
          </span>
        </div>
        <div class="zzz-desc">{{ props.achievement.description }}</div>
      </div>
    </div>

    <div class="zzz-table-row-right">
      <div class="zzz-game-version" >{{ props.achievement.game_version }}</div>
      <div v-if="!isMobileStore.isMobile" class="zzz-reward-bg">
        <img :src="ZzzAchievementReward" alt="achievement reward" class="zzz-achievement-reward-image" />
        <div class="zzz-achievement-reward-count">{{achievementReward}}</div>
      </div>
      <el-button round :disabled="disableButton" :plain="!isComplete" color="#ffd100" dark @click="handleComplete"
                 class="zzz-complete-button">
        {{ completeButtonMsg }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.zzz-table-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-content: center;
}

.zzz-table-row-left {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 2;
}

@media (max-width: 900px) {
  .zzz-table-row-left {
    flex: 3;
  }
}

.zzz-table-row-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

/* 成就图片 */
.zzz-achievement-image-bg{
  width: 60px;
  height: 60px;
  flex-shrink: 0; /* 不允许收缩 */
  border-radius: 50%; /* 核心代码：让图片变圆 */
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zzz-achievement-image {
  width: 54px;
  height: 54px;
  border-radius: 50%; /* 核心代码：让图片变圆 */
  object-fit: cover;   /* 保证图片不变形、居中裁剪 */
}

@media (max-width: 900px) {
  .zzz-achievement-image-bg{
    width: 40px;
    height: 40px;
  }

  .zzz-achievement-image {
    width: 36px;
    height: 36px;
  }
}

/* 成就奖励图片 */
.zzz-reward-bg{
  position: relative;
  width: 78px;
  height: 50px;
  border-radius: 25px; /* 核心代码：让图片变圆 */
  background-color: #000000;
  margin-right: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.zzz-achievement-reward-image {
  width: 70px;
  height: 46px;
  object-fit: contain;
}

.zzz-achievement-reward-count {
  height: 20px;
  width: 70px;
  position: absolute;
  padding-top: 25px;

  color: white;
  font-size: 16px;
  text-shadow:
      -2px -2px 2px black,
      2px -2px 2px black,
      -2px 2px 2px black,
      2px 2px 2px black;
  font-weight: bold;
  text-align: center;
}

/* 成就介绍 */
.zzz-detail {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  gap: 10px;
  padding: 15px;
}

.zzz-name {
  flex: 1;
  font-weight: bold;
  font-size: 17px;
  color: #cccccc;
}

.zzz-desc {
  flex: 1;
  text-align: left;
  word-break: break-word;
  color: #acacac;
}

.zzz-hidden-badge {
  background-color: #f11a1a;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  position: relative;
  top: -10px;
  left: -10px;
}

@media (max-width: 900px) {
  .zzz-detail {
    font-size: 12px;
    gap: 6px;
    padding: 7px;
  }

  .zzz-name {
    font-size: 15px;
  }

  .zzz-hidden-badge {
    font-size: 10px;
  }
}

/* 成就版本 */
.zzz-game-version {
  font-weight: normal;
  font-size: 17px;
  margin-right: 25px;
  color: #acacac;
}

@media (max-width: 900px) {
  .zzz-game-version {
    font-weight: normal;
    font-size: 14px;
    margin-right: 5px;
  }
}

/* 完成按钮 */
.zzz-complete-button {
  margin-right: 10px;
}

@media (max-width: 900px) {
  .zzz-complete-button {
    margin-right: 0;
  }
}

.el-button {
  width: 80px;
}
</style>