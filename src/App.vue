<script setup>
import {useRoute} from "vue-router";
import {onMounted, onUnmounted} from "vue";
import {SseSyncClient} from "@/scripts/utils/sseSyncClient.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerUpdateLogStore} from "@/scripts/stores/serverUpdateLogStore.js";

const route = useRoute()

// Get client id from session storage or generate a new one
const clientId = sessionStorage.getItem('SSE_CLIENT_ID') || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
sessionStorage.setItem('SSE_CLIENT_ID', clientId)

let sseClient = null

const handleSync = async () => {
  const srAchievementStore = useSrAchievementStore();
  const zzzAchievementStore = useZzzAchievementStore();
  const serverUpdateLogStore = useServerUpdateLogStore();

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

onMounted(() => {
  sseClient = new SseSyncClient({
    clientId: clientId,
    onSyncNeeded: handleSync,
    onMessageReceived: handleUpdate,
  });

  sseClient.start();
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
