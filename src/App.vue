<script setup>
  import { useUserStore } from '@/stores'
  const userStore = useUserStore()
</script>

<template>

  <router-view></router-view>
  <hr>
  <div>这是主页面</div>
  <test-demo></test-demo>
  <el-button @click="$router.push('/home')">首页</el-button>
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('sfgkfgafsgfkqgfyqwky')">登录</el-button>
  <el-button @click="userStore.clearToken">退出</el-button>
</template>

<style scoped></style>
