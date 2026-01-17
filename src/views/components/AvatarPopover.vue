<script setup>
import {computed} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import ButtonLogin from "@/views/components/ButtonLogin.vue";
import ButtonLogout from "@/views/components/ButtonLogout.vue";
import ButtonRegister from "@/views/components/ButtonRegister.vue";
import ButtonHomePage from "@/views/components/ButtonHomePage.vue";

// 使用Pinia作为本地缓存
const userStore = useUserStore();

// 获取用户是否login
const isLoggedIn = computed(() => {
  return userStore.token !== ''
})
</script>

<template>
  <div class="avatar-popover">
    <button-home-page/>
    <div v-if="!isLoggedIn" class="avatar-popover-button">
      <button-login/>
      <button-register style="margin-top: 10px"/>
    </div>
    <div v-else class="avatar-popover-button">
      <button-logout/>
    </div>
  </div>
</template>

<style scoped>
.avatar-popover {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: center;
}

.avatar-popover-button {
  margin-top: 10px
}

::v-deep(.el-button+.el-button) {
  margin-left: 0;
}
</style>