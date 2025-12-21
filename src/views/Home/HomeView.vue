<script setup>
import {computed, onMounted, watch} from "vue";
import DefaultAvatar from '@/assets/zzz-image/zzz-logo.png'
import {useUserStore} from "@/stores/userStore.js";
import ButtonProfileSetting from "@/views/Home/ButtonProfileSetting.vue";
import ButtonLogin from "@/components/ButtonLogin.vue";
import ButtonLogout from "@/components/ButtonLogout.vue";
import ButtonRegister from "@/components/ButtonRegister.vue";
import ProfileCardsLayout from "@/views/Home/ProfileCardsLayout.vue";
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {useAccountStore} from "@/stores/accountStore.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import {useServerInfoStore} from "@/stores/serverInfoStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const accountStore = useAccountStore();
const srAchievementStore = useSrAchievementStore();
const zzzAchievementStore = useZzzAchievementStore();
const serverInfoStore = useServerInfoStore();
const isMobileStore = useIsMobileStore();

// 获取用户是否login
const isLoggedIn = computed(() => {
  return userStore.token !== ''
})

// 移动端适配
const avatarSize = computed(() => {
  return isMobileStore.isMobile ? 'default' : 'large'
})

// 同步数据
const fetchRemoteData = async () => {
  // If the current user is login, fetch accounts
  // if (isLoggedIn.value) {
  //   await accountStore.fetchAccounts();
  // }
  // Ensure branches are loaded
  await srAchievementStore.ensureBranchData();
  await zzzAchievementStore.ensureBranchData();
  // Fetch the server info
  await serverInfoStore.ensureServerInfo();
};
onMounted(() => {
  fetchRemoteData();
});

// 获取用户名，并处理用户登录登出
const userName = computed(() => {
  return userStore.getUserName()
})
watch(userName, async (newUserName) => {
  console.log(newUserName);
  await fetchRemoteData();
});
</script>

<template>
  <div class="profile-bg">
    <div class="profile-content">

      <div class="profile-header">
        <div class="profile-header-start">
          <el-avatar :size="avatarSize" :src="DefaultAvatar"/>
          <div class="profile-info">
            <p>{{ userName }}</p>
          </div>
        </div>

        <div class="profile-header-end">
          <div v-if="isLoggedIn" class="profile-header-end">
            <button-logout style="margin-left: 20px"/>
            <button-profile-setting/>
          </div>
          <div v-else class="profile-header-end">
            <button-register style="margin-left: 20px"/>
            <button-login/>
          </div>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="profile-statistic">
        <profile-cards-layout/>
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

.profile-header-end {
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
  width: 90%;
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