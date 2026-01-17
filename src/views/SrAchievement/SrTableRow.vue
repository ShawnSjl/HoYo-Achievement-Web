<script setup>
import {computed} from 'vue';
import {useIsMobileStore} from "@/scripts/stores/isMobileStore";
import SrAchievementReward from "@/assets/sr-image/sr-achievement-reward.png";
import {srClasses} from "@/scripts/utils/srAchievementClass";
import {showInfo} from "@/scripts/utils/notification";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore";

// 使用Pinia作为本地缓存
const isMobileStore = useIsMobileStore();
const achievementStore = useSrAchievementStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
  achievement: Object,
  status: Number,
})

// 获取成就图片
const achievementImg = computed(() => {
  const class_id = srClasses.indexOf(props.achievement.class_name) + 1;
  return new URL(`/src/assets/sr-image/sr-class-${class_id}-level-${props.achievement.reward_level}.png`, import.meta.url).href
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
  switch (props.status) {
    case 0:
      return "未完成";
    case 1:
      return "已完成";
    case 2:
      return "完成分支";
    default:
      return "未完成";
  }
})
const isComplete = computed(() => {
  return props.status === 1
});
const disableButton = computed(() => {
  return props.status === 2
});

// 处理按钮点击
const handleComplete = async () => {
  if (props.status === 2) {
    showInfo('该分支成就已完成，不可更改')
    return;
  }
  const newState = props.status === 1 ? 0 : 1;
  await achievementStore.completeAchievement(props.uuid, props.achievement.achievement_id, newState);
}

// 处理特殊文本
const textBefore = computed(() => {
  const str = props.achievement.description || '';
  const index = str.indexOf('※');

  // 没找到就返回整个字符串
  if (index === -1) return str;

  return str.slice(0, index);
});

const textAfter = computed(() => {
  const str = props.achievement.description || '';
  const index = str.indexOf('※');

  // 如果没找到符号，这里返回空字符串
  if (index === -1) return '';

  // slice(index) 会从该索引开始截取直到末尾，正好包含索引处的字符 '※'
  return str.slice(index);
});
</script>

<template>
  <div class="sr-table-row">
    <div class="sr-table-row-left">
      <img :src="achievementImg" alt="achievement image" class="sr-achievement-image"/>
      <div class="sr-detail">
        <div class="sr-name">
          {{ props.achievement.name }}
        </div>
        <div class="sr-desc">{{ textBefore }}</div>
        <div class="sr-sub-desc">{{ textAfter }}</div>
      </div>
    </div>

    <div class="sr-table-row-right">
      <el-button :disabled="disableButton" :plain="!isComplete" class="sr-complete-button" round type="primary"
                 @click="handleComplete">
        {{ completeButtonMsg }}
      </el-button>
      <div v-if="!isMobileStore.isMobile" class="sr-achievement-reward-bg">
        <img :src="SrAchievementReward" alt="achievement reward" class="sr-achievement-reward-image"/>
        <div class="sr-achievement-reward-count">{{ achievementReward }}</div>
      </div>
      <div class="sr-game-version">{{ props.achievement.game_version }}</div>
    </div>
  </div>
</template>

<style scoped>
.sr-table-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-content: center;
}

.sr-table-row-left {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 2;
}

.sr-table-row-right {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-left: 10px;
}

@media (max-width: 900px) {
  .sr-table-row {
    justify-content: normal;
  }

  .sr-table-row-left {
    flex: 3;
  }

  .sr-table-row-right {
    margin-left: 0;
  }
}

/* 成就图片 */
.sr-achievement-image {
  width: 53px;
  height: 53px;
  border-radius: 50%; /* 核心代码：让图片变圆 */
  object-fit: contain; /* 保证图片不变形、居中裁剪 */
  background-color: #6a6a6b;
}

@media (max-width: 900px) {
  .sr-achievement-image {
    width: 36px;
    height: 36px;
  }
}

/* 成就奖励图片 */
.sr-achievement-reward-bg {
  position: relative;
  width: 70px; /* 控制背景大小 */
  height: 70px;
  background: linear-gradient(to bottom, #9a6450, #efb700);
  border-top-right-radius: 12px;
  margin-right: 20px;

  display: flex; /* 用 flex 居中图片 */
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 确保图片不超出边界 */
}

.sr-achievement-reward-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.sr-achievement-reward-count {
  height: 16px;
  width: 70px;
  position: absolute;
  margin-top: 54px;

  background-color: rgba(64, 40, 0, 0.6); /* 半透明黑底 */
  color: white;

  font-weight: bold;
  text-align: center;
  font-size: 12px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 成就介绍 */
.sr-detail {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 10px 15px 10px 15px;
}

.sr-name {
  flex: 1;
  font-weight: bold;
  font-size: 17px;
  color: rgb(14, 14, 14);
  white-space: nowrap;
}

.sr-desc {
  flex: 1;
  text-align: left;
  word-break: break-word;
  color: #716f6f;
}

.sr-sub-desc {
  flex: 1;
  text-align: left;
  word-break: break-word;
  color: #8790ab;
}

.sr-sub-desc:empty::before {
  content: "\00a0";
  display: inline-block;
  width: 0;
}

@media (max-width: 900px) {
  .sr-detail {
    font-size: 14px;
    padding: 7px;
  }

  .sr-name {
    font-size: 16px;
  }
}

/* 成就版本 */
.sr-game-version {
  font-weight: normal;
  font-size: 17px;
  margin-right: 25px;
  color: #555555;
}

@media (max-width: 900px) {
  .sr-game-version {
    font-weight: normal;
    font-size: 14px;
    margin-right: 5px;
  }
}

/* 完成按钮 */
.sr-complete-button {
  margin-right: 10px;
}

@media (max-width: 900px) {
  .sr-complete-button {
    margin-right: 0;
  }
}

.el-button {
  width: 80px;
}
</style>