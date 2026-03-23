<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'//富文本编辑器
import '@vueup/vue-quill/dist/vue-quill.snow.css'//富文本编辑器样式
import { artPublishService,artGetDetailService,artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)//控制抽屉的显示与隐藏
const defaultForm = {//根据后台接口定义表单数据
  title: '',//文章标题
  cate_id: '',//文章分类id
  cover_img: '',//文章封面
  content: '',//文章内容
  state: ''//文章发布状态
}
const formModel = ref({ ...defaultForm })
const editorRef = ref()//富文本编辑器
const imgUrl = ref('')//图片预览
const open = async (row) => {//打开抽屉
  visibleDrawer.value = true
  if (row.id) {//编辑文章回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img//回显图片预览
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
  } else {//添加文章清空表单
    formModel.value = { ...defaultForm }
    imgUrl.value = ''//清空图片预览
    editorRef.value?.setHTML('')//清空富文本编辑器内容/或者用nextTick回调函数，记得引用import { nextTick } from 'vue'
    // nextTick(() => {
    //   formRef.value?.clearValidate()//清空表单验证
    // })
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}
const onUploadFile = (uploadFile) => {//上传图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)//createObjectURL()方法创建一个表示指定对象的URL（图片预览）
  formModel.value.cover_img = uploadFile.raw//将上传的图片赋值给表单，用于提交
}
//发布或添加文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 state
  formModel.value.state = state

  // 转换 formData 数据
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}
defineExpose({//暴露给父组件
  open
})
</script>
<template>
  <el-drawer
    v-model="visibleDrawer"
    direction="rtl"
    size="50%"
  ><template #header>
    <span style="
    font-size: 24px; font-weight: bold;color: gray;
    ">{{ formModel.id ? '编辑文章' : '发布文章' }}</span>
  </template>
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          style="width:100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onUploadFile"
        >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
            <quill-editor
                ref="editorRef"
                theme="snow"
                v-model:content="formModel.content"
                contentType="html"
            ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {//深度选择器,避免样式污染
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);//边框颜色
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>