<script setup>
import {reactive, ref} from "vue";
import {showError} from "@/scripts/utils/notification.js";
import {useUserStore} from "@/scripts/stores/userStore.js";
import {passwordCharPattern} from "@/scripts/utils/formRegex.js";
import {useIsMobileStore} from "@/scripts/stores/isMobileStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const isMobileStore = useIsMobileStore();

// dialog可视性
const passwordChangeDialogVisible = ref(false);

// 表单对象
const formRef = ref(null);
const passwordChangeForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 表单规则
const confirmValidator = (rule, value, callback) => {
  if (value !== passwordChangeForm.newPassword) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const rules = {
  oldPassword: [
    {required: true, message: '请输入旧密码', trigger: ['blur', 'change']},
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    }
  ],
  newPassword: [
    {required: true, message: '请输入新密码', trigger: ['blur', 'change']},
    {min: 8, max: 50, message: '长度在8到50个字符', trigger: ['blur', 'change']},
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    }
  ],
  confirmPassword: [
    {required: true, message: '请确认新密码', trigger: ['blur', 'change']},
    {min: 8, max: 50, message: '长度在8到50个字符', trigger: ['blur', 'change']},
    {
      pattern: passwordCharPattern,
      message: '密码格式错误，需包含字母和数字，可包含部分特殊字符',
      trigger: ['blur', 'change']
    },
    {validator: confirmValidator, trigger: ['blur', 'change']},
  ],
}

const handleClose = () => {
  formRef.value.resetFields()
  passwordChangeDialogVisible.value = false;
}

// 处理表单提交
const handleClickSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleSubmit()
    } else {
      showError('请正确填写密码')
    }
  })
}
const handleSubmit = async () => {
  await userStore.updateUserPassword(passwordChangeForm.oldPassword, passwordChangeForm.newPassword);
  handleClose();
}
</script>

<template>
  <el-button plain round type="primary" @click="passwordChangeDialogVisible = true">
    更改密码
  </el-button>

  <div class="login-dialog">
    <el-dialog
        v-model="passwordChangeDialogVisible"
        :before-close="handleClose"
        :fullscreen="isMobileStore.isMobile"
        title="更改密码"
    >
      <div>
        <el-form
            ref="formRef"
            :model="passwordChangeForm"
            :rules="rules"
            label-width="auto"
            @keyup.enter.native="handleClickSubmit"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordChangeForm.oldPassword" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordChangeForm.newPassword" type="password"/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordChangeForm.confirmPassword" type="password"/>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="handleClickSubmit">更改密码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.login-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 500px;
}

@media (max-width: 900px) {
  .login-dialog :deep(.el-dialog) {
    max-width: 100%;
  }
}

.login-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>