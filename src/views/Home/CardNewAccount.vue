<script setup>
import {onMounted, onUnmounted, ref} from "vue";

// 计时轮换器变量
const currentImageIndex = ref(0);
let timer = null;

// 开始计时轮换器
const startCarousel = () => {
  timer = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % 2;
  }, 5000);
};
onMounted(() => {
  startCarousel();
});

// 停止计时轮换器
const stopCarousel = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};
onUnmounted(() => {
  stopCarousel();
});
</script>

<template>
  <div class="card-bg">
    <el-card shadow="never" style="height: 100%; border: none">
      <div class="card-content-container">

        <TransitionGroup class="image-wrapper" name="cross-fade" tag="div">
          <img
              v-if="currentImageIndex === 0"
              key="img1"
              alt="background 1"
              class="bg-image"
              src="@/assets/zzz-image/zzz-bg-2.png"
          />
          <img
              v-if="currentImageIndex === 1"
              key="img2"
              alt="background 2"
              class="bg-image"
              src="@/assets/sr-image/sr-bg-2.png"
          />
        </TransitionGroup>

        <div class="hover-overlay">
          <div class="overlay-content">
            <span class="add-text">添加游戏账号</span>
          </div>
        </div>

      </div>
    </el-card>
  </div>
</template>

<style scoped>
/* --- 卡片样式 --- */
.card-bg {
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-card__body) {
  padding: 0;
  height: 100%; /* 关键：让 body 也是 100% 高度 */
}

/* --- 内容容器 --- */
.card-content-container {
  background-color: #000000;
  width: 100%;
  height: 100%;
  position: relative;
}

/* --- 图片包裹层 --- */
.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative; /* 这里的 relative 是为了让里面的 absolute 图片相对于它定位 */
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;

  position: absolute;
  top: 0;
  left: 0;
}

/* --- 动画部分 --- */
.cross-fade-enter-active,
.cross-fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.cross-fade-enter-from,
.cross-fade-leave-to {
  opacity: 0;
}

.cross-fade-enter-to,
.cross-fade-leave-from {
  opacity: 1;
}

/* --- 遮罩层 --- */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.card-content-container:hover .hover-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.add-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>