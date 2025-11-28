<script setup>
import {computed, reactive, ref} from 'vue';
import { showWarn, showSuccess, showError} from "@/utils/notification";
import {register} from "@/api/user";

const updateData = defineModel();

const dialogVisible = ref(false);

const formRef = ref(null);
const userForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

// 正则表达式：禁止输入包含特殊字符
const usernameCharPattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/;
const passwordCharPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{}]{8,50}$/;

// 表单规则
const confirmValidator = (rule, value, callback) => {
  if (value !== userForm.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
    { min: 3, max: 20, message: '长度在3到20个字符', trigger: ['blur', 'change'] },
    {
      pattern: usernameCharPattern,
      message: '用户名格式不正确,只能包含中文、字母、数字、下划线',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 8, max: 50, message: '长度在8到50个字符', trigger: ['blur', 'change'] },
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: ['blur', 'change'] },
    { min: 8, max: 50, message: '长度在8到50个字符', trigger: ['blur', 'change'] },
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    },
    { validator: confirmValidator, trigger: ['blur', 'change'] }
  ],
}

const handleClose = () => {
  formRef.value.resetFields()
  dialogVisible.value = false;
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleAddUser()
    } else {
      showError('请填写账号密码')
    }
  })
}
const handleAddUser = async () => {
  try {
    await register({
      username: userForm.username,
      password: userForm.password,
    });
    showSuccess('添加用户成功');
    updateData.value = true
  } catch (error) {
    showError('添加用户失败', error);
  } finally {
    handleClose()
  }
}
</script>

<template>
  <el-button type="primary" @click="dialogVisible = true" style="width: 100%" plain>
    添加新用户
  </el-button>

  <div class="add-user-dialog">
    <el-dialog
        v-model="dialogVisible"
        title="添加新用户"
        :before-close="handleClose"
        class="login-dialog"
    >
      <div>
        <el-form
            ref="formRef"
            :model="userForm"
            :rules="rules"
            label-width="auto"
            @keyup.enter.native="submitForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password" />
          </el-form-item>
          <el-form-item label="密码" prop="confirmPassword">
            <el-input v-model="userForm.confirmPassword" type="password" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm" style="margin-left: 10px">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.add-user-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 500px;
}

.add-user-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>