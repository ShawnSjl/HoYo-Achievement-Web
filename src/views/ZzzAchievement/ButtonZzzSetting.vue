<script setup>
import {computed, ref} from 'vue';
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore";
import {Check, Close, Warning} from '@element-plus/icons-vue';
import {useIsMobileStore} from "@/stores/isMobileStore";
import {zzzExport} from "@/utils/zzzExport";
import ButtonZzzImport from "@/views/ZzzAchievement/ButtonZzzImport.vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore();
const isMobileStore = useIsMobileStore();

// dialog可视性
const dialogVisible = ref(false);

// 移动端适配
const dialogWidth = computed(() => {
  return isMobileStore.isMobile ? '100%' : '500px'
});

// 处理按钮点击
const handleClick = () => {
  dialogVisible.value = true;
}

// 处理dialog关闭
const handleClose = () => {
  dialogVisible.value = false;
}

// 处理强制刷新
const handleFetch = async () => {
  await achievementStore.fetchAchievements();
  await achievementStore.fetchBranches();
}
</script>

<template>
  <el-button
      color="#ffd100"
      round
      @click="handleClick">
    选项
  </el-button>

  <div class="zzz-setting-dialog">
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
        <p>特殊文本性别:</p>
        <el-radio-group v-model="achievementStore.isMale">
          <el-radio :value="true" size="large">男</el-radio>
          <el-radio :value="false" size="large">女</el-radio>
        </el-radio-group>
      </div>
      <div>
        <p>导入:</p>
        <div style="display: flex">
          <button-zzz-import :uuid="props.uuid"/>
          <el-tooltip placement="top">
            <el-button :icon="Warning" circle style="margin-left: 5px" text/>
            <template #content>
              <p>表格头匹配格式：</p>
              <p>成就ID：'ID', '成就ID', '编号'</p>
              <p>完成状态：'完成', '完成状态', '是否完成', '状态' </p>
            </template>
          </el-tooltip>
        </div>
      </div>
      <div>
        <p>导出:</p>
        <el-button dark round type="primary" @click="zzzExport(props.uuid)">导出成就表格</el-button>
      </div>
      <div>
        <p>强制更新本地数据:</p>
        <el-button color="red" dark round @click="handleFetch">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-button {
  --el-button-outline-color: #fbfbfb;
}

.el-switch {
  --el-switch-off-color: #636363;
}

.zzz-setting-dialog :deep(.el-dialog) {
  --el-dialog-bg-color: #232524 !important;
  --background-color: #232524 !important;
}

.zzz-setting-dialog :deep(.el-dialog__title) {
  color: #d5d5d5 !important;
  font-weight: bold;
}

.zzz-setting-dialog :deep(.el-dialog__body) {
  color: #cacaca !important;
}
</style>
