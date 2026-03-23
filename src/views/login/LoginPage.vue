<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref,watch } from 'vue'
import { userLoginService, userRegisterService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
//EL表单校验需要4个步骤：1.定义表单对象 2.定义校验规则 
// 3.绑定校验规则（在el-form上绑定:model='数据对象'，:rules='校验规则对象‘）
// 4.调用校验方法（在输入框input绑定v-model=某一个数据对象，在el-form-item上绑定prop='数据对象属性名’）

// 1.定义表单对象
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
//  2.定义校验规则
const rules = {
  username: [
    {
      required: true,//必填(非空)
      message: '请输入用户名',//错误提示信息
      trigger: 'blur'//触发时机（blur失去焦点），change（值改变）
    },
    {
      min: 3,
      max: 15,//长度限制
      message: '用户名长度在 3 到 15 个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },{
      pattern: /^\S{6,15}$/,//正则表达式:长度在 6 到 15 个字符,\S表示非空字符
      message: '密码长度在 6 到 15 个字符',
      trigger: 'blur'
    }],
    repassword:[
      {
        required: true,
        message: '请再次输入密码',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {//自定义校验规则
          if (value !== ruleForm.value.password) {
            //callback的作用是告诉校验器校验通过还是不通过，无论是true还是false，都会结束校验
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()//这个是必须的，否则校验不通过
          }
        },
        trigger: 'blur'
      }
    ]
}

const form = ref()//获取表单对象的数据
//注册请求
const register = async () => {
  //validate方法会返回一个Promise对象，如果校验通过，Promise对象的状态为resolved，否则为rejected
  await form.value.validate()
  // console.log('开始注册请求')
  await userRegisterService(ruleForm.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}
const userstore = useUserStore()
const router = useRouter()
//登录请求
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(ruleForm.value)
  userstore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}
//监听注册与登录切换
watch(isRegister, () => {
  ruleForm.value = {//重置表单
     username: '', password: '', repassword: '' } 
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="ruleForm" :rules="rules">
        <el-form-item>
          <h1>Sign up</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input 
          v-model="ruleForm.username"
          :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="ruleForm.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="info" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="success" underline="never" @click="isRegister = false">
            返回登录
          </el-link>
        </el-form-item>
      </el-form>
      <el-form ref="form" size="large" autocomplete="off" v-else :model="ruleForm" :rules="rules">
        <el-form-item>
          <h1>Sign in</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="success" underline="never">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="info" auto-insert-space>登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="success" underline="never" @click="isRegister = true">
            注册 
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: 
      url('@/assets/logo777.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .button:hover {
        background-color: #7285AB;
      }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    h1{
      color: gray;
    }
  }
}
</style>