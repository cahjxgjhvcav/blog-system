import { getUserInfoService } from "@/api/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user",()=> {
    const token = ref('')
    const setToken = (newToken) => {
        token.value = newToken
    }
    const clearToken = () => {
        token.value = ''
    }
    const user = ref({})
    const getUser = async () =>{
        const res = await getUserInfoService()
        user.value = res.data.data
    }
    const clearUser = () => {
        user.value = {}
    }
    return {
        token,
        user,
        setToken,
        clearToken,
        getUser,
        clearUser
    }
},{
    persist: true
})