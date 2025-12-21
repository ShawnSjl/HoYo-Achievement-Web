<script setup>
import {computed} from 'vue';
import router from "@/router/index.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import {zzzVersion} from "@/utils/config.js";
import ZzzAchievementImg1 from '@/assets/zzz-image/zzz-achievement-level-1.png';
import ZzzAchievementImg2 from '@/assets/zzz-image/zzz-achievement-level-2.png';
import ZzzAchievementImg3 from '@/assets/zzz-image/zzz-achievement-level-3.png';
import {useAccountStore} from "@/stores/accountStore.js";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const achievementStore = useZzzAchievementStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
});

// 获取账号成就
const account = accountStore.accounts.find(account => account.uuid === props.uuid);

// 计算成就数量
const getTotalNumber = computed(() => {
  return account.achievements.length
      - achievementStore.getBranchAchievementsNumber();
})
const getTotalCompleteNumber = computed(() => {
  return account.achievements.filter(achievement => achievement.complete === 1).length;
})

const getLevel1Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 1).length
      - achievementStore.getBranchAchievementNumberByLevel(account.achievements, 1);
})
const getCompleteLevel1Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 1 &&
      achievement.complete === 1
  ).length;
})

const getLevel2Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 2).length
      - achievementStore.getBranchAchievementNumberByLevel(account.achievements, 2);
})
const getCompleteLevel2Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 2 &&
      achievement.complete === 1
  ).length;
})

const getLevel3Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 3).length
      - achievementStore.getBranchAchievementNumberByLevel(account.achievements, 3);
})
const getCompleteLevel3Number = computed(() => {
  return account.achievements.filter(achievement => achievement.reward_level === 3 &&
      achievement.complete === 1
  ).length;
})

// 处理点击转跳
const handleClick = () => {
  router.push({path: '/zzz'});
}
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" @click="handleClick">
      <template #header>
        <div slot="header">
          绝区零成就完成度统计 游戏版本: {{ zzzVersion }}
        </div>
      </template>

      <div class="zzz-statistic-total">
        <div style="align-self: center; margin-left: 11px">总计：</div>
        <p> {{ getTotalCompleteNumber }} / {{ getTotalNumber }}</p>
      </div>
      <div class="zzz-statistic-total">
        <img :src="ZzzAchievementImg1" alt="achievement image" class="zzz-achievement-image"/>
        <p> {{ getCompleteLevel1Number }} / {{ getLevel1Number }}</p>
      </div>
      <div class="zzz-statistic-total">
        <img :src="ZzzAchievementImg2" alt="achievement image" class="zzz-achievement-image"/>
        <p> {{ getCompleteLevel2Number }} / {{ getLevel2Number }}</p>
      </div>
      <div class="zzz-statistic-total">
        <img :src="ZzzAchievementImg3" alt="achievement image" class="zzz-achievement-image"/>
        <p> {{ getCompleteLevel3Number }} / {{ getLevel3Number }}</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-bg {
  background-image: url("@/assets/zzz-image/zzz-bg-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  border-radius: 16px;
  overflow: hidden;
}

.zzz-statistic-total {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  margin-bottom: 10px;
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
  --el-card-bg-color: rgba(22, 24, 23, 0);
  --el-card-border-color: rgb(35, 37, 36);
  --el-card-border-width: 2px;
  color: #f6f6f6;
}

:deep(.el-card__body) {
  padding-top: 15px !important;
  padding-bottom: 15px !important;
}

p {
  margin-left: 30px;
}
</style>