import { dayjs } from 'element-plus'
// 格式化时间
export const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')