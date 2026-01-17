<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import DefaultAvatar from '@/assets/avatar/zzz-1.png'
import {useUserStore} from "@/scripts/stores/userStore.js";
import ButtonSettingProfile from "@/views/Home/ButtonSettingProfile.vue";
import ButtonSettingServer from "@/views/Home/ButtonSettingServer.vue";
import ButtonLogin from "@/views/components/ButtonLogin.vue";
import ButtonLogout from "@/views/components/ButtonLogout.vue";
import ButtonRegister from "@/views/components/ButtonRegister.vue";
import ProfileCardsLayout from "@/views/Home/ProfileCardsLayout.vue";
import {useIsMobileStore} from "@/scripts/stores/isMobileStore.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerInfoStore} from "@/scripts/stores/serverInfoStore.js";
import {secondAuth} from "@/scripts/api/user.js";
import {showError} from "@/scripts/utils/notification.js";
import {passwordCharPattern} from "@/scripts/utils/formRegex.js";

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
const isUserSuper = computed(() => {
  return userStore.isUserSuper();
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

      <div class="profile-header-wrapper">
        <div class="profile-header-left-wrapper">
          <el-avatar :size="avatarSize" :src="DefaultAvatar" style="flex-shrink: 0"/>
          <!--          TODO: 新增头像系统-->
          <p class="profile-username">{{ userName }}</p>
        </div>

        <div v-if="isLoggedIn" class="profile-header-right-wrapper">
          <button-logout style="margin-left: 10px"/>
          <button-setting-profile/>
          <button-setting-server v-if="isUserSuper"/>
        </div>
        <div v-else class="profile-header-right-wrapper">
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
          <el-input v-model="passwordForm.twoFACode" show-password type="password"/>
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
.profile-header-wrapper {
  padding-top: 20px;
  min-width: 800px;
  justify-self: center;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.profile-header-left-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;

  flex: 1;
  min-width: 0;
}

.profile-header-right-wrapper {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 10px;
}

.profile-username {
  margin-left: 30px;
  justify-self: center;
  font-weight: bold;
  font-size: 32px;

  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号 (...) */
  width: 100%; /* 确保宽度占满父容器，不然可能切不断 */
}

@media (max-width: 900px) {
  .profile-header-wrapper {
    padding-top: 10px;
    min-width: 0;
    width: 80%;

    flex-direction: column;
  }

  .profile-username {
    margin-left: 10px;
    font-size: 18px;
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