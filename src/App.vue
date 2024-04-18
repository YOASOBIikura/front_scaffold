<template>
    <div>
        <a-config-provider
            :theme="CustomTheme"
        >
            <router-view class="content"/>
        </a-config-provider>
    </div>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import {useAxiosStore} from "@/pinia/modules/axios";
import CustomTheme from '@/assets/theme/custom'
// import
//初始化modal
let modalStore= useModalStore()
modalStore.initModal()
//初始化axios
const axiosStore=useAxiosStore()
axiosStore.initAxios(null,null,"");





</script>
<style scoped>
.content{
    height: calc(100vh - 106px);
}
</style>
