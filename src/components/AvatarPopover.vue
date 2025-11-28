<script setup>
import {ref, computed} from "vue";
import {useAuthStore} from "@/stores/authStore";
import LoginButton from "@/components/LoginButton.vue";
import LogoutButton from "@/components/LogoutButton.vue";
import RegisterButton from "@/components/RegisterButton.vue";
import UserSpaceButton from "@/components/UserSpaceButton.vue";

const authStore = useAuthStore();

const isLoggedIn = computed(() => {return authStore.isAuthenticated()})
</script>

<template>
  <div class="avatar-popover">
    <user-space-button />
    <div v-if="!isLoggedIn" class="avatar-popover-button">
      <login-button />
      <register-button style="margin-top: 10px"/>
    </div>
    <div v-else class="avatar-popover-button">
      <logout-button />
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