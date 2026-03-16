<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
//弹窗，默认隐藏
const dialogVisible = ref(false)
//表单数据
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
//表单验证规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
//点击添加文章或编辑按钮调用open方法打开弹窗
const open = async (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }//如果row有值，则将row的值赋给formModel，否则formModel为空对象
}
//获取表单实例
const formRef = ref()
//通知父组件重新获取数据渲染
const emit = defineEmits(['success'])
//点击确认按钮提交表单
const onSubmit = async () => {
  await formRef.value.validate()//先验证表单
  formModel.value.id//如果formModel有id，则为编辑，否则为添加
    ? await artEditChannelService(formModel.value)
    : await artAddChannelService(formModel.value)
  ElMessage({//提示添加或编辑成功
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  dialogVisible.value = false//关闭弹窗
  emit('success')//通知父组件重新获取数据渲染
}
//将open方法暴露出去，父组件才能调用
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" 
  :title="formModel.id ? '编辑分类' : '添加分类'"
  width="30%">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          minlength="1"
          maxlength="15"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>