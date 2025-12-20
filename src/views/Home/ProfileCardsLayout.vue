<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {useIsMobileStore} from "@/stores/isMobileStore.js";
import {useAccountStore} from "@/stores/accountStore.js";
import CardZzzStatistic from "@/views/Home/CardZzzStatistic.vue";
import CardSrStatistic from "@/views/Home/CardSrStatistic.vue";
import CardEmpty from "@/views/Home/CardEmpty.vue";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const isMobileStore = useIsMobileStore();

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
    <el-row :gutter="20" class="profile-card-layout">

      <el-col
          v-for="item in accountStore.accounts"
          :key="item.uuid"
      >
        <div v-if="item.type === 'ZZZ'">
          <card-zzz-statistic :uuid="item.uuid" class="profile-card"/>
        </div>
        <div v-if="item.type === 'SR'">
          <card-sr-statistic :uuid="item.uuid" class="profile-card"/>
        </div>
      </el-col>

      <el-col>
        <card-empty class="profile-card"/>
      </el-col>


    </el-row>
    <!--    <div v-if="!isMobileStore.isMobile" class="profile-card-layout">-->
    <!--      <el-row :gutter="20">-->
    <!--        <el-col :span="14">-->
    <!--          <zzz-statistic-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--        <el-col :span="10">-->
    <!--          <sr-statistic-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="20" style="margin-top: 20px">-->
    <!--        <el-col :span="10">-->
    <!--          <announcement-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--        <el-col :span="14">-->
    <!--          <empty-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--    <div v-else class="profile-card-layout">-->
    <!--      <el-row :gutter="20">-->
    <!--        <el-col :span="24">-->
    <!--          <zzz-statistic-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="20" style="margin-top: 10px">-->
    <!--        <el-col :span="24">-->
    <!--          <sr-statistic-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row :gutter="20" style="margin-top: 10px">-->
    <!--        <el-col :span="24">-->
    <!--          <announcement-card class="profile-card"/>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
  </el-scrollbar>
</template>

<style scoped>
.profile-card-layout {
  width: 98%;
}

@media (max-width: 900px) {
  .profile-card-layout {
    overflow-x: hidden;
  }
}

.profile-card {
  max-height: 360px;
}
</style>