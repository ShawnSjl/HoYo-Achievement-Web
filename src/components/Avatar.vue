<script setup>
import {computed} from 'vue';
import Zzz from '@/assets/zzz-image/zzz-logo.png'
import {useUserStore} from "@/stores/userStore.js";
import AvatarPopover from '@/components/AvatarPopover.vue'
import {useIsMobileStore} from "@/stores/isMobileStore";

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const isMobileStore = useIsMobileStore();

// 获取用户名称
const userName = computed(() => {
  return userStore.getUserName()
})

// 移动端适配
const avatarSize = computed(() => {
  return isMobileStore.isMobile ? 'default' : 'large'
})
const avatarTrigger = computed(() => {
  return isMobileStore.isMobile ? 'click' : 'hover'
})

// TODO 显示账号名称和uid
</script>

<template>
  <el-popover
      :trigger="avatarTrigger"
      placement="bottom"
      width="200">

    <template #reference>
      <div class="avatar-container">
        <el-avatar :size="avatarSize" :src="Zzz"/>
        <div class="avatar-side">
          <p class="avatar-username">{{ userName }}</p>
        </div>
      </div>
    </template>

    <template #default>
      <avatar-popover/>
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