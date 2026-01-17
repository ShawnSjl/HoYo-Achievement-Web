<script setup>
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {showError} from "@/scripts/utils/notification.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {accountNameCharPattern, accountUidCharPattern} from "@/scripts/utils/formRegex.js";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();

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

// dialog可视性
const dialogVisible = ref(false);

// 表单变量
const formRef = ref(null);
const newAccountForm = reactive({
  type: '',
  accountName: '',
  inGameUid: '',
});

// 表单规则
const rules = {
  type: [
    {required: true, message: '请选择游戏类型', trigger: ['blur', 'change']},
  ],
  accountName: [
    {required: true, message: '请输入账号名称', trigger: ['blur', 'change']},
    {min: 3, max: 20, message: '长度在3到20个字符', trigger: ['blur', 'change']},
    {
      pattern: accountNameCharPattern,
      message: '账户名称格式不正确,只能包含中文、字母、数字、下划线',
      trigger: ['blur', 'change']
    }
  ],
  inGameUid: [
    {required: false, message: '请输入账号UID', trigger: ['blur', 'change']},
    {min: 5, max: 20, message: '长度在5到20个字符', trigger: ['blur', 'change']},
    {
      pattern: accountUidCharPattern,
      message: 'UID格式不正确,只能包含字母、数字',
      trigger: ['blur', 'change']
    }
  ]
}

// 处理dialog关闭
const handleClose = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

// 处理表单提交
const handleSubmit = async () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleAction();
    } else {
      showError("请填写要求的内容");
    }
  })
}
const handleAction = async () => {
  await accountStore.createNew(newAccountForm.type, newAccountForm.accountName, newAccountForm.inGameUid);
}
</script>

<template>
  <div>
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

          <div class="hover-overlay" @click="dialogVisible = true">
            <div class="overlay-content">
              <span class="add-text">添加游戏账号</span>
            </div>
          </div>

        </div>
      </el-card>
    </div>

    <div class="add-account-dialog">
      <el-dialog
          v-model="dialogVisible"
          :before-close="handleClose"
          class="add-account-dialog"
          title="添加游戏账户"
      >
        <div>
          <el-form
              ref="formRef"
              :model="newAccountForm"
              :rules="rules"
              label-width="auto"
              @keyup.enter.native="handleSubmit"
          >
            <el-form-item label="游戏类型" prop="type">
              <el-radio-group v-model="newAccountForm.type">
                <el-radio border label="SR">崩坏：星穹铁道</el-radio>
                <el-radio border label="ZZZ">绝区零</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="游戏账户名" prop="accountName">
              <el-input v-model="newAccountForm.accountName"/>
            </el-form-item>
            <el-form-item label="游戏UID" prop="inGameUid">
              <el-input v-model="newAccountForm.inGameUid"/>
            </el-form-item>
          </el-form>
        </div>

        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button style="margin-left: 10px" type="primary" @click="handleSubmit">添加</el-button>
        </template>
      </el-dialog>
    </div>
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

/* --- 表单 --- */
.add-account-dialog :deep(.el-dialog) {
  min-width: 300px;
  max-width: 500px;
}

.add-account-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}
</style>