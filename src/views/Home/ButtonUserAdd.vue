<script setup>
import {reactive, ref} from 'vue';
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {createUser} from "@/api/user.js";
import {passwordCharPattern, usernameCharPattern} from "@/utils/formRegex.js";
import {useIsMobileStore} from "@/stores/isMobileStore.js";

// 使用Pinia作为本地缓存
const isMobileStore = useIsMobileStore();

// 传入刷新事件
const emit = defineEmits(['refresh'])

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

// 表单
const formRef = ref(null);
const userForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

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
    {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
    {min: 3, max: 20, message: '长度在3到20个字符', trigger: ['blur', 'change']},
    {
      pattern: usernameCharPattern,
      message: '用户名格式不正确,只能包含中文、字母、数字、下划线',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {required: true, message: '请输入密码', trigger: ['blur', 'change']},
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
    {validator: confirmValidator, trigger: ['blur', 'change']}
  ],
}

// 处理表单提交
const handleClickSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleSubmit();
    } else {
      showError('请填写账号密码')
    }
  })
}
const handleSubmit = async () => {
  try {
    const requestBody = {
      username: userForm.username,
      password: userForm.password,
    }
    const response = await createUser(requestBody);
    if (response.code !== 200) {
      showInfo(response.msg);
      return;
    }
    showSuccess('添加用户成功');
    // 触发刷新事件
    emit('refresh');
  } catch (error) {
    showError('添加用户失败', error);
  }
}
</script>

<template>
  <el-button plain style="width: 100%" type="primary" @click="dialogVisible = true">
    添加新用户
  </el-button>

  <div class="add-user-dialog">
    <el-dialog
        v-model="dialogVisible"
        :before-close="handleClose"
        :fullscreen="isMobileStore.isMobile"
        append-to-body
        class="login-dialog"
        title="添加新用户"
    >
      <div>
        <el-form
            ref="formRef"
            :model="userForm"
            :rules="rules"
            label-width="auto"
            @keyup.enter.native="handleClickSubmit"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password"/>
          </el-form-item>
          <el-form-item label="密码" prop="confirmPassword">
            <el-input v-model="userForm.confirmPassword" type="password"/>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="handleClickSubmit">添加</el-button>
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