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
        <div class="input-content">
            <div class="input-row">
                <input-number @input="inputNomal" class="input" v-model:value="data.optionNumber"></input-number>
                <div class="token">{{data.tokenInfo.name}}</div>
            </div>
            <div class="limit-row">
                <!-- <div>$3000</div> -->
                <div></div>
                <div>
                    <!-- <span>
                        <span>0.0001</span>
                        <span>-</span>
                        <span>10</span>
                    </span> -->
                    <span>
                        <div @click="inputMax" class="max-btn">Max</div>
                    </span>
                </div>
            </div>        
        </div>
        <!--  -->
        <!-- <div class="cost">
            <p class="left">
                <img class="icon" src="@/assets/images/cost.png" alt="">
                <span class="text">Network Cost</span>
            </p>
            <span class="right">0.002Eth</span>
        </div> -->
        <!--  -->
        <span class="btn" @click="transferTx">Transfer</span>
        <!--  -->
        <assetTranfer  v-model:isOpen="data.isOpen" :tokenInfo="data.tokenInfo" :type="data.type" :hash="data.txHash" :amount="data.optionNumber" :txResult="data.txResult">
        </assetTranfer>
    </div>
</template>
<script setup>
import navigationBar from "@/components/utils/navigationBar.vue"
import inputNumber from "@/components/utils/inputNumber.vue"
import assetTranfer from "@/components/assets/assetTranfer.vue"
import inputValue from "@/components/utils/inputNumber.vue"
import {reactive,onMounted,computed,watch,nextTick} from "vue"
import { useRouter,useRoute} from "vue-router";
import {useRouteStore} from "@/pinia/modules/route";
import {useAxiosStore} from "@/pinia/modules/axios";
import issuePng from "@/assets/images/arrow_right2.png"
import redeemPng from "@/assets/images/arrow_left.png"
import { BigNumber, ethers } from "ethers";
import {getWalletBalanceApi,getContractCodeApi} from "@/api/utils"
import {balanceOf} from "@/callData/multiCall/token"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import {setVaultModule,setVaultMasterToken,setVaultTokens} from "@/callData/bundler/vaultManageModule"
import {issue,redeem} from "@/callData/bundler/issuanceModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {allownoceApi,approveApi,transferEthApi} from "@/api/token"


const axiosStore= useAxiosStore()
const routeStore=useRouteStore()
const router=useRouter()
const route=useRoute()
const data=reactive({
    optionNumber:"",
    isOpen:false,
    tokenInfo:{},
    typePng:issuePng,
    type:"issue",
    walletBalanceValue:BigNumber.from("0"),
    vaultBalanceValue:BigNumber.from("0"),
    isMax:false,
    txHash:"",
    txResult:{},
    //----状态锁-----
    btnLock:false,
    issueMode:0
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
    data.issueMode=route.query.issueMode
    await handleBalance()
})
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
    //请求处理页面
   await handleBalance()
})


