<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {useAccountStore} from "@/stores/accountStore.js";
import CardZzzStatistic from "@/views/Home/CardZzzStatistic.vue";
import CardSrStatistic from "@/views/Home/CardSrStatistic.vue";
import CardServerInfo from "@/views/Home/CardServerInfo.vue";
import CardNewAccount from "@/views/Home/CardNewAccount.vue";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const isMobileStore = useIsMobileStore();

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 设置卡片墙高度
const cardsLayoutHeight = ref(500)
const calculateLayoutHeight = () => {
  const windowHeight = window.innerHeight
  const margin = isMobileStore.isMobile ? 120 : 175

  cardsLayoutHeight.value = windowHeight - margin
}

onMounted(async () => {
  await nextTick()
  calculateLayoutHeight()
  window.addEventListener('resize', calculateLayoutHeight)
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateLayoutHeight)
})
</script>

<template>
  <el-scrollbar :max-height="cardsLayoutHeight" style="margin-left: 10px">
    <el-row :gutter="16" style="width: 99%">

      <el-col
          v-for="item in accounts"
          :key="item.uuid"
          :lg="8" :md="12" :sm="12" :xs="24"
          class="col-margin"
      >
        <div v-if="item.type === 'ZZZ'">
          <card-zzz-statistic :uuid="item.uuid" class="profile-card"/>
        </div>
        <div v-if="item.type === 'SR'">
          <card-sr-statistic :uuid="item.uuid" class="profile-card"/>
        </div>
      </el-col>

      <el-col :lg="8" :md="12" :sm="12" :xs="24" class="col-margin">
        <card-new-account class="profile-card"/>
      </el-col>

      <el-col :lg="12" :md="16" :sm="12" :xs="24" class="col-margin">
        <card-server-info class="profile-card"/>
      </el-col>

    </el-row>
  </el-scrollbar>
</template>

<style scoped>
.profile-card {
  max-height: 360px;
}

.col-margin {
  margin-bottom: 16px;
}
</style>