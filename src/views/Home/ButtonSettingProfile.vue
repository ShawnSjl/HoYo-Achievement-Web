<script setup>
import {computed} from "vue";
import ButtonUserChangePassword from "@/views/Home/ButtonUserChangePassword.vue";
import ButtonUserDelete from "@/views/Home/ButtonUserDelete.vue";
import ButtonUserManage from "@/views/Home/ButtonUserManage.vue";
import {useUserStore} from "@/stores/userStore.js";

// 使用Pinia作为本地缓存
const userStore = useUserStore();

// 获取用户权限
const isAdmin = computed(() => {
  return userStore.isUserAdmin();
})
</script>

<template>
  <el-popover
      placement="bottom"
      trigger="click"
      width="200">

    <template #reference>
      <el-button plain round type="primary">
        设置
      </el-button>
    </template>

    <template #default>
      <div class="profile-popover">
        <button-user-change-password/>
      </div>
      <div v-if="isAdmin" class="profile-popover">
        <button-user-manage/>
      </div>
      <div v-else class="profile-popover">
        <button-user-delete/>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>
.profile-popover {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
}

::v-deep(.el-button+.el-button) {
  margin-left: 0;
}
</style>