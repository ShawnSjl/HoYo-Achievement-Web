<script setup>
import {ref} from "vue";
import {loadLocalData} from "@/scripts/api/migration.js";
import {showError, showInfo, showSuccess} from "@/scripts/utils/notification.js";
import {useServerInfoStore} from "@/scripts/stores/serverInfoStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";

// 使用Pinia作为本地缓存
const serverInfoStore = useServerInfoStore();
const zzzAchievementStore = useZzzAchievementStore();
const srAchievementStore = useSrAchievementStore();

// 传入刷新事件
const emit = defineEmits(['refresh'])

// 按钮相关变量
const isLoading = ref(false);
const isDisabled = ref(false);
const buttonText = ref('加载本地数据');
const countdown = ref(60);

// 处理local数据的加载
const handleLocalLoad = async () => {
  isLoading.value = true;
  isDisabled.value = true;

  try {
    const loadResponse = await loadLocalData();
    if (loadResponse.code !== 200) {
      showInfo(loadResponse.msg);
      return;
    }
    if (loadResponse.data.length > 0) {
      showSuccess(loadResponse.msg, loadResponse.data);
      // 触发刷新事件
      emit('refresh');

      await serverInfoStore.fetchServerInfo();
      await zzzAchievementStore.fetchAchievements();
      await zzzAchievementStore.fetchBranches();
      await srAchievementStore.fetchAchievements();
      await srAchievementStore.fetchBranches();
    } else {
      showSuccess(loadResponse.msg);
    }
  } catch (e) {
    showError(e);
  } finally {
    isLoading.value = false;
    startCountdown();
  }
}

const startCountdown = () => {
  const originalText = '加载本地数据';
  buttonText.value = `${countdown.value}秒后可重试`;

  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isDisabled.value = false;
      buttonText.value = originalText;
      countdown.value = 60;
    } else {
      buttonText.value = `${countdown.value}秒后可重试`;
    }
  }, 1000)
}
</script>

<template>
  <el-button :disabled="isDisabled" :loading="isLoading" plain style="width: 100%" type="primary"
             @click="handleLocalLoad">
    {{ buttonText }}
  </el-button>
</template>

<style scoped>

</style>