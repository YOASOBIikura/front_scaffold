<template>
    <div class="assetsHeader">
         <div class="left">
                <img class="icon" src="@/assets/images/avatarDemo.png" alt="">
            
                <div class="info">
                    <p class="top">
                        <span class="text">Joey268</span>
                        <img class="img" src="@/assets/images/certified.png" alt="">
                    </p>
                    <p class="bottom">
                        <span class="text">{{`${String(props.address).substring(0,6)}...${String(props.address).substring(38)}`}}</span>
                        <img class="img" src="@/assets/images/copy2.png" alt="">
                    </p>
                </div>
          </div>
          <div class="option" @click="goLogout">
            <img class="option-icon" src="@/assets/images/arrow_right.png" alt="" >  
          </div>
            
         </div>
</template>
<script setup>
import { ethers } from 'ethers';
import { reactive,defineProps } from 'vue';
import { useRouter,useRoute } from "vue-router";
const router=useRouter()
const props=defineProps({
     address:{
         type:String,
         require:true,
         default:ethers.constants.AddressZero
     }
})
var goLogout=()=>{
    //  router.push({path:"/logout"})
}
</script>
<style lang="less" scoped>
    .assetsHeader{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding:32px 16px;
        box-sizing: border-box;
        justify-content: space-between;
        border-bottom:8px solid var(--border-color) ;
        .left{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 64px;
                height: 64px;
                border-radius: 50%;
                margin-right: 16px;
            }
            .info{
                display: flex;
                flex-direction: column;
                justify-content: center;

                .top{
                   display: flex;
                   flex-direction: row;
                   align-content: center; 
                   margin-bottom: 6px;
                   .img{
                      width: 16px;
                      height: 16px;
                   }
                }
                .bottom{
                   display: flex;
                   flex-direction: row;
                   align-content: center;
                   .img{
                     width: 16px;
                     height: 16px;
                   }
                }
            }
        }
        .option{
            padding: 10px;
            .option-icon{
                width: 16px;
                height: 16px;
            }
        }

    }
</style>