<template>
    <div class="assetsTransfer">
        <navigationBar :title="`Transfer ${data.tokenInfo.name}`">
            <template v-slot:icon>
                <img  :style="{width: '16px',height: '16px'}" :src="data.tokenInfo.img" alt="">
            </template>
           
        </navigationBar>
        <!--  -->
        <div class="option">
            <div class="left">
                <p class="info">
                    <img class="icon" src="@/assets/images/wallet.png" alt="">
                    <span class="title">Wallet</span>
                </p>
                <span class="balance">Balance</span>
                <span class="text">{{walletBalance}}</span>
            </div>

            <div class="middle" @click="switchType">
                <img class="icon" :src="data.typePng" alt="">
            </div>

            <div class="right">
                <p class="info">
                    <span class="title">JVault</span>
                    <img class="icon" src="@/assets/images/j_wallet.png" alt="">            
                </p>
                <span class="balance">Balance</span>
                <span class="text">{{vaultBalance}}</span>
            </div>
        </div>
        <!--  -->
        <inputValue v-model:value="data.optionNumber" @inputMax="inputMax"></inputValue>
        <!--  -->
        <div class="cost">
            <p class="left">
                <img class="icon" src="@/assets/images/cost.png" alt="">
                <span class="text">Network Cost</span>
            </p>
            <span class="right">0.002Eth</span>
        </div>
        <!--  -->
        <span class="btn" @click="transferTx">Transfer</span>
        <!--  -->
        <assetTranfer v-model:isOpen="data.isOpen" ></assetTranfer>
    </div>
</template>
<script setup>
import navigationBar from "@/components/utils/navigationBar.vue"
import inputNumber from "@/components/utils/inputNumber.vue"
import assetTranfer from "@/components/assets/assetTranfer.vue"
import inputValue from "@/components/utils/inputValue.vue"


import {reactive,onMounted,computed,toRaw} from "vue"
import { useRouter,useRoute} from "vue-router";
import {useRouteStore} from "@/pinia/modules/route";
import {useAxiosStore} from "@/pinia/modules/axios";
import issuePng from "@/assets/images/arrow_right2.png"
import redeemPng from "@/assets/images/arrow_left.png"
import { BigNumber, ethers } from "ethers";
import {getWalletBalanceApi} from "@/api/utils"
import {balanceOf} from "@/callData/multiCall/token"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"


const asiosStore= useAxiosStore()
const routeStore=useRouteStore()
const router=useRouter()
const route=useRoute()
const data=reactive({
    optionNumber:"0",
    isOpen:false,
    tokenInfo:{},
    typePng:issuePng,
    type:"issue",
    walletBalanceValue:"0",
    vaultBalanceValue:"0",
    isMax:false
})

onMounted(async ()=>{
    data.tokenInfo=JSON.parse(sessionStorage.getItem("assetTranferData")||"{}") 
    if(route.query.type=="issue"){
      data.typePng=issuePng
      data.type="issue"
    }else{
       data.typePng=redeemPng  
       data.type="redeem"
    }
    await handleBalance()
})
// -------------计算属性----------------
var walletBalance=computed(()=>{
    if(data.walletBalanceValue=="0"){
        return 0
    }
    let value=BigNumber.from(data.walletBalanceValue).div(ethers.utils.parseUnits("1",data.tokenInfo.decimals-2)) 
    return (value.toNumber()/100).toFixed(2)
})
var vaultBalance=computed(()=>{
    if(data.vaultBalanceValue=="0"){
        return 0
    }
    let value=BigNumber.from(data.vaultBalanceValue).div(ethers.utils.parseUnits("1",data.tokenInfo.decimals-2)) 
    return (value.toNumber()/100).toFixed(2)
})
//---------------方法-------------------
var transferTx=()=>{
     data.isOpen=true
}

var switchType=()=>{
    if(data.type=="issue"){
        data.typePng=redeemPng
        data.type="redeem"
    }else{
        data.typePng=issuePng
        data.type="issue"       
    }
    data.isMax=true
}

var inputMax=()=>{
    if(data.type=="issue"){
        data.optionNumber=walletBalance.value
    }else{
        data.optionNumber=vaultBalance.value
    }

}

