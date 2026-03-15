import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', component: () => import('@/views/login/LoginPage.vue')},
    {path: '/', component: () => import('@/views/layout/LayoutContainer.vue'),
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
//路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  //如果用户没有登录，并且访问的不是登录页面，则跳转到登录页面
  if (!userStore.token && to.path !== '/login') return '/login'
})

export default router
