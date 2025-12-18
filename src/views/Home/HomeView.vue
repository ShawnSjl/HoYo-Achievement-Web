<script setup>
import router from "@/router";
import {showInfo} from "@/utils/notification";

const handleZZZ = () => {
  router.push({ path: '/zzz' });
}

const handleSR = () => {
  router.push({ path: '/sr' });
}
</script>

<template>
  <div class="background-container">
    <div class="half left" @click="handleZZZ" />
    <div class="half right" @click="handleSR" />
  </div>
</template>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1; /* 保持在页面最底层 */
}

.half {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.4s ease;
}

/* 左边背景 */
.left {
  background-image: url('@/assets/zzz-image/zzz-bg-2.png');
  clip-path: polygon(0 0, 55% 0, 45% 100%, 0 100%);
  background-position: left -800px top;
  z-index: 1;
}

/* 右边背景 */
.right {
  background-image: url('@/assets/sr-image/sr-bg-2.png');
  clip-path: polygon(55% 0, 100% 0, 100% 100%, 45% 100%);
  background-position: right -200px top;
  z-index: 0;
}

/* hover 效果 */
.left:hover,
.right:hover {
  transform: scale(1.02);
  z-index: 2;
}

@media (orientation: portrait) {
  .left {
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 55%);
    background-position: right -400px top -100px;
  }

  .right {
    clip-path: polygon(0 55%, 100% 45%, 100% 100%, 0 100%);
    background-position: right -200px top 150px ;
  }
}
</style>