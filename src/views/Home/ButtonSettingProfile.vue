<script setup>
import ButtonUserChangePassword from "@/views/Home/ButtonUserChangePassword.vue";
import ButtonUserDelete from "@/views/Home/ButtonUserDelete.vue";
import ButtonUserChangeUsername from "@/views/Home/ButtonUserChangeUsername.vue";
</script>

<template>
  <el-popover
      placement="bottom"
      trigger="click"
      width="200">

    <template #reference>
      <el-button plain round type="primary">
        用户设置
      </el-button>
    </template>

    <template #default>
      <div class="profile-popover-wrapper">
        <button-user-change-username/>
        <button-user-change-password/>
        <button-user-delete/>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>
.profile-popover-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  gap: 10px;
}
</style>