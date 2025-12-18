<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, watch, computed} from "vue";
import { useZzzAchievementStore } from "@/stores/zzzAchievementsStore";
import { useUserStore } from '@/stores/userStore.js';
import { useIsMobileStore } from '@/stores/isMobileStore';
import {
  categories, cityClasses,
  explorationClasses,
  storyClasses,
  tacticsClasses,
  zzzGetClassIdByName
} from "@/utils/zzzAchievementClass";
import ZzzTable from "@/views/ZzzAchievement/ZzzTable.vue";
import ZzzHeader from "@/views/ZzzAchievement/ZzzHeader.vue";
import ZzzAside from "@/views/ZzzAchievement/ZzzAside.vue";

// 使用Pinia作为本地缓存
const achievementStore = useZzzAchievementStore()
const authStore = useUserStore();
const isMobileStore = useIsMobileStore();

/* 筛选和排序成就 */
// 选择大类别
const category = ref(categories[0]);
// 选择小类别
const achievementClass = ref(storyClasses[0]);

// 根据类别筛选成就
const filteredAchievements = computed(() => {
  return achievementStore.achievements.filter(achievement => achievement.class_id ===
      zzzGetClassIdByName(achievementClass.value))
});

// 根据条件排序
const sortedAchievements = computed(() => {
  if (achievementStore.isCompleteFirst) {
    return [...filteredAchievements.value].sort((a, b) => {
      const completeA = a.complete === 2 ? 1 : a.complete;
      const completeB = b.complete === 2 ? 1 : b.complete;

      // 1️⃣ 优先按 complete 状态
      if (completeA !== completeB) {
        return completeA - completeB;
      }

      // 2️⃣ 如果 complete 相同，按 id 升序排序
      return a.id - b.id;
    });
  } else {
    return filteredAchievements.value;
  }
});

/* 根据hash定位内容 */
async function syncWithHash() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash) {
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
    await nextTick();
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
    await achievementStore.updateAchievements();
    errorMessage.value = '';
  } catch (e) {
    errorMessage.value = 'Load data failed';
  } finally {
    loading.value = false;
  }
};

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
          <zzz-header v-model="category" />
        </el-header>

        <el-container>
          <el-aside v-if="!isMobileStore.isMobile" class="zzz-container-aside" :style="{ height: `${asideHeight}px` }">
            <zzz-aside v-model="achievementClass"
                                 :category="category" />
          </el-aside>
          <el-main class="zzz-container-main">
            <p v-if="loading">加载中...</p>
            <p v-else-if="errorMessage">{{ errorMessage }}</p>
            <div v-else >
              <zzz-table v-model="achievementClass"
                         :sorted-achievements="sortedAchievements"
                         :table-height="tableHeight" />
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
  background-image: url("@/assets/image/zzz-bg-1.png");
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