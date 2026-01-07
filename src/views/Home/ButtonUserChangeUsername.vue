<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {reactive, ref} from "vue";
import {usernameCharPattern} from "@/utils/formRegex.js";
import {showError} from "@/utils/notification.js";
import {useIsMobileStore} from "@/stores/isMobileStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const isMobileStore = useIsMobileStore();

// dialog可视性
const dialogVisible = ref(false);

// 表单对象
const formRef = ref(null);
const usernameChangeForm = reactive({
  username: ''
})

// 表单规则
const changeUsernameRule = {
  username: [
    {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
    {min: 3, max: 20, message: '长度在3到20个字符', trigger: ['blur', 'change']},
    {
      pattern: usernameCharPattern,
      message: '用户名格式不正确,只能包含中文、字母、数字、下划线',
      trigger: ['blur', 'change']
    }
  ]
}

// 处理改名表单提交
const handleClickSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleSubmit();
    } else {
      showError("请输入新的用户名");
    }
  })
}
const handleSubmit = async () => {
  await userStore.updateUserUsername(usernameChangeForm.username);
}

// 处理dialog关闭
const handleClose = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
}
</script>

<template>
  <el-button plain round style="margin-top: 10px" type="primary" @click="dialogVisible = true">
    更改用户名
  </el-button>

  <div class="change-username-dialog">
    <el-dialog
        v-model="dialogVisible"
        :before-close="handleClose"
        :fullscreen="isMobileStore.isMobile"
        title="更改用户名"
    >
      <div>
        <el-form
            ref="formRef"
            :model="usernameChangeForm"
            :rules="changeUsernameRule"
            label-width="auto"
            @keyup.enter.native="handleClickSubmit"
        >
          <el-form-item label="新用户名" prop="username">
            <el-input v-model="usernameChangeForm.username"/>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="handleClickSubmit">更改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>