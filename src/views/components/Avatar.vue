<script setup>
import {computed} from 'vue';
import Avatar from '@/assets/avatar/zzz-1.png'
import {useUserStore} from "@/stores/userStore.js";
import AvatarPopover from '@/views/components/AvatarPopover.vue'
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {useAccountStore} from "@/stores/accountStore.js";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const accountStore = useAccountStore();
const isMobileStore = useIsMobileStore();

// 获取用户名称
const userName = computed(() => {
  return userStore.getUserName()
})

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账号成就
const account = computed(() =>
    accounts.value.find(account => account.uuid === props.uuid)
);

// 移动端适配
const avatarSize = computed(() => {
  return isMobileStore.isMobile ? 'default' : 'large'
})
const avatarTrigger = computed(() => {
  return isMobileStore.isMobile ? 'click' : 'hover'
})
</script>

<template>
  <el-popover
      :trigger="avatarTrigger"
      placement="bottom"
      width="200">

    <template #reference>
      <div class="avatar-container">
        <div style="display: flex; align-items: center">
          <el-avatar :size="avatarSize" :src="Avatar"/>
        </div>
        <div class="avatar-side">
          <p class="avatar-username">{{ userName }}</p>
          <p class="avatar-account-name">{{ account.name }}</p>
          <p class="avatar-account-uid">UID: {{ account.inGameUid }}</p>
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
  max-width: 180px;
  min-width: 0;
}

.avatar-side p {
  margin: 0;
  white-space: nowrap; /* 强制不换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出显示省略号 (...) */
  width: 100%; /* 确保宽度占满父容器，不然可能切不断 */
}

.avatar-username {
  font-size: 16px;
  font-weight: bold;
  color: #ededed;
}

.avatar-account-name {
  color: #bdbdbd;
}

.avatar-account-uid {
  font-size: 12px;
  color: #9fa0a6;
  font-family: Consolas, monospace;
}

@media (max-width: 900px) {
  .avatar-username {
    font-size: 12px;
    font-weight: bold;
    color: #ededed;
  }

  .avatar-account-name {
    font-size: 12px;
  }

  .avatar-account-uid {
    font-size: 10px;
  }
}

::v-deep(p) {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>