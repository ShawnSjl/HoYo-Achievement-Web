<script setup>
import {showInfo} from "@/utils/notification.js";

// 使用Pinia作为本地缓存
// const authStore = useAuthStore();
//
// const dialogVisible =defineModel();
//
// const loginForm = ref({
//   username: '',
//   password: '',
//   password2: '',
// });
//
// const allFilled = computed( () => {
//   return loginForm.value.username !== '' && loginForm.value.password !== '' && loginForm.value.password2 !== '';
// })
//
// const handleClose = () => {
//   loginForm.value.username = ''
//   loginForm.value.password = ''
//   loginForm.value.password2 = ''
//   dialogVisible.value = false;
// }

// const handleRegister = async () => {
//   if (loginForm.value.password !== loginForm.value.password2) {
//     showWarn('错误',"两次密码不一致");
//     return;
//   }
//   try {
//     await authStore.registerUser({
//       username: loginForm.value.username,
//       password: loginForm.value.password,
//     })
//     showSuccess('注册成功');
//     handleClose()
//   } catch (error) {
//     showError('注册失败', error);
//   }
// }

const handleRegister = () => {
  showInfo('游客注册功能已关闭', '请联系网站管理员添加用户')
}
</script>

<template>
  <el-button plain round type="primary" @click="handleRegister">
    注册
  </el-button>

  <!--  <el-dialog-->
  <!--      v-model="dialogVisible"-->
  <!--      title="注册"-->
  <!--      width="30%"-->
  <!--      :before-close="handleClose"-->
  <!--  >-->
  <!--    <div>-->
  <!--      <el-input v-model="loginForm.username" placeholder="用户名" />-->
  <!--      <el-input v-model="loginForm.password" placeholder="密码" type="password" />-->
  <!--      <el-input v-model="loginForm.password2" placeholder="重复密码" type="password" />-->
  <!--    </div>-->
  <!--    <template #footer>-->
  <!--      <el-button @click="handleClose">取消</el-button>-->
  <!--      <el-button type="primary" :disabled="!allFilled" @click="handleRegister">注册</el-button>-->
  <!--    </template>-->
  <!--  </el-dialog>-->
</template>

<style scoped>

</style>