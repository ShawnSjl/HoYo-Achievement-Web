<script setup>
import {nextTick, reactive, ref} from 'vue';
import {useUserStore} from '@/scripts/stores/userStore.js';
import {showError, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {login} from "@/scripts/api/user.js";
import router from "@/scripts/router/index.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const accountStore = useAccountStore();

// 登录窗口可视性
const loginDialogVisible = ref(false);

// 表单
const formRef = ref(null);
const loginForm = reactive({
  username: '',
  password: ''
});

// 表单规则
const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: ['blur', 'change']},
  ],
}

// 处理关闭
const handleClose = () => {
  formRef.value.resetFields()
  loginDialogVisible.value = false;
}

// 处理提交
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleLogin()
    } else {
      showError('请填写账号密码')
    }
  })
}
const handleLogin = async () => {
  try {
    // Login by given credentials
    const requestBody = {
      username: loginForm.username,
      password: loginForm.password
    }
    const loginResponse = await login(requestBody);
    if (loginResponse.code === 200) {
      // 返回主页面
      await router.replace({
        path: '/'
      });

      // 等待页面卸载掉
      await nextTick();

      userStore.isLogin = true;
      userStore.user = loginResponse.data.username;
      userStore.isSuper = loginResponse.data.isSuper;
      userStore.isRoot = loginResponse.data.isRoot;

      await accountStore.fetchAccounts();

      showSuccess('登录成功');
    } else {
      showWarn(loginResponse.msg);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError("登录错误", error);
  }
}
</script>

<template>
  <el-button plain round type="primary" @click="loginDialogVisible = true">
    登录
  </el-button>

  <div class="login-dialog">
    <el-dialog
        v-model="loginDialogVisible"
        :before-close="handleClose"
        class="login-dialog"
        title="登录"
    >
      <div>
        <el-form
            ref="formRef"
            :model="loginForm"
            :rules="rules"
            label-width="auto"
            @keyup.enter.native="submitForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" show-password type="password"/>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="submitForm">登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.login-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 500px;
}

.login-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>