<script setup>
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {updateUserRole, updateUserStatus} from "@/api/user.js";
import {dayjs} from "element-plus";
import {useUserStore} from "@/stores/userStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const isMobileStore = useIsMobileStore();

// 传入只读数据
const props = defineProps({
  user: Object,
});

// 传入刷新事件
const emit = defineEmits(['refresh'])

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  editFormRef.value.resetFields();
  dialogVisible.value = false;
}

// 表单选项
const roles = ['ADMIN', 'USER'];
// DISABLED: true; ACTIVE: false
const status2Bool = (userStatus) => {
  return userStatus === 'DISABLED';
}
const bool2Status = (bool) => {
  return bool ? 'DISABLED' : 'ACTIVE';
}

// 修改表单
const editFormRef = ref(null);
const editForm = reactive({
  role: '',
  status: false,
})

// 处理表单提交
const handleClickSubmit = async () => {
  let hasUpdate = false;

  if (!roles.includes(editForm.role)) {
    showError('未知权限名');
    return;
  }

  // 更新权限
  if (editForm.role !== props.user.role) {
    const roleRequestBody = {
      user_id: props.user.id,
      role: editForm.role,
    }
    const roleResponse = await updateUserRole(roleRequestBody);
    if (roleResponse.code !== 200) {
      showInfo(roleResponse.msg);
      return;
    }
    showSuccess(roleResponse.msg);
    hasUpdate = true;
  }

  // 更新状态
  if (bool2Status(editForm.status) !== props.user.status) {
    const statusRequestBody = {
      user_id: props.user.id,
      status: bool2Status(editForm.status),
    }
    const statusResponse = await updateUserStatus(statusRequestBody);
    if (statusResponse.code !== 200) {
      showInfo(statusResponse.msg);
      return;
    }
    showSuccess(statusResponse.msg);
    hasUpdate = true;
  }

  // 触发刷新事件
  if (hasUpdate) {
    emit('refresh')
  }
}

// 处理时间戳
const getCreateTime = computed(() => {
  return dayjs(props.user.created_at).format('YYYY-MM-DD HH:mm');
})
const getUpdateTime = computed(() => {
  return dayjs(props.user.updated_at).format('YYYY-MM-DD HH:mm');
})

// 获取用户是否有Root权限
const isUserRoot = computed(() => {
  return userStore.isUserRoot();
})
onMounted(async () => {
  await userStore.forceCheckIsUserRoot();
})

// 按钮状态，禁用规则：目标是root用户；当前是admin，且目标也是admin
const disableEditButton = (role) => {
  if (role === 'ADMIN' && !isUserRoot.value) return true;
  return role === 'ROOT';
}

// 开启时自动填充表单
watch(dialogVisible, (val) => {
  if (val && props.user) {
    editForm.role = props.user.role;
    editForm.status = status2Bool(props.user.status);
  }
})
</script>

<template>
  <el-button
      :disabled="disableEditButton(props.user.role)"
      bg
      plain
      type="primary"
      @click="dialogVisible = true"
  >
    修改
  </el-button>

  <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      :fullscreen="isMobileStore.isMobile"
      :modal="false"
      append-to-body
      class="user-edit-dialog"
      title="修改用户"
  >
    <div>
      <el-form
          ref="editFormRef"
          :model="editForm"
          label-width="auto"
          @keyup.enter.native="handleClickSubmit"
      >
        <el-form-item disabled="true" label="ID">
          <el-input v-model="props.user.id" disabled/>
        </el-form-item>
        <el-form-item disabled="true" label="用户名">
          <el-input v-model="props.user.username" disabled/>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select v-model="editForm.role" :disabled="!isUserRoot">
            <el-option v-for="role in roles" :key="role" :label="role" :value="role"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="status">
          <el-switch v-model="editForm.status"/>
        </el-form-item>
        <el-form-item disabled="true" label="创建时间">
          <el-input v-model="getCreateTime" disabled/>
        </el-form-item>
        <el-form-item disabled="true" label="更新时间">
          <el-input v-model="getUpdateTime" disabled/>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button style="margin-left: 10px" type="primary" @click="handleClickSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.user-edit-dialog {
  z-index: 100;
}
</style>