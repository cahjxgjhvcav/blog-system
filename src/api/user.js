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
// 更新用户信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })
// 更新用户头像
export const userUploadAvatarService = (avatar) => 
    request.patch('https://big-event-vue-api-t.itheima.net/my/update/avatar', { avatar })
// 更新用户密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('https://big-event-vue-api-t.itheima.net/my/updatepwd', { old_pwd, new_pwd, re_pwd })