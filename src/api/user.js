import request from '@/utils/request'
// 用户注册
export const userRegisterService =({ username, password, repassword }) => {
    return request.post('https://big-event-vue-api-t.itheima.net/api/reg',{
        username,
        password,
        repassword
    })
}
// 用户登录
export const userLoginService =({ username, password }) => {
    return request.post('https://big-event-vue-api-t.itheima.net/api/login',{
        username,
        password
    })
}
// 获取用户信息
export const getUserInfoService = () => {
    return request.get('https://big-event-vue-api-t.itheima.net/my/userinfo')
}