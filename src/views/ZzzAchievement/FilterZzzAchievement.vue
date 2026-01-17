<script setup>
import {filterOption} from "@/scripts/utils/filterOption.js";

// 传入可写数据
const input = defineModel('input');
const filterType = defineModel('type')
</script>

<template>
  <div class="filter-zzz-wrapper">
    <el-input v-model="input"
              clearable
              placeholder="请输入成就名或版本号"
    />
    <el-select v-model="filterType"
               class="filter-zzz-select"
               placeholder="全部"
               popper-class="zzz-filter-select"
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
.filter-zzz-wrapper {
  margin-left: 12px;
  margin-right: 12px;

  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  gap: 6px;
}

.filter-zzz-select {
  width: 180px;
}

/* input */
:deep(.el-input__wrapper) {
  background-color: #3a3a3a;
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-input__wrapper.is-hover) {
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-input__inner) {
  color: #e3e3e3;
}

/* select */
:deep(.el-select) {
  --el-select-input-focus-border-color: #616161;
}

/* placeholder字体 */
:deep(.el-select__placeholder) {
  font-weight: bold;
  color: #000000;
}

/* 菜单打开时placeholder字体 */
:deep(.el-select__placeholder.is-transparent) {
  font-weight: bold;
  color: #000000;
}

:deep(.el-select__caret) {
  color: #000000;
}

/* 菜单按钮 */
:deep(.el-select__wrapper) {
  background-color: #ffd100;
  box-shadow: 0 0 0 1px #615b5b;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #615b5b;
}
</style>

<style>
/* 菜单的背景 */
.zzz-filter-select {
  background: #161817 !important;
  border: 1px solid #161817 !important;

  .el-popper__arrow::before {
    background: #161817 !important;
    border: 1px solid #161817 !important;
  }
}

/* 菜单中的选项字体 */
.zzz-filter-select .el-select-dropdown__item {
  color: #cacaca;
  font-weight: bold;
}

/* 菜单中被选中的选项字体 */
.zzz-filter-select .el-select-dropdown__item.is-selected {
  color: #ffd100;
  font-weight: bold;
}

.zzz-filter-select .el-select-dropdown__item.is-selected .el-select-dropdown__item.is-hovering {
  color: #000000;
  font-weight: bold;
}

/* 菜单中被选中的选项背景 */
.zzz-filter-select .el-select-dropdown__item.is-hovering,
.zzz-filter-select .el-select-dropdown__item:hover {
  background-color: #ffd100 !important;
  color: #000; /* 悬停时文字颜色可能也需要调整以保证对比度 */
}
</style>
