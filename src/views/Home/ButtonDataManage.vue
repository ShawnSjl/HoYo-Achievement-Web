<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {dayjs} from "element-plus";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {getAllMigrationRecords} from "@/api/migration.js";
import ButtonDataLoad from "@/views/Home/ButtonDataLoad.vue";

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
  allMigrationRecords.value = [];
})
watch(isUserSuper, async (newValue) => {
  if (newValue === false) {
    dialogVisible.value = false;
    allMigrationRecords.value = [];
  }
})

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  allMigrationRecords.value = [];
  dialogVisible.value = false;
}

// 获取Data数据
const allMigrationRecords = ref([]);

const fetchAllMigrationRecords = async () => {
  try {
    const response = await getAllMigrationRecords();
    if (response.code !== 200) {
      showInfo(response.msg);
      return;
    }
    allMigrationRecords.value = response.data;
    showSuccess(response.msg);
  } catch (e) {
    showError('获取数据迁移列表失败', e);
  }
}

// 处理时间戳
const getTime = (timeStr) => {
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm');
}

// 过滤器
const filterPath = (value, row) => {
  return row.path === value
}
const filterType = (value, row) => {
  return row.type === value
}
</script>

<template>
  <el-button plain round type="warning" @click="dialogVisible = true;
  fetchAllMigrationRecords()">
    管理成就数据
  </el-button>

  <div class="manage-dialog">
    <el-dialog
        v-model="dialogVisible"
        append-to-body
        class="manage-dialog"
        title="管理成就数据"
        @close="handleClose">
      <el-table
          :data="allMigrationRecords"
          max-height="400"
          stripe
          style="margin-bottom: 10px">
        <el-table-column fixed label="ID" prop="id" sortable width="80"/>
        <el-table-column fixed label="名称" min-width="100" prop="name" sortable/>
        <el-table-column
            :filter-method="filterPath"
            :filters="[
                  { text: '服务器本地', value: 'LOCAL'},
                  { text: '远程上传', value: 'UPLOAD'},
              ]"
            filter-placement="bottom"
            label="位置"
            prop="path"
            width="100"
        />
        <el-table-column
            :filter-method="filterType"
            :filters="[
                  { text: '数据', value: 'data'},
                  { text: '补丁', value: 'patch'},
              ]"
            filter-placement="bottom"
            label="数据类型"
            prop="type"
            width="130"
        />
        <el-table-column label="依赖" prop="depends" show-overflow-tooltip width="170">
          <template #default="{ row }">
            {{ row.depends?.join(', ') || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="导入时间" prop="migration_time" sortable width="170">
          <template #default="{ row }">
            {{ getTime(row.migration_time) }}
          </template>
        </el-table-column>
      </el-table>

      <button-data-load style="margin-top: 10px"/>
      <!-- 禁用上传功能 -->
      <!--      <button-data-upload style="margin-top: 10px"/>-->
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

.el-button + .el-button {
  margin-left: 0;
}
</style>