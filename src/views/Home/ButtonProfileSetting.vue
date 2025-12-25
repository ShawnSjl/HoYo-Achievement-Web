<script setup>
import {computed} from "vue";
import ButtonChangePassword from "@/views/Home/ButtonChangePassword.vue";
import ButtonDeleteUser from "@/views/Home/ButtonDeleteUser.vue";
import ButtonManageUser from "@/views/Home/ButtonManageUser.vue";
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
        <button-change-password/>
      </div>
      <div v-if="isAdmin" class="profile-popover">
        <button-manage-user/>
      </div>
      <div v-else class="profile-popover">
        <button-delete-user/>
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