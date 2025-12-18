<script setup>
import {computed, onMounted, watch} from "vue";
import DefaultAvatar from '@/assets/zzz-image/zzz-logo.png'
import {useUserStore} from "@/stores/userStore.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore";
import {showError} from "@/utils/notification";
import ProfileSettingButton from "@/views/User/ProfileSettingButton.vue";
import LoginButton from "@/components/LoginButton.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import ProfileCardsLayout from "@/views/User/ProfileCardsLayout.vue";
import {useIsMobileStore} from "@/stores/isMobileStore";

// 使用Pinia作为本地缓存
const authStore = useUserStore();
const zzzAchievementStore = useZzzAchievementStore()
const isMobileStore = useIsMobileStore();

const isLoggedIn = computed(() => {return authStore.isUserLogin()})

// 移动端适配
const avatarSize = computed(() => { return isMobileStore.isMobile? 'default' : 'large'})

// 同步数据
const fetchData = async () => {
  try {
    await zzzAchievementStore.updateAchievements();
  } catch (e) {
    showError('Load data failed');
  }
};
onMounted(() => {
  fetchData();
});

// 获取用户名，并处理用户登录登出
const userName = computed(() => {return authStore.getUserName()})
watch(userName, async (newUserName) => {
  console.log(newUserName);
  await fetchData();
});
</script>

<template>
  <div class="profile-bg">
    <div class="profile-content">

      <div class="profile-header">
        <div class="profile-header-start">
          <el-avatar :size="avatarSize" :src="DefaultAvatar" />
          <div class="profile-info">
            <p>{{ userName }}</p>
          </div>
        </div>

        <div class="profile-header-end">
          <div v-if="isLoggedIn" class="profile-header-end">
            <logout-button style="margin-left: 20px" />
            <profile-setting-button />
          </div>
          <div v-else class="profile-header-end">
            <register-button style="margin-left: 20px" />
            <login-button/>
          </div>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="profile-statistic">
        <profile-cards-layout />
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.profile-bg {
  background-color: #f6f6f6;
  height: 100%;
  width: 100%;
  z-index: -1;
  inset: 0;
  position: fixed;
}

.profile-content {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 900px) {
  .profile-content {
    max-width: 830px;
    margin: 0 auto;
    padding: 0 5px;
  }
}

.profile-header {
  padding-top: 20px;
  margin: 0 auto;
  width: 70%;
  justify-self: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 900px) {
  .profile-header {
    padding-top: 10px;
    width: 80%;
  }
}

.profile-header-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.profile-header-end{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.profile-info {
  margin-left: 30px;
  justify-self: center;
  font-weight: bold;
  font-size: 32px;
}


@media (max-width: 900px) {
  .profile-info {
    margin-left: 10px;
    justify-self: center;
    font-weight: bold;
    font-size: 14px;
  }
}

.profile-statistic {
  width: 85%;
  justify-self: center;
  margin: 0 auto;
  padding: 0 5px;
}

@media (max-width: 900px) {
  .profile-statistic {
    width: 95%;
  }
}
</style>