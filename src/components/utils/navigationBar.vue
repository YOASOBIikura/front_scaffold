<template>
    <div class="navigationBar">
          <img class="icon" src="@/assets/images/back.png" alt="" @click="goRoute">
          <div class="info">
            <slot class="iconSlot" name="icon"></slot>
            <span class="titleText">{{props.title}}</span>
          </div>
          <span></span>

    </div>
</template>
<script setup>
import { useRouteStore } from "@/pinia/modules/route"
import { useRouter} from "vue-router";
import {defineProps} from "vue"
const  routeStore=useRouteStore()
const router=useRouter()
const props=defineProps({
     title:{
         type:String,
         required:false,
         default:""
     }
})
var goRoute=()=>{
        // if(JSON.stringify(routeStore.preQuery) !== "{}"){
        //     router.push({path:routeStore.preRoute, query: routeStore.preQuery})
        // } else {
        //     router.push({path:routeStore.preRoute})
        // }
   router.back();
}
</script>
<style lang="less" scoped>
 .navigationBar{
     width: 100%;
     padding: 0px 16px;
     box-sizing: border-box;
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
     position: fixed;
     height: 56px;
     top: 0px;
     left: 0px;
     background-color: var(--bg-color-page);
     z-index: 998;
     .icon{
        width: 24px;
        height: 24px;
     }
     .info{
        display: flex;
        flex-direction: row;
        align-items: center;
        .iconSlot{
            margin-right: 6px;
        }
        .titleText{
            color: var(--text-color-primary);
            font-size: 16px;
            font-weight: 600;
        }
     }
 }
</style>