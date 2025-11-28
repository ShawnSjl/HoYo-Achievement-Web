<script setup>
import {ref, computed} from "vue";
import PasswordChangeButton from "@/views/User/ChangePasswordButton.vue";
import DeleteAccountButton from "@/views/User/DeleteAccountButton.vue";
import ManageUserButton from "@/views/User/ManageUserButton.vue";

const isAdmin = computed(() => {
  const role = JSON.parse(localStorage.getItem("user")).role
  return role === "admin";
})
</script>

<template>
  <el-popover
      placement="bottom"
      width="200"
      trigger="click">

    <template #reference>
      <el-button round plain type="primary">
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