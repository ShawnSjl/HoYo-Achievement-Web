<script setup>
import {ref} from 'vue'
import {useUserStore} from '@/stores/userStore.js';

// 使用Pinia作为本地缓存
const userStore = useUserStore();

// dialog可视性
const outerVisible = ref(false)
const innerVisible = ref(false)

// 处理关闭
const handleClose = () => {
  innerVisible.value = false
  outerVisible.value = false
}

// 处理点击
const handleDelete = async () => {
  await userStore.deleteUser();
}
</script>

<template>
  <el-button round type="danger" @click="outerVisible = true">
    注销用户
  </el-button>

  <el-dialog v-model="outerVisible" title="注销用户" width="500" @close="handleClose">
    <span>注销用户会将此账户从数据库中删除，是否继续？</span>

    <el-dialog
        v-model="innerVisible"
        :modal="false"
        append-to-body
        title="注销用户二次确认"
        width="500"
        @close="handleClose"
    >
      <span>注销用户后，数据无法恢复！请再次确认要删除用户。</span>
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
</style>