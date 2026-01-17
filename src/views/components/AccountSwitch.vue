<script setup>
import {ArrowDown} from '@element-plus/icons-vue';
import router from "@/scripts/router/index.js";
import Zzz from '@/assets/zzz-image/zzz-logo.png'
import Sr from "@/assets/sr-image/sr-logo.png"
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {computed} from "vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账户对应游戏的logo
const gameLogo = (type) => {
  switch (type) {
    case 'SR':
      return Sr;
    case 'ZZZ':
      return Zzz;
    default:
      return Zzz;
  }
}

// 处理点击
const handleClick = (command) => {
  if (command.uuid === props.uuid) return;

  const shortId = command.uuid.slice(-8);
  switch (command.type) {
    case 'SR':
      router.push({
        path: '/sr',
        query: {
          id: shortId
        }
      });
      break
    case 'ZZZ':
      router.push({
        path: '/zzz',
        query: {
          id: shortId
        }
      });
      break
    default:
      router.push({path: '/'})
      break
  }
}
</script>

<template>
  <el-dropdown placement="bottom-start" size="large" trigger="click" @command="handleClick">
    <el-button type="primary">
      切换账号
      <el-icon class="el-icon--right">
        <arrow-down/>
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>

        <el-dropdown-item
            v-for="account in accounts"
            :key="account.uuid"
            :command="account"
        >
          <div class="game-switch-item">
            <div style="display: flex; align-items: center">
              <el-avatar :src="gameLogo(account.type)" shape="square"/>
            </div>
            <div style="margin-left: 10px">
              <p class="username">{{ account.name }}</p>
              <p class="uid">UID: {{ account.inGameUid }} </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.game-switch-item {
  display: flex;
  flex-direction: row;
}

.username {
  font-weight: bold;
}

.uid {
  font-size: 12px;
  color: #6c6d73;
  font-family: Consolas, monospace;
}

p {
  margin-block-start: 0;
  margin-block-end: 0;
  align-self: center;
}
</style>