var inputNomal=(value)=>{
    // 如果接近99% 则视为100% 为最大max
    if(data.type=="issue"){
        console.log(Number(data.optionNumber*100) / Number(walletBalance.value) ,99,data.optionNumber*100,walletBalance.value)
        if(Number(data.optionNumber*100) / Number(walletBalance.value) >99){
            data.optionNumber=walletBalance.value
            data.isMax=true
        }
    }else{
        if(Number(data.optionNumber*100) / Number(vaultBalance.value) >99){
            data.optionNumber=vaultBalance.value
            data.isMax=true
        }
    }
    console.log(data.isMax,data.optionNumber)
}
//-------------请求-------------------
var handleBalance=async ()=>{
    let walletBalance=BigNumber.from("0")
    let vaultBalance=BigNumber.from("0")
     if(data.tokenInfo.isGasToken){
         walletBalance= await getWalletBalanceApi(asiosStore.currentAccount)
         vaultBalance=await getWalletBalanceApi(data.tokenInfo.vault)    
         walletBalance=walletBalance.message  
         vaultBalance=vaultBalance.message  
     }else{
       let multiCallData=[]
       let walletBalanceCallData= balanceOf("wallet",data.tokenInfo.address,asiosStore.currentAccount)
       let vaultBalanceCallData=  balanceOf("vault",data.tokenInfo.address,data.tokenInfo.vault)
       multiCallData=[walletBalanceCallData,vaultBalanceCallData]
       let multiCallResponse=  await multiCallObjR(multiCallData)
       console.log(multiCallResponse,"multiCallResponse")
       walletBalance=multiCallResponse["wallet"].balance
       vaultBalance=multiCallResponse["vault"].balance
     }
     data.walletBalanceValue=walletBalance
     data.vaultBalanceValue=vaultBalance
}
</script>
<style lang="less" scoped>
.assetsTransfer{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding:72px 16px 0px;
    box-sizing: border-box;
    .option{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        margin-bottom: 8px;
        .left{
          width: 49%;
          background-color: var(--bg-color-secondarycontainer);
          display: flex;
          flex-direction: column;
          padding: 16px;
          box-sizing: border-box;
          border-radius: 8px;
          .info{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 6px;
            .icon{
               width: 16px;
               height: 16px;
               margin-right: 4px;
            }
            .title{
               color: var(--text-color-primary);
               font-size: 16px;
               font-weight: 600;
            }
          }
          .balance{
             color: var(--text-color-second);
             font-size: 14px;
             margin-bottom: 4px;
          }
          .text{
             font-size: 14px;
             color: var( --text-color-primary);
             margin-bottom: 2px;
          }
        }
        .middle{
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border:4px solid var(--bg-color-page);
          position: absolute;
          background: var(--bg-color-secondarycontainer);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .icon{
            width: 24px;
            height: 24px;
          }
        }
        .right{
          width: 49%;
          background-color: var(--bg-color-secondarycontainer);
          display: flex;
          flex-direction: column;
          padding: 16px;
          box-sizing: border-box;
          border-radius: 8px;
          align-items: flex-end;
          .info{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 6px;
            .icon{
               width: 16px;
               height: 16px;
               margin-left: 4px;
            }
            .title{
               color: var(--text-color-primary);
               font-size: 16px;
               font-weight: 600;
            }
          }
          .balance{
             color: var(--text-color-second);
             font-size: 14px;
             margin-bottom: 4px;
          }
          .text{
             font-size: 14px;
             color: var( --text-color-primary);
             margin-bottom: 2px;
          }
        }
    }
    // 数字输入框区域
    .input-content{
        margin-top: 8px;
        background-color: var(--bg-color-secondarycontainer);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        .input-row{
            display: flex;
            justify-content: space-between;
            font-size: 36px;
            .input{
                font-size: 36px;
                margin-left: -11px;
            }
            :deep(.ant-input-affix-wrapper){
                padding-left: 0;
            }
            .token{
                padding-left: 8px;
                line-height: 64px;
            }
        }
        .limit-row{
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--text-color-second);
            .max-btn{
                background-color: var(--bg-color-page);
                font-size: 14px;
                padding: 4px 12px;
                display: inline-block;
                border-radius: 16px;
                font-weight: bold;
                color: var(--text-color-primary);
                margin-left: 4px;
            }
        }
     }
     .cost{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 17px;
        margin-top: 16px;
        .left{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
            .text{
                color: var( --text-color-second);
                font-size: 14px;
            }
        }
        .right{
            font-size: 14px;
            color: var(--text-color-primary);
        }
     }
     .btn{
        width: 100%;
        height: 48px;
        text-align: center;
        line-height: 48px;
        color: var(--text-color-active);
        background-color: var( --bg-color-container-active);
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
     }
}

</style>