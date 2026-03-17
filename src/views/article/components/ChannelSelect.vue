<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { defineModel } from 'vue'
//定义一个空数组接收请求文章频道列表
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
//defineModel()定义一个model，用于接收父组件传递过来的值，进行父子组件之间的数据双向绑定
const model =defineModel()
</script>
<template>
    <el-select style="width: 240px" v-model="model">
        <el-option 
        v-for="channel in channelList"
        :key="channel.id"
        :label="channel.cate_name"
        :value="channel.id"></el-option>
    </el-select>
</template>