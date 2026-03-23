<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { ref } from 'vue'
import { artGetListService,artDelService,artGetDetailService } from '@/api/article'
import { formatTime } from '@/utils/formatTime'
import ArticleEdit from './components/ArticleEdit.vue'
import { Loading } from '@element-plus/icons-vue' // 加载图标
import { baseURL } from '@/utils/request'
//接收文章列表
const articleList = ref([])
//接收文章总数，用于分页，默认为0
const total = ref(0)
//接收文章列表的参数，同时也为父子组件通信
const params = ref({
  pagenum: 1,//当前页码
  pagesize: 5,//每页显示条数
  cate_id: '',
  state: ''//文章状态
})
//添加loading效果
const loading = ref(false)
//请求获取文章列表
const getArticleList = async () => {
  loading.value = true//开启loading
  const res = await artGetListService(params.value)//请求
  articleList.value = res.data.data//接收文章列表
  total.value = res.data.total//接收文章总数
  loading.value = false//关闭loading
}
getArticleList()//直接调用，获取文章列表
//改变每页分页
const onSizeChange = (size) => {
  params.value.pagenum = 1//分页改变后重置页码
  params.value.pagesize = size//改变每页显示条数
  getArticleList()//重新请求
}
//改变当前页码
const onCurrentChange = (page) => {
  params.value.pagenum = page//改变当前页码
  //清空筛选条件
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
//搜索（筛选）
const onSearch = () => {
  params.value.pagenum = 1//搜索后重置页码
  getArticleList()//选中搜索的条件后重新请求
}
//重置搜索
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
const articleEditRef = ref()//绑定文章编辑组件
//添加文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}
//编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
//删除文章
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)//
    params.value.pagenum = lastPage//跳转渲染最后一页
  }
  getArticleList()//
}


// 抽屉相关 - 新增
const drawerVisible = ref(false) // 控制抽屉显示/隐藏
const currentArticle = ref(null) // 存储当前选中的文章数据
const contentLoading = ref(false) // 文章详情加载状态（防止加载中闪烁）
const imgUrl = ref('')//图片预览
//获取文章详情
const getArticleDetail = async (articleId) => {
  contentLoading.value = true // 开启内容加载状态
  try {
    // 调用文章详情接口（相对路径，依赖项目request的baseURL配置）
    const res = await artGetDetailService(articleId)
    currentArticle.value = res.data.data // 保存完整文章数据（含HTML内容）
    imgUrl.value = baseURL + currentArticle.value.cover_img//回显图片预览
  } catch (e) {
    console.error('获取文章详情失败：', e)
    ElMessage.error('获取文章详情失败：' + (e.message || '请先登录'))
    drawerVisible.value = false // 接口失败时关闭抽屉
  } finally {
    contentLoading.value = false // 关闭内容加载状态
  }
}
// 点击标题打开抽屉 
const openArticleDrawer = async (row) => {
  drawerVisible.value = true // 先打开抽屉
  await getArticleDetail(row.id) // 再请求文章详情（带ID）
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">发布文章</el-button>
    </template>
    <!-- 表头下拉框 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select style="width: 240px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table 
      :data="articleList" v-loading="loading" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" underline="never"
           @click="openArticleDrawer(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="scope">
          {{ formatTime(scope.row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 文章编辑抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
    <!-- 文章详情抽屉 -->
     <el-drawer
      v-model="drawerVisible"      
      title="文章详情"             
      direction="rtl"               
      size="80%"                  
      :destroy-on-close="true"      
      :close-on-click-modal="true"  
    >
      <div v-if="currentArticle" style="padding: 20px; line-height: 1.8;">
        <!-- 文章基础信息展示 -->
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; gap: 20px;">
          <!-- 左侧：标题和信息 -->
          <div style="flex: 1;">
            <h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 600;">{{ currentArticle.title || '无标题' }}</h2>
            <div style="color: #909399; font-size: 14px;">
              <span>分类：{{ currentArticle.cate_name || '未知' }}</span> |
              <span>发布时间：{{ currentArticle.pub_date ? formatTime(currentArticle.pub_date) : '未发布' }}</span> |
              <span>状态：{{ currentArticle.state || '未知' }}</span>
            </div>
          </div>
          
          <!-- 右侧：新增封面图 -->
          <div v-if="currentArticle.cover_img" style="flex-shrink: 0;">
            <el-image
              :src="imgUrl"
              :preview-src-list="[currentArticle.cover_img]"
              fit="cover"
              style="width: 200px; height: 200px; border-radius: 4px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
            >
              <template #error>
                <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background-color: #f5f7fa; color: #909399; border-radius: 4px; border: 1px solid #eee;">
                  暂无封面
                </div>
              </template>
            </el-image>
          </div>
        </div>

        <!-- 文章内容展示（解析HTML标签）- 核心修改 -->
        <div style="width: 100%; min-height: 300px; max-height: 600px; overflow-y: auto; padding: 15px; border: 1px solid #ebeef5; border-radius: 4px; color: #606266;">
          <!-- 加载中提示 -->
          <div v-if="contentLoading" style="text-align: center; line-height: 300px; color: #909399;">
            <Loading style="vertical-align: middle; margin-right: 8px;" />
            加载文章内容中...
          </div>
          <!-- 解析HTML渲染富文本（v-html替代原纯文本展示） -->
            <!-- 关键：解析HTML标签 -->
          <div 
            v-else-if="currentArticle.content && currentArticle.content.trim()" 
            style="white-space: normal; word-break: break-all; line-height: 1.8;"
            v-html="currentArticle.content" 
          ></div>
          <!-- 兼容content_html字段（备用） -->
          <div 
            v-else-if="currentArticle.content_html && currentArticle.content_html.trim()" 
            style="white-space: normal; word-break: break-all; line-height: 1.8;"
            v-html="currentArticle.content_html"
          ></div>
          <!-- 无内容提示 -->
          <div v-else style="color: #909399; text-align: center; line-height: 300px;">
            暂无文章内容
          </div>
        </div>
      </div>
      <!-- 抽屉初始化加载提示 -->
      <div v-else style="text-align: center; padding: 50px; color: #909399;">
        加载中...
      </div>
    </el-drawer>
  </page-container>
</template>
<style scoped>
/* 修复HTML内容渲染后的样式 */
:deep(.article-content) {
  line-height: 1.8;
}
:deep(p) {
  margin: 0 0 10px 0;
}
:deep(ol), :deep(ul) {
  margin: 10px 0;
  padding-left: 20px;
}
:deep(li) {
  margin: 5px 0;
}
:deep(strong) {
  font-weight: 600;
}
:deep(span[style]) {
  display: inline;
}
</style>