<template>
    <div class="buyOptionEmpty" >
            <img class="icon" src="@/assets/images/empty.png" alt="">
            <span class="text">You don't currenty hava options</span>
            <div>
               <span class="btn" @click="goRoute('call')">Buy an Call</span>
               <span class="btn" @click="goRoute('put')">Buy an Put</span>
            </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router=useRouter()
var goRoute=(type)=>{
     if(type="call"){
      router.push({path:"/buyCall"})
     }else{
       router.push({path:"/buyPut"})
     }
}
</script>
<style lang="less" scoped>
.buyOptionEmpty{
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
          margin: 0 10px;
       }
       
     }

</style>