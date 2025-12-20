<script setup>
import {computed} from "vue";
import PasswordChangeButton from "@/views/Home/ChangePasswordButton.vue";
import DeleteAccountButton from "@/views/Home/DeleteAccountButton.vue";
import ManageUserButton from "@/views/Home/ManageUserButton.vue";

const isAdmin = computed(() => {
  const role = JSON.parse(localStorage.getItem("user")).role
  return role === "admin";
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
        <password-change-button/>
      </div>
      <div v-if="isAdmin" class="profile-popover">
        <manage-user-button/>
      </div>
      <div v-else class="profile-popover">
        <delete-account-button/>
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