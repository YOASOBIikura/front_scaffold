<template>
    <div class="assetOption">
         <div class="top">
            <p class="p1">
               <img class="icon" :src="props.tokenInfo.img" alt="">
               <span class="text">{{props.name}}</span>
            </p>
            <p class="p2">
                <span class="title">{{ walletBalance }}</span>
                <span class="text">${{ walletAmountUsd}}</span>
            </p>
            <p class="p2">
                <span class="title">{{vaultBalance}}</span>
                <span class="text">${{vaultAmountUsd}}</span>
            </p>
         </div>

         <div class="bottom">
             <div class="p1">
                 <p :class="props.tokenInfo.isGasToken && props.issueMode >=2?'select left unActive':'select left'" @click="goTransfer('issue')">
                    <img  src="@/assets/images/arrow_right2.png" alt="">
                 </p>
                 <p class="select" @click="goTransfer('redeem')">
                    <img  src="@/assets/images/arrow_left.png" alt="">
                 </p>       
             </div>
             <p class="p2">
                 <span :class="props.tokenInfo.isSellCall&&'option'||'option unActive'" @click="goSellOption('call')">Sell Call</span>
                 <span :class="props.tokenInfo.isSellPut&&'option right'||'option right unActive'  " @click="goSellOption('put')">Sell Put</span>
             </p> 
         </div>
    </div>
</template>   

<script setup>
import { ethers } from 'ethers';
import { reactive,defineProps,onMounted,computed} from 'vue';
import { useRouter,useRoute,} from "vue-router";
import {useAxiosStore} from "@/pinia/modules/axios";
const axiosStore= useAxiosStore()
const router=useRouter()
const props=defineProps({
    tokenInfo:{
         type:Object,
         require:true,
         default:{}
    },
    issueMode:{
        type:Number,
        require:false,
        default:0
    }
})
//-----------计算属性---------------------
var walletAmountUsd=computed(()=>{
    let value=  props.tokenInfo.tokenPrice.mul(props.tokenInfo.walletBalance).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",props.tokenInfo.decimals))
    return (value.toNumber()/100).toFixed(2)
})

var vaultAmountUsd=computed(()=>{
    let value= props.tokenInfo.tokenPrice.mul(props.tokenInfo.vaultBalance).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",props.tokenInfo.decimals))
    return (value.toNumber()/100).toFixed(2)
})

var walletBalance=computed(()=>{
    let value=props.tokenInfo.walletBalance.div(ethers.utils.parseUnits("1",props.tokenInfo.decimals-2))
    // if(walletAmountUsd>10){
     
    // }else{

    // }
    return  (value.toNumber()/100).toFixed(2)
})

var vaultBalance=computed(()=>{
    let value=props.tokenInfo.vaultBalance.div(ethers.utils.parseUnits("1",props.tokenInfo.decimals-2))
    return  (value.toNumber()/100).toFixed(2)
})

//---------方法跳转-------------------
var goTransfer=(type)=>{
    if(props.tokenInfo.isGasToken && props.issueMode >=2){
        console.log("申购模式错误")
          return
    }

    let salt=props.tokenInfo.salt.toString()
    let walletBalance=props.tokenInfo.walletBalance.toString()
    let vaultBalance=props.tokenInfo.vaultBalance.toString()
    let tokenPrice=props.tokenInfo.tokenPrice.toString()
    let tokenInfo=JSON.parse(JSON.stringify(props.tokenInfo))  
    tokenInfo.walletBalance=walletBalance
    tokenInfo.vaultBalance=vaultBalance
    tokenInfo.tokenPrice=tokenPrice
    tokenInfo.salt=salt
    sessionStorage.setItem("assetTranferData",JSON.stringify(tokenInfo))
    router.push({path:"/assetTransfer",query:{type:type,issueMode:props.issueMode}})
}
var goSellOption=(orderType)=>{
  
    if(orderType=="call"){
        if(!props.tokenInfo.isSellCall){
            return
        }
        router.push({path:"/sellCall",query:{asset:props.tokenInfo.name}})
    }else{
        if(!props.tokenInfo.isSellPut){
            return
        }
        router.push({path:"/sellPut",query:{asset:props.tokenInfo.name}})
    }
}
</script>
<style lang="less" scoped>
 .assetOption{
    width: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--border-color);
    .top{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .p1{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 12px;
            }
            .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
            }

        }
        .p2{
           display: flex;
           flex-direction: column;
           align-items: flex-end;
           .title{
              color: var(--text-color-primary);
              font-size: 16px;
              margin-bottom: 3px;
           }
           .text{
              color: var(--text-color-second);
              font-size: 12px;
           }
        }
    }
    .bottom{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .p1{
          display: flex;
          flex-direction: row;
          align-items: center;
          .select{
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color:var(--bg-color-secondarycontainer) ;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img{
                width: 16px;
                height: 16px;
            }

          }
          .unActive{
                background:var(--bg-color-unActive);
                color: var(--text-color-second);   
            }
          .left{
            margin-right: 8px;
          }
        }
        .p2{
        display: flex;
           flex-direction: row;
           align-items: center;
            .option{
                display: block;
                height: 32px;
                width: 128px;
                background-color:var(--bg-color-secondarycontainer);
                text-align: center;
                line-height: 32px;
                font-size: 14px;
                font-weight: 600;
                color: var(--text-color-primary);
                border-radius: 32px;
            }
            .right{
                margin-left: 8px;
            }
            .unActive{
                background: var(--bg-color-unActive);
                color: var(--text-color-second);
                
            }

   
        }
    }
 }

</style>