// -------------计算属性----------------
var walletBalance=computed(()=>{
    if(data.walletBalanceValue.eq(BigNumber.from("0"))){
        return 0
    }
    let value=BigNumber.from(data.walletBalanceValue).div(ethers.utils.parseUnits("1",data.tokenInfo.decimals-2)) 
    return (value.toNumber()/100).toFixed(2)
})
var vaultBalance=computed(()=>{
    if(data.vaultBalanceValue.eq(BigNumber.from("0"))){
        return 0
    }
    let value=BigNumber.from(data.vaultBalanceValue).div(ethers.utils.parseUnits("1",data.tokenInfo.decimals-2)) 
    return (value.toNumber()/100).toFixed(2)
})
//---------------方法-------------------
var transferTx=async ()=>{
    if( data.issueMode>=2 && data.type=="issue"){
        console.log("申购错误")
        return
    }
    data.isOpen=true
    if(data.optionNumber==0){
        return
    }
    if(axiosStore.isConnect==1){
       return
    }
    await sendTx()
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
var inputNomal=async (value)=>{
    // 如果接近99% 则视为100% 为最大max
    if(data.type=="issue"){
        console.log(Number(data.optionNumber*100) / Number(walletBalance.value) ,99,data.optionNumber*100,walletBalance.value)
        if(Number(data.optionNumber*100) / Number(walletBalance.value) >99){
            await nextTick()
            //去除末尾0
            data.optionNumber= walletBalance.value.replace(/0+$/, '')
            data.isMax=true
        }
    }else{
        if(Number(data.optionNumber*100) / Number(vaultBalance.value) >99){
            await nextTick()
            //去除末尾0
            data.optionNumber= walletBalance.value.replace(/0+$/, '')
            data.isMax=true
        }
    }
    console.log(data.isMax,data.optionNumber)
}



//-------------请求-------------------
//燃气费

//处理余额
var handleBalance=async ()=>{
    if(axiosStore.isConnect==1){
       return
    }
    let walletBalance=BigNumber.from("0")
    let vaultBalance=BigNumber.from("0")
     if(data.tokenInfo.isGasToken){
         walletBalance= await getWalletBalanceApi(axiosStore.currentAccount)
         vaultBalance=await getWalletBalanceApi(data.tokenInfo.vault)    
         walletBalance=walletBalance.message  
         vaultBalance=vaultBalance.message  
     }else{
       let multiCallData=[]
       let walletBalanceCallData= balanceOf("wallet",data.tokenInfo.address,axiosStore.currentAccount)
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
//------上链请求----------
var sendTx=async ()=>{
    let transferAmount
    let token=data.tokenInfo.address
    let vault=data.tokenInfo.vault
    let salt=BigNumber.from(data.tokenInfo.salt) 
    let decimals=data.tokenInfo.decimals
    if(data.type=="issue"){
       if(data.isMax){
         transferAmount=data.walletBalanceValue
       }else{
         transferAmount=ethers.utils.parseUnits(`${data.optionNumber}`,decimals)
       }
    }else{
       if(data.isMax){
        //  transferAmount=data.vaultBalanceValue
        transferAmount=BigNumber.from("0")  //赎回是0的情况 全赎回
       }else{
         transferAmount=ethers.utils.parseUnits(`${data.optionNumber}`,decimals)
       }
    }
    console.log(transferAmount,"transferAmount--") 
    //添加按钮锁
    if(data.btnLock){
        return
    }
    data.btnLock=true
    //授权交易
    await approveTx(data.tokenInfo.isGasToken,token,vault,transferAmount)
    // 组装交易
    let codeRespose= await getContractCodeApi(vault)
    //未创建vault
    let ops=[]
    if(codeRespose.message == "0x" ){
        console.log("进入初始化")
       let initCallData=vaultInitCallData(vault)
       ops=ops.concat(initCallData)
    }
    //申购方法
    ops=ops.concat(issueAndRedeemCallData(data.tokenInfo.isGasToken,data.type,vault,token,transferAmount,data.tokenInfo.type))  
    console.log(vault,salt,ops)
    let bundlerHash= await sendTxToBundler(vault,salt,ops)
    console.log("bundlerHash",bundlerHash)
    //接触按钮锁
    if(!bundlerHash.status){
        data.btnLock=false
        return
    }
    //起弹窗
    data.txHash=bundlerHash.hash
    data.isOpen=true
    //等待交易结果
    let result=  await getBundlerTxResult(bundlerHash.hash)
    data.txResult=result
    console.log(result)
    if(result.status){
        data.btnLock=false
        return
    }


}

//授权交易
var approveTx=async(isGasToken,token,vault,amount)=>{
    //如果是gas币的情况下
    if(isGasToken){
        let apprvoeResponse=await transferEthApi(vault,amount)
        console.log("apprvoeResponse",apprvoeResponse)
        return 
    }
    let allownoceResponse= await allownoceApi(token,axiosStore.currentAccount,vault)
    allownoceResponse=allownoceResponse?.message?.allowance || BigNumber.from("0")
    console.log(allownoceResponse,amount,"对比")
    if(allownoceResponse.lt(amount)){
      let apprvoeResponse=await  approveApi(token,vault,amount)
      console.log("apprvoeResponse",apprvoeResponse)
    }
}

//-----ops拼装---
//vault初始化
var vaultInitCallData=(vault) =>{
    //组装白名单module
    let modles=[
        axiosStore.currentContractData["VaultManageModule"],
        axiosStore.currentContractData["VaultPaymaster"],
        axiosStore.currentContractData["IssuanceModule"],
        axiosStore.currentContractData["OptionModule"],
        axiosStore.currentContractData["OptionService"],
        axiosStore.currentContractData["PriceOracle"]
    ]
    let status=[true,true,true,true,true,true]
    let moduleCallData= setVaultModule(vault,modles,status)

    //组装vault白名单
    let tokenList=[]
    let typeList=[]
    axiosStore?.currentTokens?.forEach(item=>{
        tokenList.push(item.address)
        typeList.push(item.type)
    })
    let tokenCallData= setVaultTokens(vault,tokenList,typeList)
    // 设置masterToken
    let masterTokenCallData= setVaultMasterToken(vault,axiosStore.remark.masterToken)

    return [moduleCallData,tokenCallData,masterTokenCallData]
}
//申购
var issueAndRedeemCallData= (isGasToken,type,vault,asset,amount,assetType)=>{
    if(type=="issue"){
        //如果是当前币种是gas币 则只做记录仓位使用
        if(isGasToken){
            amount=BigNumber.from("0")
        }
       let issueCallData= issue(vault,axiosStore.currentAccount,[asset],[amount])
       return [issueCallData]
    }else{
        let redeemCallData= redeem(vault,axiosStore.currentAccount,[assetType],[asset],[amount])
        return [redeemCallData]
    }
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