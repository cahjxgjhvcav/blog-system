<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user'
const {// 解构出用户信息
  user: { username, nickname, email, id },
    getUser
} = useUserStore()
const userInfo = ref({ username, nickname, email, id })// 将用户信息放入响应式对象中

const rules = {// 验证规则
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,// 昵称必须是2-10位的非空字符串
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'// 失去焦点时触发验证
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}
const formRef = ref()// 表单引用
const onSubmit = async () => {// 提交表单
  const valid = await formRef.value.validate()// 验证表单,返回一个布尔值，表示验证是否通过
//   console.log(valid);true
  if (valid) {// 如果表单验证通过
    await userUpdateInfoService(userInfo.value)
    await getUser()
    ElMessage.success('修改成功')
  }
}
</script>
<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="userInfo"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit" type="primary">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>