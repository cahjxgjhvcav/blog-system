import request from '@/utils/request'
// 获取文章分类
export const artGetChannelsService = () => {
    return request.get('https://big-event-vue-api-t.itheima.net/my/cate/list')
}
//添加文章分类
export const artAddChannelService = (data) => {
    return request.post('https://big-event-vue-api-t.itheima.net/my/cate/add',data)
}
//编辑文章分类
export const artEditChannelService = (data) => {
    return request.put('https://big-event-vue-api-t.itheima.net/my/cate/info',data)
}
// 删除文章分类
export const artDelChannelService = (id) =>
  request.delete('https://big-event-vue-api-t.itheima.net/my/cate/del', {
    params: { id }
  })
  //文章
  //获取文章列表，需要传递参数
export const artGetListService = (params) =>
  request.get('/my/article/list', { params })
  //发布文章
export const artPublishService = (data) =>
  request.post('https://big-event-vue-api-t.itheima.net/my/article/add', data)
//根据id获取文章详情
export const artGetDetailService = (id) =>
  request.get('https://big-event-vue-api-t.itheima.net/my/article/info', { params: { id } })
//编辑文章
export const artEditService = (data) => 
  request.put('https://big-event-vue-api-t.itheima.net/my/article/info', data)
//删除文章
export const artDelService = (id) => 
  request.delete('https://big-event-vue-api-t.itheima.net/my/article/info', { params: { id } })

