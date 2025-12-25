<script setup>
import {ref, watch} from "vue";
import {showError} from "@/utils/notification.js";
import {getAllUsers} from "@/api/user.js";
import ButtonUserAdd from "@/views/Home/ButtonUserAdd.vue";
import {useUserStore} from "@/stores/userStore.js";

// FIXME

// 使用Pinia作为本地缓存
const authStore = useUserStore();

const manageDialogVisible = ref(false);
const allUsers = ref([]);
const needToUpdate = ref(false);

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false
  });
}

const fetchAllUsers = async () => {
  try {
    const response = await getAllUsers();
    allUsers.value = response.users;
  } catch (e) {
    showError('获取用户列表失败', e);
  } finally {
    needToUpdate.value = false;
  }
}

watch(needToUpdate, () => {
  if (needToUpdate.value) {
    fetchAllUsers();
  }
})
</script>

<template>
  <el-button plain round style="margin-top: 10px" type="warning" @click="manageDialogVisible = true; fetchAllUsers()">
    管理用户
  </el-button>

  <div class="manage-dialog">
    <el-dialog
        v-model="manageDialogVisible"
        class="manage-dialog"
        title="管理用户"
        @close="manageDialogVisible = false">
      <div>
        <el-table :data="allUsers" max-height="400" style="margin-bottom: 10px">
          <el-table-column label="ID" prop="user_id" width="50"/>
          <el-table-column label="用户名" prop="username" width="300"/>
          <el-table-column label="权限" prop="role" width="150"/>
          <el-table-column label="创建时间" prop="created_at" width="270">
            <template #default="{ row }">
              {{ formatTime(row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
        <button-user-add v-model="needToUpdate"/>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
.manage-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 810px;
}

.manage-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>