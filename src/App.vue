<template>
    <div>
        <a-config-provider
            :theme="CustomTheme"
        >
            <layout-header v-if="layoutStore.show"/>
            <router-view class="content"/>
            <layout-bottom v-if="layoutStore.show"/>
        </a-config-provider>
    </div>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import {useAxiosStore} from "@/pinia/modules/axios";
import { useLayoutStore } from "@/pinia/modules/layout"
import CustomTheme from '@/assets/theme/custom'
import layoutHeader from "@/components/layout/layout-header.vue"
import layoutBottom from "@/components/layout/layout-bottom.vue"
import { onMounted } from 'vue';
// import
//初始化modal
let modalStore= useModalStore()
modalStore.initModal()
//初始化axios
const axiosStore=useAxiosStore()
axiosStore.initAxios(null,null,"");
const layoutStore = useLayoutStore();
</script>
<style scoped>
.content{
    height: calc(100vh - 106px);
}
</style>
