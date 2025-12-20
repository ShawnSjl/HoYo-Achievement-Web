<script setup>
import {computed, ref} from "vue";
import {useIsMobileStore} from "@/stores/isMobileStore";
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import {Check, Close, Warning} from '@element-plus/icons-vue';
import {ElMessageBox} from "element-plus";
import {showError, showSuccess} from "@/utils/notification";
import {srExport} from "@/utils/srExport";
import ButtonSrImport from "@/views/SrAchievement/ButtonSrImport.vue";

// 移动端适配
const isMobileStore = useIsMobileStore();
const dialogWidth = computed(() => {
  return isMobileStore.isMobile ? '100%' : '500px'
});

const achievementStore = useSrAchievementStore();

const dialogVisible = ref(false);

const handleClick = () => {
  dialogVisible.value = true;
}

const handleClose = () => {
  dialogVisible.value = false;
}

const openWarn = () => {
  ElMessageBox.confirm(
      '强制更新会清理本地缓存数据，确认是否继续？',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  )
      .then(() => {
        achievementStore.fetchAchievements()
        showSuccess('强制更新成功')
      })
      .catch(() => {
        showError('强制更新失败')
      })
}
</script>

<template>
  <el-button
      round
      type="primary"
      @click="handleClick">
    选项
  </el-button>

  <div class="sr-setting-wrapper">
    <el-dialog
        v-model="dialogVisible"
        :before-close="handleClose"
        :width="dialogWidth"
        title="选项"
    >
      <div>
        <p>未完成的成就优先:</p>
        <el-switch
            v-model="achievementStore.isCompleteFirst"
            :active-icon="Check"
            :inactive-icon="Close"
            inline-prompt
            size="large"
        />
      </div>
      <div>
        <p>导入:</p>
        <div style="display: flex">
          <button-sr-import/>
          <el-tooltip effect="light" placement="top">
            <el-button :icon="Warning" circle style="margin-left: 5px" text/>
            <template #content>
              <p>表格头匹配格式：</p>
              <p>成就名称：'名称', '成就'</p>
              <p>完成状态：'完成', '完成状态', '获取状态', '状态' </p>
            </template>
          </el-tooltip>
        </div>
      </div>
      <div>
        <p>导出:</p>
        <el-button dark round type="primary" @click="srExport()">导出成就表格</el-button>
      </div>
      <div>
        <p>强制更新数据:</p>
        <el-button color="red" dark round @click="openWarn">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>

</style>