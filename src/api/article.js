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