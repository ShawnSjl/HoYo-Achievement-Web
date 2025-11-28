<script setup>
import ExcelJS from 'exceljs';
import {showError, showSuccess} from "@/utils/notification";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore";

// 获取数据
const achievementStore = useZzzAchievementStore();

const requiredFields = {
  achievement_id: ['ID', '成就ID', '编号'],
  complete: ['完成', '完成状态', '是否完成', '状态']
};

// 寻找要求的列的名称
function matchRequiredHeaders(headers) {
  const result = {};
  const missing = [];

  for (const [standardKey, candidates] of Object.entries(requiredFields)) {
    const match = headers.find(h =>
        candidates.some(keyword => h.trim().includes(keyword))
    );
    if (match) {
      result[standardKey] = match;
    } else {
      missing.push(standardKey);
    }
  }

  return { matched: result, missing };
}

// 获取要求的列
function convertMinimalRows(headers, body) {
  const { matched, missing } = matchRequiredHeaders(headers);

  if (missing.length) {
    const readable = missing.map(k => k === 'achievement_id' ? 'ID' : '完成');
    throw new Error(`缺少必要字段：${readable.join('、')}`);
  }

  return body.map(row => {
    const obj = {};
    for (const [key, label] of Object.entries(matched)) {
      const index = headers.indexOf(label);
      obj[key] = row[index];
    }
    return obj;
  });
}

async function handleFile(file) {
  try {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet(1); // 获取第一个 sheet
    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      rows.push(row.values.slice(1)); // 跳过 row.values[0]
    });

    // 转换为对象数组
    const [headers, ...body] = rows;
    const json = convertMinimalRows(headers, body);

    // 更新记录
    for (const item of json) {
      const complete = Number(item.complete) === 1 || item.complete === '已完成' ? 1 : 0;
      await achievementStore.completeAchievement(item.achievement_id, complete);
    }

    showSuccess('成就表格导入成功')
  } catch (err) {
    showError('成就表格导入失败', err)
  }

  return false; // 阻止 el-upload 默认上传
}
</script>

<template>
  <el-upload
    action=""
    accept=".xlsx"
    :auto-upload="true"
    :before-upload="handleFile"
    :show-file-list="false"
    >

    <template #trigger>
      <el-button type="primary" round dark>导入成就表格</el-button>
    </template>

    <template #tip>
      <div class="el-upload__tip">
        只能上传.xlsx文件
      </div>
    </template>
  </el-upload>
</template>

<style scoped>

</style>