<script setup>
import {computed} from "vue";
import {srClasses} from "@/utils/srAchievementClass";
import {useSrAchievementStore} from "@/stores/srAchievementStore";

const achievementStore = useSrAchievementStore()

const achievementClass = defineModel()

// 获取成就类别图片
function getAchievementImg(cls) {
  const class_id = srClasses.indexOf(cls) + 1;
  return new URL(`/src/assets/image-sr/sr-class-${class_id}.png`, import.meta.url).href
}

const handleSelect = async (srClass) => {
  achievementClass.value = srClass;
}

const completePercentage = computed(() => {
  return (sr_class) => {
    const totalNumber = achievementStore.achievements.filter(achievement => achievement.class === sr_class).length
        - achievementStore.getBranchAchievementsNumberByClass(sr_class);

    const completeNumber = achievementStore.achievements.filter(achievement => achievement.class === sr_class &&
        achievement.complete === 1).length;

    if (totalNumber === 0) return 0; // 避免除以 0

    return Math.floor((completeNumber / totalNumber) * 1000) / 10;
  };
});

// 滚动栏高度
const scrollBarMaxHeight = computed(() => {
  if (window.innerHeight < 900) return 550;
  else return 750;
})
</script>

<template>
  <div class="sr-button-group">
    <el-scrollbar :max-height="scrollBarMaxHeight">
      <div class="sr-button-wrapper">
        <div
            v-for="srClass in srClasses"
            :key="srClass"
            :class="['selector-button', { active: srClass === achievementClass }]"
            @click="handleSelect(srClass)"
        >
          <img :src="getAchievementImg(srClass)" :alt="srClass" class="sr-button-image" />
          <p class="sr-button-text">{{completePercentage(srClass)}}%</p>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
/* 主布局 */
.sr-button-group {
  overflow: hidden;
  width: 130px;
}

.sr-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 8px;
}

@media (max-height: 900px) {
  .sr-button-wrapper {
    gap: 30px;
  }
}

@media (max-width: 900px) {
  .sr-button-group {
    overflow: hidden;
    width: auto;
  }

  .sr-button-wrapper {
    flex-direction: row;
    gap: 10px;
    padding: 0;
    width: fit-content;
  }
}

/* 按钮 */
.selector-button {
  width: 110px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(85, 85, 85, 0.42);

  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
}

.selector-button.active {
  background-color: #409EFF;
}

.sr-button-image {
  height: 50px;
  width: 50px;
  object-fit: contain;
}

.sr-button-text {
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
}

@media (max-width: 900px) {
  .selector-button {
    width: 90px;
    height: 40px;
    border-radius: 20px;
  }

  .sr-button-image {
    height: 36px;
    object-fit: contain;
  }

  .sr-button-text {
    font-size: 13px;
  }
}
</style>