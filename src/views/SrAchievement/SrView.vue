<script setup>
import {useAuthStore} from "@/stores/authStore";
import {useSrAchievementStore} from "@/stores/srAchievementStore";
import {useIsMobileStore} from "@/stores/isMobileStore";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {srClasses} from "@/utils/srAchievementClass";
import SrTable from "@/views/SrAchievement/SrTable.vue";
import SrHeader from "@/views/SrAchievement/SrHeader.vue";
import SrAside from "@/views/SrAchievement/SrAside.vue";
import SrStatisticClass from "@/views/SrAchievement/SrStatisticClass.vue";

// 使用Pinia作为本地缓存
const authStore = useAuthStore()
const srAchievementStore = useSrAchievementStore()
const isMobileStore = useIsMobileStore()

/* 筛选和排序成就 */
const achievementClass = ref(srClasses[0])

// 根据类别筛选成就
const filteredAchievements = computed(() => {
  return srAchievementStore.achievements.filter(achievement => achievement.class === achievementClass.value)
})

// 根据条件排序
const sortedAchievements = computed(() => {
  if (srAchievementStore.isCompleteFirst) {
    return [...filteredAchievements.value].sort((a, b) => {
      const completeA = a.complete === 2 ? 1 : a.complete;
      const completeB = b.complete === 2 ? 1 : b.complete;

      // 1️⃣ 优先按 complete 状态
      if (completeA !== completeB) {
        return completeA - completeB;
      }

      // 2️⃣ complete 相同，按 id 升序
      return a.id - b.id;
    });
  } else {
    return filteredAchievements.value;
  }
})

/* 根据hash定位内容 */
function syncWithHash() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash && srClasses.includes(hash)) {
    achievementClass.value = hash;
  }
}

onMounted(() => {
  syncWithHash()
});

watch(achievementClass, (newVal) => {
  window.location.hash = encodeURIComponent(newVal);
});

onMounted(() => {
  window.addEventListener('hashchange', syncWithHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncWithHash);
});

/* 根据条件更新/获取成就数据 */
const loading = ref(true);
const errorMessage = ref('');

const fetchData = async () => {
  try {
    loading.value = true;
    authStore.loadUser();
    await srAchievementStore.updateAchievements();
    errorMessage.value = "";
  } catch (e) {
    errorMessage.value = 'Load data failed';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});

watch(achievementClass, async () => {
  await fetchData();
});

const userName = computed(() => authStore.getUserName());
watch(userName, async (newUserName) => {
  console.log(newUserName);
  await fetchData();
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
          <sr-header />
        </el-header>

        <el-container>
          <el-aside v-if="!isMobileStore.isMobile" class="sr-container-aside" :style="{ height: asideHeight }">
            <sr-aside v-model="achievementClass" />
          </el-aside>
          <el-main class="sr-container-main">
            <sr-aside v-if="isMobileStore.isMobile" v-model="achievementClass" />
            <sr-statistic-class
                      :achievementClass="achievementClass"
                      style="margin-left: 10px" />
            <el-divider />
            <p v-if="loading">加载中...</p>
            <p v-else-if="errorMessage">{{ errorMessage }}</p>
            <div v-else >
              <sr-table v-model="achievementClass"
                        :sortedAchievements="sortedAchievements"
                        :table-height="tableHeight" />
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
  background-image: url("@/assets/image-sr/sr-bg-3.png");
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