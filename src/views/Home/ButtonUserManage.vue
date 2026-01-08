<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {getAllUsers} from "@/api/user.js";
import ButtonUserAdd from "@/views/Home/ButtonUserAdd.vue";
import {useUserStore} from "@/stores/userStore.js";
import {dayjs} from "element-plus";
import ButtonUserEdit from "@/views/Home/ButtonUserEdit.vue";

// 使用Pinia作为本地缓存
const userStore = useUserStore();

// 获取用户是否有高级权限
const isUserSuper = computed(() => {
  return userStore.isUserSuper();
})
onMounted(async () => {
  await userStore.forceCheckIsUserSuper();
})
onUnmounted(() => {
  allUsers.value = [];
})
watch(isUserSuper, async (newValue) => {
  if (newValue === false) {
    dialogVisible.value = false;
    allUsers.value = [];
  }
})

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  allUsers.value = [];
  dialogVisible.value = false;
}

// 获取用户数据
const allUsers = ref([]);

const fetchAllUsers = async () => {
  try {
    const response = await getAllUsers();
    if (response.code !== 200) {
      showInfo(response.msg);
      return;
    }
    allUsers.value = response.data;
    showSuccess(response.msg);
  } catch (e) {
    showError('获取用户列表失败', e);
  }
}

// 处理时间戳
const getTime = (timeStr) => {
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm');
}

// 过滤器
const filterRole = (value, row) => {
  return row.role === value
}
const filterStatus = (value, row) => {
  return row.status === value
}
</script>

<template>
  <el-button plain round style="margin-top: 10px" type="warning" @click="dialogVisible = true; fetchAllUsers()">
    管理用户
  </el-button>

  <div class="manage-dialog">
    <el-dialog
        v-model="dialogVisible"
        append-to-body
        class="manage-dialog"
        title="管理用户"
        @close="handleClose">
      <div>
        <el-table
            :data="allUsers"
            max-height="400"
            stripe
            style="margin-bottom: 10px">
          <el-table-column fixed label="ID" prop="id" sortable width="80"/>
          <el-table-column fixed label="用户名" min-width="100" prop="username" sortable/>
          <el-table-column
              :filter-method="filterRole"
              :filters="[
                  { text: 'ROOT', value: 'ROOT'},
                  { text: '管理员', value: 'ADMIN'},
                  { text: '普通用户', value: 'USER'},
              ]"
              filter-placement="bottom"
              label="权限"
              prop="role"
              width="100"
          />
          <el-table-column
              :filter-method="filterStatus"
              :filters="[
                  { text: '启用', value: 'ACTIVE'},
                  { text: '禁用', value: 'DISABLED'},
              ]"
              filter-placement="bottom"
              label="状态"
              prop="status"
              width="100"
          />
          <el-table-column label="创建时间" prop="created_at" sortable width="170">
            <template #default="{ row }">
              {{ getTime(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updated_at" sortable width="170">
            <template #default="{ row }">
              {{ getTime(row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="{ row }">
              <button-user-edit :user="row" @refresh="fetchAllUsers"/>
            </template>
          </el-table-column>
        </el-table>
        <button-user-add @refresh="fetchAllUsers"/>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
.manage-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 900px;
}

.manage-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>