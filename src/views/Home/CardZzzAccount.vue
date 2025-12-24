<script setup>
import {computed} from 'vue';
import router from "@/router/index.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import ZzzLogo from '@/assets/zzz-image/zzz-logo.png';
import ZzzAchievementImg1 from '@/assets/zzz-image/zzz-achievement-level-1.png';
import ZzzAchievementImg2 from '@/assets/zzz-image/zzz-achievement-level-2.png';
import ZzzAchievementImg3 from '@/assets/zzz-image/zzz-achievement-level-3.png';
import {useAccountStore} from "@/stores/accountStore.js";
import {useServerInfoStore} from "@/stores/serverInfoStore.js";
import ButtonEditAccount from "@/views/Home/ButtonEditAccount.vue";
import {branchAchievementCount, branchAchievementCountByLevel} from "@/utils/achievementCount.js";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const achievementStore = useZzzAchievementStore();
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
const getTotalNumber = computed(() => {
  return achievementStore.achievements.length - branchAchievementCount('ZZZ');
})
const getTotalCompleteNumber = computed(() => {
  return account.records.filter(record => record.complete === 1).length;
})

const getLevel1Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 1).length
      - branchAchievementCountByLevel('ZZZ', 1);
})
const getCompleteLevel1Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByLevel(props.uuid, 1);
})

const getLevel2Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 2).length
      - branchAchievementCountByLevel('ZZZ', 2);
})
const getCompleteLevel2Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByLevel(props.uuid, 2);
})

const getLevel3Number = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.reward_level === 3).length
      - branchAchievementCountByLevel('ZZZ', 3);
})
const getCompleteLevel3Number = computed(() => {
  return achievementStore.getCompleteRecordNumberByLevel(props.uuid, 3);
})

// 处理点击转跳
const handleClick = () => {
  const shortId = props.uuid.slice(-8);

  router.push({
    path: '/zzz',
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
          <div style="display: flex; flex-direction: row; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <el-avatar :src="ZzzLogo" shape="square" size="default"/>
              <div>
                <p class="username">{{ account.name }}</p>
                <p class="uid">UID: {{ account.inGameUid }} </p>
              </div>
            </div>
            <div style="display: flex; flex-direction: row-reverse">
              <button-edit-account :uuid="props.uuid"/>
            </div>
          </div>
        </div>
      </template>

      <div class="card-body">
        <div>
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
        </div>

        <div style="display: flex; flex-direction: column-reverse">
          <p class="version">版本： {{ serverInfoStore.lastestInfo.zzz_version }}</p>
        </div>
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

/* header文字样式 */
.username {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-left: 20px;
  padding-bottom: 5px;
}

.uid {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-left: 20px;

  font-size: 12px;
  color: #909399;
  font-family: Consolas, monospace;
}

/* body布局样式 */
.card-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* body内容样式 */
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

.version {
  margin-block-start: 0;
  margin-block-end: 0;
  font-size: 14px;
  color: #909399;
}

/* 卡片样式 */
.el-card {
  --el-card-bg-color: rgba(22, 24, 23, 0);
  --el-card-border-color: rgb(35, 37, 36);
  --el-card-border-width: 2px;
  color: #f6f6f6;
}

:deep(.el-card__header) {
  padding-bottom: 5px;
  padding-top: 20px;
  padding-left: 20px;
}

:deep(.el-card__body) {
  padding-top: 5px;
  padding-bottom: 15px;
}

p {
  margin-left: 30px;
}
</style>