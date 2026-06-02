<script setup>
import {useRoute} from "vue-router";
import {onMounted, onUnmounted, watch} from "vue";
import {SseSyncClient} from "@/scripts/utils/sseSyncClient.js";
import {useSrAchievementStore} from "@/scripts/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/scripts/stores/zzzAchievementsStore.js";
import {useServerUpdateLogStore} from "@/scripts/stores/serverUpdateLogStore.js";
import {useUserStore} from "@/scripts/stores/userStore.js";
import {getClientId} from "@/scripts/utils/clientId.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";

const route = useRoute()
const userStore = useUserStore();
const srAchievementStore = useSrAchievementStore();
const zzzAchievementStore = useZzzAchievementStore();
const serverUpdateLogStore = useServerUpdateLogStore();
const accountStore = useAccountStore();

let sseClient = null

const handleSync = async () => {
  // Ensure SR's data are loaded
  await srAchievementStore.checkAchievementVersion();

  // Ensure ZZZ's data are loaded
  await zzzAchievementStore.checkAchievementVersion();

  // Fetch the server update log
  await serverUpdateLogStore.ensureServerUpdateLog();

  if (userStore.isLogin) {
    // Fetch user's data
    await userStore.fetchUserInfo();

    // Fetch user's achievements
    await accountStore.fetchAccounts();
  }
}

const handleUpdate = async (payload) => {
  console.log('Received update:', payload);
  switch (payload.entity_type) {
    case 'USER':
      switch (payload.action) {
        case 'UPDATE':
          await userStore.fetchUserInfo();
          break;
        case 'DELETE':
          await userStore.logoutUser();
          break;
        default:
          console.error('Unknown action:', payload.action);
          break;
      }
      break;

    case 'ACCOUNT':
      switch (payload.action) {
        case 'INSERT':
          await accountStore.fetchNewAccountByUuid(payload.entity_id);
          break;
        case 'UPDATE':
          await accountStore.fetchAccountByUuid(payload.entity_id);
          break;
        case 'DELETE':
          // TODO: handle account deletion, if account is on front page and be deleted, need to go back to home page
          // await accountStore.fetchAccounts();
          break;
        default:
          console.error('Unknown action:', payload.action);
          break;
      }
      break;

    case 'ACCOUNT_RECORD':
      await accountStore.fetchAccountRecords(payload.entity_id.split("&")[0]);
      break;

    case 'ACHIEVEMENT':
      await srAchievementStore.fetchAll();
      await zzzAchievementStore.fetchAll();
      break;

    default:
      console.error('Unknown entity type:', payload.entity_type);
  }
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
