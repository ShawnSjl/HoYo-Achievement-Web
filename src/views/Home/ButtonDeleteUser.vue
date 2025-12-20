<script setup>
import {ref} from 'vue'
import {useUserStore} from '@/stores/userStore.js';
import {showError} from "@/utils/notification.js";

// 使用Pinia作为本地缓存
const authStore = useUserStore();

const outerVisible = ref(false)
const innerVisible = ref(false)

const handleClose = () => {
  innerVisible.value = false
  outerVisible.value = false
}

const handleDelete = async () => {
  // try {
  //   handleClose()
  //   await authStore.deleteUser()
  // } catch (error) {
  //   showError('账户删除失败', error)
  // }
  showError('功能关闭')
}
</script>

<template>
  <el-button class="profile-delete-button" plain round type="danger" @click="outerVisible = true">
    注销账号
  </el-button>

  <el-dialog v-model="outerVisible" title="注销账户" width="500" @close="handleClose">
    <span>注销账户会将此账户从数据库中删除，是否继续？</span>

    <el-dialog
        v-model="innerVisible"
        append-to-body
        title="注销账户二次确认"
        width="500"
        @close="handleClose"
    >
      <span>注销账户后，数据无法恢复！请再次确认要删除账户。</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="danger" @click="handleDelete">
            再次确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button style="margin-left: 10px" type="danger" @click="innerVisible = true">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.profile-delete-button {
  margin-top: 10px;
}
</style>