<script setup>
import {useServerInfoStore} from "@/stores/serverInfoStore.js";
import {ref} from "vue";
import {dayjs} from "element-plus";
import {useIsMobileStore} from "@/stores/isMobileStore.js";

// 使用Pinia作为本地缓存
const serverInfoStore = useServerInfoStore();
const isMobileStore = useIsMobileStore();

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  dialogVisible.value = false;
}

// 时间线变量
const reverse = ref(false)

// 处理时间戳
const getTime = (timeStr) => {
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm');
}
</script>

<template>
  <div>
    <el-button plain style="width: 100px" type="primary" @click="dialogVisible = true">
      历史更新信息
    </el-button>

    <div class="server-info-dialog">
      <el-dialog
          v-model="dialogVisible"
          :before-close="handleClose"
          :fullscreen="isMobileStore.isMobile"
          title="历史更新信息"
      >
        <el-switch v-model="reverse" active-text="倒序"/>

        <el-divider/>

        <el-timeline :reverse="!reverse">
          <el-timeline-item
              v-for="info in serverInfoStore.allInfo"
              :key="info.info_id"
              :timestamp="getTime(info.updated_at)"
              placement="top"
          >
            <el-card>
              <div class="content-wrapper" style="margin-bottom: 10px">
                <b>服务器版本：</b>
                <p>{{ info.server_version }}</p>
              </div>

              <div class="content-wrapper" style="margin-bottom: 10px">
                <b>《崩坏：星穹铁道》版本：</b>
                <p>{{ info.sr_version }}</p>
              </div>

              <div class="content-wrapper" style="margin-bottom: 10px">
                <b>《绝区零》版本：</b>
                <p>{{ info.zzz_version }}</p>
              </div>

              <b>更新内容：</b>
              <p>{{ info.update_description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
/* --- dialog --- */
.add-account-dialog :deep(.el-dialog) {
  min-width: 600px;
  max-width: 1000px;
}

:deep(.el-dialog) {
  --el-dialog-width: 80%;
}

.add-account-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}

.content-wrapper {
  display: flex;
  align-content: center;
}

p {
  margin: 0;
}
</style>