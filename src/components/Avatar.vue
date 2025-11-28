<script setup>
import {computed} from 'vue';
import router from "@/router";
import Zzz from '@/assets/zzz-image/zzz-logo.png'
import {useAuthStore} from "@/stores/authStore";
import AvatarPopover from '@/components/AvatarPopover.vue'
import {useIsMobileStore} from "@/stores/isMobileStore";

const authStore = useAuthStore();
const isMobileStore = useIsMobileStore();

const userName = computed(() => {return authStore.getUserName()})

// 移动端适配
const avatarSize = computed(() => { return isMobileStore.isMobile? 'default' : 'large'})
const avatarTrigger = computed(() => { return isMobileStore.isMobile? 'click' : 'hover'})

const handleClick = () => {
  router.push({ path: '/space' });
}
</script>

<template>
  <el-popover
    placement="bottom"
    width="200"
    :trigger="avatarTrigger">

    <template #reference>
      <div class="avatar-container">
        <el-avatar :size="avatarSize" :src="Zzz" />
        <div class="avatar-side">
          <p class="avatar-username">{{userName}}</p>
        </div>
      </div>
    </template>

    <template #default>
      <avatar-popover />
    </template>
  </el-popover>
</template>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  background-color: rgba(158, 157, 157, 0.36);
  border-radius: 28px;
  border: 1px solid rgba(113, 107, 107, 0.41);
}

.avatar-side {
  margin-left: 8px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.avatar-username {
  font-size: 16px;
  font-weight: bold;
  color: #ededed;
}

@media (max-width: 900px) {
  .avatar-username {
    font-size: 14px;
    font-weight: bold;
    color: #ededed;
  }
}

::v-deep(p) {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>