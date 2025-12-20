<script setup>
import {computed, reactive, ref} from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import { showWarn, showSuccess, showError} from "@/utils/notification";

// 使用Pinia作为本地缓存
const authStore = useUserStore();

const loginDialogVisible = ref(false);

const formRef = ref(null);

const loginForm = reactive({
  username: '',
  password: ''
});

// 表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
  ],
}

const handleClose = () => {
  formRef.value.resetFields()
  loginDialogVisible.value = false;
}

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
  await authStore.loginUser({
    username: loginForm.username,
    password: loginForm.password,
  })
}
</script>

<template>
  <el-button round plain type="primary" @click="loginDialogVisible = true">
    登录
  </el-button>

  <div class="login-dialog">
    <el-dialog
        v-model="loginDialogVisible"
        title="登录"
        :before-close="handleClose"
        class="login-dialog"
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
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm" style="margin-left: 10px">登录</el-button>
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