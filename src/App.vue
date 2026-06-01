<script setup>
import {useRoute} from "vue-router";
import {onMounted, onUnmounted, watch} from "vue";
import {SseSyncClient} from "@/scripts/utils/sseSyncClient.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerUpdateLogStore} from "@/scripts/stores/serverUpdateLogStore.js";
import {useUserStore} from "@/scripts/stores/userStore.js";
import {getClientId} from "@/scripts/utils/clientId.js";

const route = useRoute()
const userStore = useUserStore();
const srAchievementStore = useSrAchievementStore();
const zzzAchievementStore = useZzzAchievementStore();
const serverUpdateLogStore = useServerUpdateLogStore();

let sseClient = null

const handleSync = async () => {
  // Ensure SR's data are loaded
  await srAchievementStore.checkAchievementVersion();

  // Ensure ZZZ's data are loaded
  await zzzAchievementStore.checkAchievementVersion();

  // Fetch the server update log
  await serverUpdateLogStore.ensureServerUpdateLog();
}

const handleUpdate = (payload) => {
  console.log('Received update:', payload);
}

const rebuildSseChannel = () => {
  if (sseClient) {
    console.log('Rebuilding SSE channel...');
    sseClient.destroy();
    sseClient = null;
  }

  sseClient = new SseSyncClient({
    clientId: getClientId(),
    onSyncNeeded: handleSync,
    onMessageReceived: handleUpdate,
  });

  sseClient.start();
}

// rebuild sseClient when user login/logout
watch(
    () => userStore.isLogin,
    (newStatus, oldStatus) => {
      if (newStatus !== oldStatus) {
        console.log('User login status changed, rebuilding SSE channel...');
        rebuildSseChannel();
      }
    },
    {immediate: false}
);

onMounted(() => {
  console.log('Website loaded, starting SSE channel...')
  rebuildSseChannel();
})

onUnmounted(() => {
  if (sseClient) {
    sseClient.destroy();
  }
});
</script>

<template>
  <RouterView :key="route.path"/>
</template>

<style>

</style>
