<template>
    <a-config-provider   :theme="CustomTheme">       
        <layout-header v-show="routeStore.showLayout"/>
        <router-view/>
        <layout-bottom v-show="routeStore.showLayout" />
    </a-config-provider>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import {useAxiosStore} from "@/pinia/modules/axios";
import { useRouteStore } from "@/pinia/modules/route"
import CustomTheme from '@/assets/theme/custom'
import layoutHeader from "@/components/layout/layoutHeader.vue"
import layoutBottom from "@/components/layout/layoutBottom.vue"
import { watch,computed} from 'vue';
import { useRouter} from "vue-router";
import { ethers } from "ethers";

import {arbitrum} from "@/config/chainBlock/arbitrum"
//初始化modal
let modalStore= useModalStore()
modalStore.initModal()
//初始化axios
const axiosStore=useAxiosStore();
let provider = new ethers.providers.JsonRpcProvider(arbitrum.chainInfo.rpcUrl);
console.log(provider);
axiosStore.initAxios(provider,null,"");
axiosStore.setChainId(arbitrum.chainInfo.chainId)
axiosStore.setIsConnect(2);
if(import.meta.env.VITE_ENV === "production"){
    console.log = function(){};
}
//----------全局路由处理----------------
//路由管控
const routeStore = useRouteStore();
const router = useRouter();
//监听路由状态
let routeResult=computed(() => router.currentRoute.value)
watch(routeResult,(newVal,oldVal)=>{
    console.log("新路由",newVal)
    routeStore.setCurrentRoute(oldVal,newVal)
})
watch(computed(() => routeStore.changeRoute),(newVal,oldVal)=>{
    console.log("切换路由",newVal,oldVal)
    router.push(newVal)
})

</script>
<style lang="less">
html,body{
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    #app{
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
    }
}

</style>
