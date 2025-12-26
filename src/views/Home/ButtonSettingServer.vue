<script setup>
import ButtonUserManage from "@/views/Home/ButtonUserManage.vue";
</script>

<template>
  <el-popover
      placement="bottom"
      trigger="click"
      width="200"
  >
    <template #reference>
      <el-button plain round type="primary">
        服务器设置
      </el-button>
    </template>

    <template #default>
      <div class="profile-popover-wrapper">
        <button-user-manage/>
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