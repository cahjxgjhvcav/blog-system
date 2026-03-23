<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUploadAvatarService } from '@/api/user'

const userStore = useUserStore()
const uploadRef = ref()// 创建一个ref对象，用于获取el-upload组件的实例
//为什么给图片地址加上ref？因为在Vue3中，响应式数据需要使用ref或reactive来创建。
// imgUrl是一个响应式变量，当它的值发生变化时，Vue会自动更新视图中的图片地址，从而显示新的头像。
// 因此，我们使用ref来创建imgUrl，使其成为一个响应式变量。
const imgUrl = ref(userStore.user.user_pic)
const onUploadFile = (file) => {// 这里的file是一个对象，包含了上传文件的相关信息，例如文件名、文件大小、文件类型等。
    //使用FileReader对象来读取上传的文件，并将其转换为Data URL格式的字符串。
    const reader = new FileReader()//
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
        imgUrl.value = reader.result// 将读取到的Data URL字符串赋值给imgUrl变量，从而更新视图中的图片地址，显示新的头像。
  }
}
//上传头像
const onUpdateAvatar = async () => {
  await userUploadAvatarService(imgUrl.value)
  await userStore.getUser()// 更新用户信息，获取新的头像地址
  ElMessage({ type: 'success', message: '更换头像成功' })
}
</script>
<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <!-- 通过ref获取el-upload组件的实例，并模拟点击input元素来触发文件选择对话框。 -->
        <el-button 
            @click="uploadRef.$el.querySelector('input').click()"
            type="primary" :icon="Plus" size="large">
          选择图片
        </el-button>
        <el-button @click="onUpdateAvatar" type="success" :icon="Upload" size="large">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>