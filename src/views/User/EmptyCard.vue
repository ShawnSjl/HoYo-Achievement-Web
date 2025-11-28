<script setup>

</script>

<template>
  <div class="card-bg">
    <el-card shadow="never">
      <el-empty :image-size="200" description="敬请期待"/>
    </el-card>
  </div>
</template>

<style scoped>
.card-bg {
  min-height: 360px;
  border-radius: 16px;
  overflow: hidden;
}

.el-card {
  --el-card-bg-color: rgb(255, 255, 255);
  --el-card-border-color: rgb(255, 255, 255);
}
</style>