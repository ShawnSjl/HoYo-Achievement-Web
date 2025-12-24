<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useUserStore} from '@/stores/userStore.js';
import {useIsMobileStore} from '@/stores/isMobileStore';
import {categories, cityClasses, explorationClasses, storyClasses, tacticsClasses} from "@/utils/zzzAchievementClass";
import ZzzTable from "@/views/ZzzAchievement/ZzzTable.vue";
import ZzzHeader from "@/views/ZzzAchievement/ZzzHeader.vue";
import ZzzAside from "@/views/ZzzAchievement/ZzzAside.vue";
import {useRoute} from "vue-router";
import router from "@/router/index.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";

// 创建Route
const route = useRoute();

// 使用Pinia作为本地缓存
const userStore = useUserStore();
const achievementStore = useZzzAchievementStore();
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
  // Ensure ZZZ's data are loaded
  await achievementStore.ensureAchievementData();
  await achievementStore.ensureBranchData();
};
onMounted(() => {
  fetchRemoteData();
});

/* 筛选和排序成就 */
const category = ref(categories[0]);  // 大类别
const achievementClass = ref(storyClasses[0]);  // 小类别

/* 根据hash定位内容 */
const syncStateFromHash = (hashStr) => {
  // FIXME

  // 1. 去掉 # 并解码
  const hash = decodeURIComponent(hashStr.replace(/^#/, ''));

  if (!hash) return;

  // 2. 如果当前状态已经和 URL 一致，什么都不做（防止死循环）
  if (achievementClass.value === hash) return;

  if (storyClasses.includes(hash)) {
    category.value = categories[0];
  } else if (cityClasses.includes(hash)) {
    category.value = categories[1];
  } else if (tacticsClasses.includes(hash)) {
    category.value = categories[2];
  } else if (explorationClasses.includes(hash)) {
    category.value = categories[3];
  } else {
    return;
  }

  // 4. 同步选中项
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

  const margin = isMobileStore.isMobile ? 90 : 142 // 预留的 padding/margin（可调）

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
const asideHeight = ref(900);

const calculateAsideHeight = () => {
  asideHeight.value = window.innerHeight - 90;
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
  <div class="zzz-bg-page">
    <div class="zzz-content">
      <el-container class="zzz-container" style="height: 100vh">
        <el-header class="zzz-container-header">
          <zzz-header v-model="category" :uuid="currentUUID"/>
        </el-header>

        <el-container>
          <el-aside v-if="!isMobileStore.isMobile" :style="{ height: `${asideHeight}px` }" class="zzz-container-aside">
            <zzz-aside v-model="achievementClass"
                       :category="category"
                       :uuid="currentUUID"/>
          </el-aside>
          <el-main class="zzz-container-main">
            <div>
              <zzz-table v-model="achievementClass"
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
.zzz-bg-page {
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/zzz-image/zzz-bg-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  z-index: -1;
  inset: 0;
  position: fixed;
}

.zzz-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  border-radius: 8px;
}

.zzz-container-header {
  margin-top: 8px;
}

.zzz-container-aside {
  margin-left: 8px;
  margin-top: 12px;
}

.zzz-container-main {
  height: 100%;
  padding: 5px;
  margin-left: 5px;
  margin-bottom: 10px;
}

@media (max-width: 900px) {
  .zzz-container-main {
    padding: 8px;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
  }

  .el-header {
    --el-header-height: 40px;
    --el-header-padding: 0 10px;
  }
}
</style>