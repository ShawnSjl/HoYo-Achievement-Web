<script setup>
import Avatar from "@/components/Avatar.vue";
import SrAchievement from "@/assets/sr-image/sr-achievement.png"
import ButtonSrSetting from "@/views/SrAchievement/ButtonSrSetting.vue";
import SrStatisticTotal from "@/views/SrAchievement/SrStatisticTotal.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";
import AccountSwitch from "@/components/AccountSwitch.vue";

// 使用Pinia作为本地缓存
const isMobileStore = useIsMobileStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
});
</script>

<template>
  <div class="sr-header-content">
    <div class="sr-header-left">
      <div class="sr-header-title-wrapper">
        <img :src="SrAchievement" alt="sr achievement" class="sr-header-title-img">
        <div class="sr-header-title">成就</div>
      </div>

      <div v-if="!isMobileStore.isMobile" class="sr-header-statistic-wrapper">
        <sr-statistic-total :uuid="props.uuid"/>
      </div>
    </div>

    <div class="sr-header-right">
      <button-sr-setting :uuid="props.uuid"/>
      <account-switch :uuid="props.uuid" style="margin-right: 10px"/>
      <avatar :uuid="props.uuid"/>
    </div>
  </div>
</template>

<style scoped>
.sr-header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  width: 100%;

  color: #ededed;
}

.sr-header-left {
  flex: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
}

/* 左上角成就图标 */
.sr-header-title-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sr-header-title-img {
  height: 50px;
  object-fit: contain;
}

@media (max-width: 900px) {
  .sr-header-title-img {
    height: 30px;
  }

  .sr-header-title {
    font-weight: bold;
    font-size: 14px;
    margin-right: 10px;
  }
}

/* 总统计 */
.sr-header-statistic-wrapper {
  margin-left: 40px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

/* 右侧功能区 */
.sr-header-right {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>