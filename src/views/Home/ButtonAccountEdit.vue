<script setup>
import {useAccountStore} from "@/stores/accountStore.js";
import {Delete, Edit} from "@element-plus/icons-vue";
import {computed, reactive, ref, watch} from "vue";
import {showError} from "@/utils/notification.js";
import {accountNameCharPattern, accountUidCharPattern} from "@/utils/formRegex.js";
import {useIsMobileStore} from "@/stores/isMobileStore.js";

// 使用Pinia作为本地缓存
const accountStore = useAccountStore();
const isMobileStore = useIsMobileStore();

// 传入只读数据
const props = defineProps({
  uuid: String,
});

// 获取账户列表
const accounts = computed(() => {
  return accountStore.getAccounts();
})

// 获取账号成就
const account = computed(() =>
    accounts.value.find(account => account.uuid === props.uuid)
);

// dialog可视性
const dialogVisible = ref(false);

// 处理dialog关闭
const handleClose = () => {
  if (changeNameFormRef.value) changeNameFormRef.value.resetFields();
  if (uidFormRef.value) uidFormRef.value.resetFields();
  dialogVisible.value = false;
}

// 改名表单
const changeNameFormRef = ref(null);
const changeNameForm = reactive({
  accountName: ''
})

// 改名表单规则
const changeNameRule = {
  accountName: [
    {required: true, message: '请输入账号名称', trigger: ['blur', 'change']},
    {min: 3, max: 20, message: '长度在3到20个字符', trigger: ['blur', 'change']},
    {
      pattern: accountNameCharPattern,
      message: '账户名称格式不正确,只能包含中文、字母、数字、下划线',
      trigger: ['blur', 'change']
    }
  ]
}

// 处理改名表单提交
const handleClickSubmitNewName = () => {
  changeNameFormRef.value.validate((valid) => {
    if (valid) {
      handleSubmitNewName();
    } else {
      showError("请输入账号名称");
    }
  })
}
const handleSubmitNewName = async () => {
  await accountStore.updateName(props.uuid, changeNameForm.accountName);
}

// UID表单
const uidFormRef = ref(null);
const uidForm = reactive({
  inGameUid: ''
})

// UID表单规则
const uidRule = {
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

// 处理改名表单提交
const handleClickSubmitUid = () => {
  uidFormRef.value.validate((valid) => {
    if (valid) {
      HandleSubmitUid();
    } else {
      showError("请输入账号UID");
    }
  })
}
const HandleSubmitUid = async () => {
  await accountStore.updateInGameUid(props.uuid, uidForm.inGameUid);
}

// 处理删除
const handleDelete = async () => {
  await accountStore.deleteTargetAccount(props.uuid)
}

// 开启时自动填充表单
watch(dialogVisible, (val) => {
  if (val && account.value) {
    changeNameForm.accountName = account.value.name || '';
    uidForm.inGameUid = account.value.inGameUid || '';
  }
})
</script>

<template>
  <el-button
      :icon="Edit"
      circle
      type="primary"
      @click.stop="dialogVisible = true"
  />

  <el-dialog
      v-model="dialogVisible"
      :before-close="handleClose"
      :fullscreen="isMobileStore.isMobile"
      append-to-body
      title="修改游戏账户"
  >
    <div>
      <b>修改账户名称</b>
      <el-form
          ref="changeNameFormRef"
          :model="changeNameForm"
          :rules="changeNameRule"
          label-width="auto"
          @keyup.enter.native="handleClickSubmitNewName"
      >
        <el-form-item label="游戏账户名" prop="accountName">
          <div class="form-content-wrapper">
            <el-input v-model="changeNameForm.accountName"/>
            <el-button type="primary" @click="handleClickSubmitNewName">提交</el-button>
          </div>
        </el-form-item>
      </el-form>

      <b>修改账户UID</b>
      <el-form
          ref="uidFormRef"
          :model="uidForm"
          :rules="uidRule"
          label-width="auto"
          @keyup.enter.native="handleClickSubmitUid"
      >
        <el-form-item label="游戏UID" prop="inGameUid">
          <div class="form-content-wrapper">
            <el-input v-model="uidForm.inGameUid"/>
            <el-button type="primary" @click="handleClickSubmitUid">提交</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div style="display: flex; flex-direction: column; gap:5px">
        <b>删除账号</b>
        <el-button :icon="Delete" style="width: 90px" type="danger" @click="handleDelete">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.form-content-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%
}
</style>