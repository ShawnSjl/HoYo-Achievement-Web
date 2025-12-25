<script setup>
import {computed} from "vue";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";
import router from "@/router/index.js";
import SrLogo from '@/assets/sr-image/sr-logo.png';
import SrAchievementImg3 from "@/assets/sr-image/sr-achievement-level-3.png";
import SrAchievementImg2 from "@/assets/sr-image/sr-achievement-level-2.png";
import SrAchievementImg1 from "@/assets/sr-image/sr-achievement-level-1.png";
import SrAchievement from "@/assets/sr-image/sr-achievement.png";
import {useAccountStore} from "@/stores/accountStore.js";
import {useServerInfoStore} from "@/stores/serverInfoStore.js";
import ButtonEditAccount from "@/views/Home/ButtonEditAccount.vue";
import {branchAchievementCountByLevel} from "@/utils/countBranchAchievement.js";
import {completeAchievementCountByLevel} from "@/utils/countCompleteAchievement.js";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const achievementStore = useSrAchievementStore();
const serverInfoStore = useServerInfoStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
});

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账号成就
const account = accounts.value.find(account => account.uuid === props.uuid);

// 计算成就数量
const totalNumber = computed(() => {
  return getLevel1Number.value + getLevel2Number.value + getLevel3Number.value;
})
const completeNumber = computed(() => {
  return getCompleteLevel1Number.value + getCompleteLevel2Number.value + getCompleteLevel3Number.value;
})

const getLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1).length
      - branchAchievementCountByLevel('SR', 1);
})
const getCompleteLevel1Number = computed(() => {
  return completeAchievementCountByLevel('SR', props.uuid, 1);
})

const getLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2).length
      - branchAchievementCountByLevel('SR', 2);
})
const getCompleteLevel2Number = computed(() => {
  return completeAchievementCountByLevel('SR', props.uuid, 2);
})

const getLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3).length
      - branchAchievementCountByLevel('SR', 3);
})
const getCompleteLevel3Number = computed(() => {
  return completeAchievementCountByLevel('SR', props.uuid, 3);
})

// 处理点击转跳
const handleClick = () => {
  const shortId = props.uuid.slice(-8);

  router.push({
    path: '/sr',
    query: {
      id: shortId
    }
  });
}
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" @click="handleClick">
      <template #header>
        <div slot="header">
          <div class="card-header-wrapper">
            <div class="card-header-left-wrapper">
              <el-avatar :src="SrLogo" shape="square" size="default"/>
              <div class="account-info">
                <p class="account-name">{{ account.name }}</p>
                <p class="account-uid">UID: {{ account.inGameUid }} </p>
              </div>
            </div>
            <div class="card-header-right-wrapper">
              <button-edit-account :uuid="props.uuid"/>
            </div>
          </div>
        </div>
      </template>

      <div class="sr-profile-statistic-wrapper">
        <div class="sr-statistic-total-wrapper">
          <div class="sr-statistic-total">
            <img :src="SrAchievement" alt="sr achievement" class="sr-header-title-img">
            <p class="sr-statistic-total-title">达成成就</p>
          </div>
          <p class="sr-statistic-total-count">{{ completeNumber }}/{{ totalNumber }}</p>
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

      <template #footer>
        <div style="display: flex; flex-direction: row-reverse">
          <p class="version">版本： {{ serverInfoStore.lastestInfo.sr_version }}</p>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.card-bg {
  background-image: url("@/assets/sr-image/sr-bg-3.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 16px;
  overflow: hidden;
  min-height: 360px;
}

/* header文字样式 */
.card-header-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-header-left-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.card-header-right-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

.account-info {
  display: flex;
  flex-direction: column;

  margin-left: 10px;

  flex: 1;
  min-width: 0;
}

.account-name {
  margin-block-start: 0;
  margin-block-end: 0;
  padding-bottom: 5px;

  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号 (...) */
  width: 100%; /* 确保宽度占满父容器，不然可能切不断 */
}

.account-uid {
  margin-block-start: 0;
  margin-block-end: 0;

  font-size: 12px;
  color: #909399;
  font-family: Consolas, monospace;

  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号 (...) */
  width: 100%; /* 确保宽度占满父容器，不然可能切不断 */
}

/* body布局样式 */
.card-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* body内容样式 */
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

.sr-statistic-level + .sr-statistic-level {
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

/* footer样式 */
.version {
  margin-block-start: 0;
  margin-block-end: 0;
  font-size: 14px;
  color: #909399;
}

/* 卡片样式 */
.el-card {
  --el-card-bg-color: rgba(22, 24, 23, 0);
  --el-card-border-color: rgba(35, 37, 36, 0);
  --el-card-border-width: 2px;
  color: #f4f4f4;
}

:deep(.el-card__header) {
  padding-bottom: 5px;
  padding-top: 20px;
  padding-left: 20px;
}

:deep(.el-card__body) {
  padding-top: 5px;
  padding-bottom: 5px;
}

:deep(.el-card__footer) {
  padding: 0 20px 0 20px;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>