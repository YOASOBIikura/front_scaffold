<template>
    <div class="writeOptionEmpty" >
            <img class="icon" src="@/assets/images/empty.png" alt="">
            <span class="text">{{ props.text }}</span>
            <span v-if="props.isSignal" class="btn" @click="goRoute">Write an Option</span>
            <div v-else>
               <span class="btn2" @click="goRoute('call')">Write Call Option</span>
               <span class="btn2" @click="goRoute('put')">Write Put Option</span>
            </div>
    </div>
</template>

<script setup>
import {defineProps}  from "vue"
import { useRouter } from 'vue-router';
import {useAxiosStore} from "@/pinia/modules/axios"
const axiosStore= useAxiosStore()
const router=useRouter()
const props=defineProps({
     asset:{
       type:String,
       require:true,
       default:""
     },
     orderType:{
       type:String,
       require:true,
       default:"call"
     },
     text:{
      type:String,
      default:""
     },
     isSignal:{
      type:Boolean,
      default:true
     }
})
var goRoute=(item)=>{
     if(item=='call'){
       let asset= axiosStore?.optionBusiness?.underlyingAssets[0]?.name
       if(asset){
          router.push({path:"/sellCall",query:{asset:asset}})
          return
       }
     }
     if(item=="put"){
       let asset= axiosStore?.optionBusiness?.underlyingAssets[0]?.name
       if(asset){
          router.push({path:"/sellPut",query:{asset:asset}})
          return
       }
     }

     if(props.orderType=="call"){
         router.push({path:"/sellCall",query:{asset:props.asset}})
      }else{
         router.push({path:"/sellPut",query:{asset:props.asset}})
      }

}
</script>
<style lang="less" scoped>
.writeOptionEmpty{
        width: 100%;
        height: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       .icon{
          width: 72px;
          height: 72px;
          margin-bottom: 16px;
       }
       .text{
          color: var(--text-color-primary);
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
       }
       .btn{
          background-color:var(--bg-color-container-active) ;
          color: var(--bg-color-page);
          border-radius: 32px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          padding: 7px 12px;
          box-sizing: border-box;
       }

       .btn2{
          background-color:var(--bg-color-container-active) ;
          color: var(--bg-color-page);
          border-radius: 32px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          padding: 7px 12px;
          box-sizing: border-box;
          margin: 0 10px;
       }
       
     }

</style>