<script setup>
import {computed, ref} from "vue";
import {useIsMobileStore} from "@/stores/isMobileStore";
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import {Check, Close, Warning} from '@element-plus/icons-vue';
import {srExport} from "@/utils/srExport";
import ButtonSrImport from "@/views/SrAchievement/ButtonSrImport.vue";

// 传入只读数据
const props = defineProps({
  uuid: String,
})

// 使用Pinia作为本地缓存
const achievementStore = useSrAchievementStore();
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
          <button-sr-import :uuid="props.uuid"/>
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
        <el-button dark round type="primary" @click="srExport(props.uuid)">导出成就表格</el-button>
      </div>
      <div>
        <p>强制更新数据:</p>
        <el-button dark round type="info" @click="handleFetch">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>

</style>