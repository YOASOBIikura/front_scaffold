<template>
    <div class="layout-bottom">
         <div class="bottom-item" v-for="(item,index) in data.routeList" :key="item"  @click="goRoute(item)">
            <img :src="item.isActive?item.activePng:item.png"/>
            {{item.text}}
        </div>

    </div>
</template>
<script setup>
import {reactive,watch,computed,defineProps,onMounted} from "vue";
import { useRouter,useRoute} from "vue-router";
import tradingPng from "@/assets/images/tabbar1.png"
import portfolioPng from "@/assets/images/tabbar2.png"
import notificationPng from "@/assets/images/tabbar3.png"
import assetPng from "@/assets/images/tabbar4.png"
import tradingActivePng from "@/assets/images/tabbar1_active.png"
import portfolioActivePng from "@/assets/images/tabbar2_active.png"
import notificationActivePng from "@/assets/images/tabbar3_active.png"
import assetActivePng from "@/assets/images/tabbar4_active.png"
import { useRouteStore } from "@/pinia/modules/route"
const routeStore=useRouteStore()
const router = useRouter();
const data = reactive({
    currentSelect: "Trading",
    routeList:[{
         isActive:false,
         route:"/marketPlace",
         png:tradingPng,
         activePng:tradingActivePng,
         text:"Trading",      
        },
        {
         isActive:false,
         route:"/protfolio",
         png:portfolioPng,
         activePng:portfolioActivePng,
         text:"Portfolio",      
        },
        {
         isActive:false,
         route:"/notification",
         png:notificationPng,
         activePng:notificationActivePng,
         text:"Notification",      
        },
        {
         isActive:false,
         route:"/asset",
         png:assetPng,
         activePng:assetActivePng,
         text:"Asset",      
        },
     ]

});
//监听路由状态
let path=computed(() => routeStore.currentRoute)
watch(path,(newVal,oldVal)=>{
    let path=newVal
    data.routeList.forEach(item=>{
       if(path==item.route){
          item.isActive=true
       }else{
           item.isActive=false
       }
   })
})

// 路由跳转
var goRoute=(routeItem)=>{
   data.routeList.forEach(item=>{
      item.isActive=false
   })
   routeItem.isActive=true
   router.push({path:routeItem.route})
}


</script>
<style lang="less" scoped>
.layout-bottom{
   position: fixed; 
   bottom: 0px;
   left: 0px;
   height: 50px;
   width: 100%; 
   display: flex;
   justify-content: space-around;
   border-top: 1px solid var(--component-border);
   padding: 6px 0;
   z-index: 1000;
   background-color: var(--bg-color-page);
   .bottom-item{
        width: 25%;
        font-size: 12px;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        img{
            height: 24px;
            width: 24px;
        }
   }
}
</style>