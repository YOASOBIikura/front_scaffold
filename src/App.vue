<template>
    <a-config-provider   :theme="CustomTheme">       
        <layout-header v-if="routeStore.showLayout"/>
        <router-view/>
        <layout-bottom v-if="routeStore.showLayout"/>
    </a-config-provider>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import {useAxiosStore} from "@/pinia/modules/axios";
import { useRouteStore } from "@/pinia/modules/route"
import CustomTheme from '@/assets/theme/custom'
import layoutHeader from "@/components/layout/layoutHeader.vue"
import layoutBottom from "@/components/layout/layoutBottom.vue"
import {  watch,computed} from 'vue';
import { useRouter} from "vue-router";
// import
//初始化modal
let modalStore= useModalStore()
modalStore.initModal()
//初始化axios
const axiosStore=useAxiosStore()
axiosStore.initAxios(null,null,"");



//----------全局路由处理----------------
//路由管控
const routeStore = useRouteStore();
const router = useRouter();
//监听路由状态
let routeResult=computed(() => router.currentRoute.value)
watch(routeResult,(newVal,oldVal)=>{
    routeStore.setCurrentRoute(oldVal,newVal)
})
let changeRoute=computed(() => routeStore.changeRoute)
watch(changeRoute,(newVal,oldVal)=>{
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
