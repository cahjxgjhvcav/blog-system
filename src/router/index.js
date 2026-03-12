import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', component: () => import('@/views/login/loginPage.vue')},
    {path: '/', component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/article/manage',//默认跳转
      children:[
        //文章管理
        {path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue')},
        //文章分类
        {path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue')},
        //个人详情
        {path: '/user/profile', component: () => import('@/views/user/UserProfile.vue')},
        //个人头像
        {path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue')},
        //个人密码
        {path: '/user/password', component: () => import('@/views/user/UserPassword.vue')},
      ]
    },
  ],
})

export default router
