<script setup>
import { ref } from 'vue'
import { userUpdatePassService } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
const formRef = ref()
const router = useRouter()
const userStore = useUserStore()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 校验新密码与旧密码是否一致
const checkOldSame = (rule, value, cb) => {// rule: 校验规则对象，value：当前校验的值，cb：回调函数
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}
// 校验两次输入的新密码是否一致
const checkNewSame = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}
// 定义表单校验规则
const rules = {
  // 原密码
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'//blur: 失去焦点时触发校验
    }
  ],
  // 新密码
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }//validator: 自定义校验函数
  ],
  // 确认新密码
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}
// 提交表单
const onSubmit = async () => {

  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdatePassService(pwdForm.value)//调用更新密码的接口
    ElMessage({ type: 'success', message: '更换密码成功' })
    userStore.clearToken()//清空token
    userStore.clearUser()//清空用户信息
    router.push('/login')//跳转到登录页
  }
}
// 重置表单
const onReset = () => {
  formRef.value.resetFields()//resetFields: 重置表单字段的值和校验状态
}
</script>
<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password" password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">修改密码</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>