<script setup>
import {filterOption} from "@/scripts/utils/filterOption.js";

// 传入可写数据
const input = defineModel('input');
const filterType = defineModel('type')
</script>

<template>
  <div class="filter-sr-wrapper">
    <el-input v-model="input"
              clearable
              placeholder="请输入成就名或版本号"
    />
    <el-select v-model="filterType"
               class="filter-sr-select"
               placeholder="全部"
               popper-class="sr-filter-select"
    >
      <el-option
          v-for="item in filterOption"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
  </div>
</template>

<style scoped>
.filter-sr-wrapper {
  margin-left: 12px;
  margin-right: 12px;

  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  gap: 6px;
}

.filter-sr-select {
  width: 180px;
}

/* select */
/* 菜单按钮 */
:deep(.el-select__wrapper) {
  background-color: #3f9eff;
  box-shadow: 0 0 0 0 #3f9eff;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #3f9eff;
}

/* placeholder字体 */
:deep(.el-select__placeholder) {
  font-weight: bold;
  color: #ffffff;
}

/* 菜单打开时placeholder字体 */
:deep(.el-select__placeholder.is-transparent) {
  font-weight: bold;
  color: #ffffff;
}

:deep(.el-select__caret) {
  color: #ffffff;
}
</style>