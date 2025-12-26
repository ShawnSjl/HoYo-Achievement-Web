<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import DefaultAvatar from '@/assets/zzz-image/zzz-logo.png'
import {useUserStore} from "@/stores/userStore.js";
import ButtonSettingProfile from "@/views/Home/ButtonSettingProfile.vue";
import ButtonSettingServer from "@/views/Home/ButtonSettingServer.vue";
import ButtonLogin from "@/components/ButtonLogin.vue";
import ButtonLogout from "@/components/ButtonLogout.vue";
import ButtonRegister from "@/components/ButtonRegister.vue";
import ProfileCardsLayout from "@/views/Home/ProfileCardsLayout.vue";
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import {useServerInfoStore} from "@/stores/serverInfoStore.js";
import {secondAuth} from "@/api/user.js";
import {showError} from "@/utils/notification.js";
import {passwordCharPattern} from "@/utils/formRegex.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const srAchievementStore = useSrAchievementStore();
const zzzAchievementStore = useZzzAchievementStore();
const serverInfoStore = useServerInfoStore();
const isMobileStore = useIsMobileStore();

// 获取用户是否login
const isLoggedIn = computed(() => {
  return userStore.token !== ''
})

// 获取用户是否有高级权限
const isUserAdmin = computed(() => {
  return userStore.isUserAdmin();
})

// 移动端适配
const avatarSize = computed(() => {
  return isMobileStore.isMobile ? 'default' : 'large'
})

// 同步数据
const fetchRemoteData = async () => {
  // Ensure SR's data are loaded
  await srAchievementStore.ensureAchievementData();
  await srAchievementStore.ensureBranchData();

  // Ensure ZZZ's data are loaded
  await zzzAchievementStore.ensureAchievementData();
  await zzzAchievementStore.ensureBranchData();
  // Fetch the server info
  await serverInfoStore.ensureServerInfo();
};
onMounted(async () => {
  await fetchRemoteData();
  await userStore.forceCheckIsUserLogin();
});

// 获取用户名，并处理用户登录登出
const userName = computed(() => {
  return userStore.getUserName()
})
watch(userName, async (newUserName) => {
  console.log(newUserName);
  await fetchRemoteData();
});

// 二次验证用
const verifying = ref(false);

// 表单对象
const passwordFormRef = ref(null);
const passwordForm = reactive({
  twoFACode: '',
})

// 密码表单规则
const passwordRule = {
  twoFACode: [
    {required: true, message: '请输入密码', trigger: ['blur', 'change']},
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    }
  ],
}

const handleCancel = () => {
  userStore.close2FA();
}

const handleClickSubmit = () => {
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      handleSubmit();
    } else {
      showError('请输入密码');
    }
  })
}
const handleSubmit = async () => {
  verifying.value = true;
  try {
    const res = await secondAuth({password: passwordForm.twoFACode});

    if (res.code === 200) {
      if (userStore.pendingRetryRequest) {
        userStore.pendingRetryRequest();
      }

      userStore.close2FA();
      passwordForm.twoFACode = '';
    } else {
      showError(res.msg)
    }
  } catch (e) {
    console.error(e);
  } finally {
    verifying.value = false;
  }
}
</script>

<template>
  <div class="home-bg">
    <div class="home-content-wrapper">

      <div class="profile-header">
        <div class="profile-header-start">
          <el-avatar :size="avatarSize" :src="DefaultAvatar"/>
          <div class="profile-info">
            <p>{{ userName }}</p>
          </div>
        </div>

        <div v-if="isLoggedIn" class="profile-header-end">
          <button-logout style="margin-left: 10px"/>
          <button-setting-profile/>
          <button-setting-server v-if="isUserAdmin"/>
        </div>
        <div v-else class="profile-header-end">
          <button-register style="margin-left: 10px"/>
          <button-login/>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="profile-statistic">
        <profile-cards-layout/>
      </div>
    </div>

    <el-dialog
        v-model="userStore.is2FAVisible"
        :close-on-click-modal="false"
        :modal="false"
        :show-close="false"
        append-to-body
        class="second-auth-dialog"
        title="安全验证"
        width="300px"
    >
      <p>检测到敏感操作，请输入密码：</p>
      <el-form ref="passwordFormRef"
               :model="passwordForm"
               :rules="passwordRule"
               @keyup.enter.native="handleClickSubmit"
      >
        <el-form-item label="密码" prop="twoFACode">
          <el-input v-model="passwordForm.twoFACode" type="password"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button :loading="verifying" type="primary" @click="handleClickSubmit">
          验证
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.home-bg {
  background-color: #f6f6f6;
  height: 100%;
  width: 100%;
  z-index: -1;
  inset: 0;
  position: fixed;
}

.home-content-wrapper {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 900px) {
  .home-content-wrapper {
    max-width: 830px;
    margin: 0 auto;
    padding: 0 5px;
  }
}

/* header样式 */
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
  gap: 10px;
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

/* body样式 */
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

/* 二次验证弹窗优先级 */
.second-auth-dialog {
  z-index: 9999;
}
</style>