<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {useIsMobileStore} from "@/stores/isMobileStore";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {srClasses} from "@/utils/srAchievementClass";
import SrTable from "@/views/SrAchievement/SrTable.vue";
import SrHeader from "@/views/SrAchievement/SrHeader.vue";
import SrAside from "@/views/SrAchievement/SrAside.vue";
import SrStatisticClass from "@/views/SrAchievement/SrStatisticClass.vue";
import {useRoute} from "vue-router";
import router from "@/router/index.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";

// 创建Route
const route = useRoute();

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const achievementStore = useSrAchievementStore();
const isMobileStore = useIsMobileStore();

// 当前账号UUID
const currentUUID = route.meta.uuid;

// 如果用户变更，返回主页
const userName = computed(() => userStore.getUserName());
watch(userName, (_) => {
  router.push({
    path: '/',
  })
});

// 同步数据
const fetchRemoteData = async () => {
  // Ensure SR's data are loaded
  await achievementStore.ensureAchievementData();
  await achievementStore.ensureBranchData();
};
onMounted(() => {
  fetchRemoteData();
});

/* 筛选和排序成就 */
const achievementClass = ref(srClasses[0])

/* 根据hash定位内容 */
const syncStateFromHash = (hashStr) => {
  // 1. 去掉 # 并解码
  const hash = decodeURIComponent(hashStr.replace(/^#/, ''));

  if (!hash) return;

  // 2. 如果当前状态已经和 URL 一致，什么都不做（防止死循环）
  if (achievementClass.value === hash) return;

  // 3. 同步选中项
  achievementClass.value = hash;
};

watch(
    () => route.hash,
    (newHash) => {
      syncStateFromHash(newHash);
    },
    {immediate: true}
);
watch(achievementClass, (newVal) => {
  // 1. 如果新值为空，或者和当前 URL 一样，就不推
  if (!newVal || route.hash === `#${newVal}`) return;

  router.replace({
    query: {...route.query},
    hash: `#${newVal}`
  });
});

/* 设置成就列表高度 */
const tableHeight = ref(500) // 初始值，防止第一次加载为 0

const calculateTableHeight = () => {
  const windowHeight = window.innerHeight

  const headerEl = document.querySelector('.el-header') // 获取头部高度
  const headerHeight = headerEl ? headerEl.offsetHeight : 0

  const margin = isMobileStore.isMobile ? 150 : 180 // 预留的 padding/margin（可调）

  tableHeight.value = windowHeight - headerHeight - margin
}

onMounted(async () => {
  await nextTick()
  calculateTableHeight()
  window.addEventListener('resize', calculateTableHeight)
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateTableHeight)
})

/* 设置侧栏高度 */
const asideHeight = ref('auto');

const calculateAsideHeight = () => {
  asideHeight.value = `${window.innerHeight - 90}px`;
}

onMounted(() => {
  calculateAsideHeight();
  window.addEventListener('resize', calculateAsideHeight);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateAsideHeight);
})
</script>

<template>
  <div class="sr-bg-page">
    <div class="sr-content">
      <el-container style="height: 100vh">
        <el-header class="sr-container-header">
          <sr-header :uuid="currentUUID"/>
        </el-header>

        <el-container>
          <el-aside v-if="!isMobileStore.isMobile"
                    :style="{ height: asideHeight }"
                    class="sr-container-aside">
            <sr-aside v-model="achievementClass"
                      :uuid="currentUUID"/>
          </el-aside>
          <el-main class="sr-container-main">
            <sr-aside v-if="isMobileStore.isMobile" v-model="achievementClass"/>
            <sr-statistic-class
                :achievementClass="achievementClass"
                :uuid="currentUUID"
                style="margin-left: 10px"/>
            <el-divider/>
            <div>
              <sr-table v-model="achievementClass"
                        :table-height="tableHeight"
                        :uuid="currentUUID"/>
            </div>
          </el-main>
        </el-container>

      </el-container>
    </div>
  </div>
</template>

<style scoped>
.sr-bg-page {
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/sr-image/sr-bg-3.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  z-index: -1;
  inset: 0;
  position: fixed;
}

.sr-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.sr-container-header {
  margin-top: 8px;
}

.sr-container-aside {
  width: 130px;
  display: flex;
  align-items: center;
}

.sr-container-main {
  height: 100%;
}

@media (max-width: 900px) {
  .el-main {
    --el-main-padding: 10px;
  }

  .el-header {
    --el-header-height: 44px;
  }

  .el-divider {
    margin: 8px 0;
  }
}
</style>