<template>
    <div class="assetsHeader">
         <div class="left">
                <div class="icon" id="avtor" > </div>
                <div class="info">
                    <p class="top">
                        <span class="text">Joey268</span>
                        <img v-if="kytStatus" class="img" src="@/assets/images/certified.png" alt="">
                    </p>
                    <p class="bottom">
                        <span class="text" >{{`${String(props.address).substring(0,6)}...${String(props.address).substring(38)}`}}</span>
                        <img class="img" src="@/assets/images/copy2.png" alt="" @click="copyText(props.address)">
                        <span class="text-none" id="copyDom">{{}}</span>
                    </p>
                </div>
          </div>
          <div class="option" @click="goLogout">
            <!-- <img class="option-icon" src="@/assets/images/arrow_right.png" alt="" >   -->
          </div>
            
         </div>
</template>
<script setup>
import { BigNumber, ethers} from 'ethers';
import { reactive,defineProps,onMounted,watch,computed } from 'vue';
import { useRouter,useRoute } from "vue-router";
import {useAxiosStore} from "@/pinia/modules/axios"
import  jazzicon from 'jazzicon'
import { message } from 'ant-design-vue';
const router=useRouter()
const axiosStore=useAxiosStore()
const props=defineProps({
     address:{
         type:String,
         require:true,
         default:ethers.constants.AddressZero
     },
     kytStatus: {
        type: Boolean,
        require: true,
        default: false
     }
})
var goLogout=()=>{
    //  router.push({path:"/logout"})
}


onMounted(()=>{
      createAvator()
}) 

//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),(newVal)=>{
    createAvator()
})

var createAvator=()=>{
    let el= document.getElementById("avtor")
    el.innerHTML=""
    let addrNumber=BigNumber.from(axiosStore.currentAccount).mod(BigNumber.from("0xffffffff"))
    let avator=  jazzicon(64,addrNumber)
    console.log(avator,axiosStore.currentAccount,"-----sss",axiosStore.currentAccount,addrNumber)
    el.appendChild(avator)
}

var copyText = async (data)=> {
        let oInput = document.createElement('input');
        oInput.value = data;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand("Copy"); 
        message.success("copy success");
        oInput.remove();
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
                   .text-none{
                    display: none;
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