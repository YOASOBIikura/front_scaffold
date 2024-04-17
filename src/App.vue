<template>
    <div>
        <a-config-provider
            :theme="CustomTheme"
        >
            <layout-header></layout-header>
            <router-view class="content"/>
            <layout-bottom></layout-bottom>
            
            
            
        </a-config-provider>
    </div>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import {useAxiosStore} from "@/pinia/modules/axios";
import CustomTheme from '@/assets/theme/custom'
import layoutHeader from '@/components/layout-header.vue';
import layoutBottom from "@/components/layout-bottom.vue"
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
