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
        <inputValue 
            v-model:value="data.optionNumber"
            :isApproximate="true"
            :maxValue="data.type=='issue'? data.walletBalanceValue : data.vaultBalanceValue"
            :symbol="data.tokenInfo.name" 
            :decimals="data.tokenInfo.decimals"
            :decimalsShow="data.tokenInfo.decimalsShow"
            :valueChange="data.optionNumberChange"
        >
    </inputValue>
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
        <assetTranfer  
        v-model:isOpen="data.isOpen" 
        :tokenInfo="data.tokenInfo" 
        :type="data.type" 
        :hash="data.txHash" 
        :amount="data.optionNumber" 
        :decimals="data.tokenInfo.decimals"
        :txResult="data.txResult">
        </assetTranfer>
        <singlestepLoading 
            v-model:isOpen="data.transferLoadingData.open"
            :status="data.transferLoadingData.status"
            :hash="data.transferLoadingData.hash"
            :nextPage="data.transferLoadingData.nextPage"
            :transferName="data.transferLoadingData.transferName"
        ></singlestepLoading>
    </div>
    <a-spin v-if="data.loading" class="aSpin" tip="Loading..."  :delay="50"> </a-spin>
</template>
<script setup>
import navigationBar from "@/components/utils/navigationBar.vue"
import assetTranfer from "@/components/assets/assetTranfer.vue"
import inputValue from "@/components/utils/inputValue.vue"
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
import {issue,redeem} from "@/callData/bundler/issuanceModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {allownoceApi,approveApi,transferEthApi} from "@/api/token"
import {createVaultService} from "@/apiHandle/vault"
import { message } from 'ant-design-vue';
import singlestepLoading from "@/components/utils/singlestepLoading.vue"
import {getVaultApi} from "@/api/vaultFactory"
import {getIssueMode} from "@/callData/multiCall/IssuanceFacet"
import { issueApi } from "@/api/issuanceModule";

const axiosStore= useAxiosStore()
const routeStore=useRouteStore()
const router=useRouter()
const route=useRoute()
const data=reactive({
    optionNumber:BigNumber.from("0"),
    optionNumberChange: BigNumber.from("0"),
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
    issueMode:0,
    loading:false,
    transferLoadingData: {
        open: false,
        status: "pending",
        hash: "",
        nextPage: {
            path: "/asset",
            query: {},
            name: "my asset"
        },
        transferName: "Transfer in progress"
    }
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

var switchType=()=>{
    if(data.type=="issue"){
        data.typePng=redeemPng
        data.type="redeem"
    }else{
        data.typePng=issuePng
        data.type="issue"       
    }
    data.optionNumber=BigNumber.from("0")

}
//--------------初始化相关-------------------
onMounted(async ()=>{
    let vault= await getVaultApi(axiosStore.currentAccount,axiosStore.vaultSalt)
    vault=vault?.message?.vault ||  new Error("vault error")
    data.tokenInfo=axiosStore.getTokenByAddress(route.query.asset)
    data.tokenInfo["vault"]=vault
    data.tokenInfo["salt"]=axiosStore.vaultSalt
    console.log("tokenInfo",data.tokenInfo)
    if(route.query.type=="issue"){
      data.typePng=issuePng
      data.type="issue"
    }else{
       data.typePng=redeemPng  
       data.type="redeem"
    }
    if(route.query.amount){
        data.optionNumberChange = BigNumber.from(route.query.amount);
    }
    if(route.query.callBackId && route.query.callBackName && route.query.callBackRawAmount){
        console.log(route.query);
        data.transferLoadingData.nextPage.path = `/${route.query.callBackName}`;
        data.transferLoadingData.nextPage.query = {
            id: route.query.callBackId,
            amount: route.query.callBackRawAmount
        }
        data.transferLoadingData.nextPage.name = route.query.callBackName;

    }
    // data.issueMode=route.query.issueMode
    let multiCallData = [];
    let issueModeCallData=getIssueMode("getIssueMode",vault);
    multiCallData.push(issueModeCallData);
    //请求
    let multiCallResponse= await multiCallObjR(multiCallData)
    data.issueMode = multiCallResponse["getIssueMode"]?.issueMode || 0;
    
    await handleBalance()
})
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
    //请求处理页面
   await handleBalance()
})

//处理余额
var handleBalance=async ()=>{
    if(axiosStore.isConnect==1){
       return
    }
    data.loading=true
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
     data.loading=false

     console.log("余额", data.walletBalanceValue, data.vaultBalanceValue)
}
//------上链业务处理----------

var transferTx=async ()=>{
    console.log(data.optionNumber,"optionNumber")
    
    if( data.issueMode>=2 && data.type=="issue"){
        message.warning("issue mode error")
        // console.log("申购错误")
        return
    }
   
    if(data.optionNumber.eq(BigNumber.from("0"))){
        message.warning("please input")
        return
    }
    if(axiosStore.isConnect==1){
       return
    }
    console.log("进入页面尝试")
    // data.isOpen=true
    await sendTx()
}

var sendTx=async ()=>{
    data.transferLoadingData.open = true;
    data.transferLoadingData.status = "pending";
    //添加按钮锁
    if(data.btnLock){
        return
    }
     data.btnLock=true
     
     if(data.tokenInfo.isGasToken && data.type=="issue"){
        //申购eth
        await issueEthTx()
     }else if(!data.tokenInfo.isGasToken && data.type=="issue"){
        //申购token
         txStatus=  await issueTokenTx()
     }else{
        //赎回
        await redeemTx()
     }
}
//------gas币流程----
//申购eth
var issueEthTx=async ()=>{
    let vault=data.tokenInfo.vault
    let salt=BigNumber.from(data.tokenInfo.salt) 
    // 组装交易
    let codeRespose= await getContractCodeApi(vault)
    //未创建vault  就去创建vault
    let ops=[]
    if(codeRespose.message == "0x" ){
        console.log("进入初始化")
       let initCallData=createVaultService(vault)
       ops=ops.concat(initCallData)
       let bundlerHash= await sendTxToBundler(vault,salt,ops)
       await bundlerResultTx(bundlerHash)
    }
    //申购eth
    let issueHash=  await issueApi(vault,axiosStore.currentAccount,[data.tokenInfo.address],[data.optionNumber],data.optionNumber)
    console.log("issueHash",issueHash)
}

//申购token
var issueTokenTx=async ()=>{
    let vault=data.tokenInfo.vault
    let salt=BigNumber.from(data.tokenInfo.salt) 
    //授权交易
    let approveStatus= await approveTx(data.tokenInfo.address,vault,data.optionNumber)
    //起弹窗
    if(!approveStatus){
        message.error("approve fail");
        data.transferLoadingData.status = "faild";
        data.btnLock=false
        return
    }
    // 组装交易
    let codeRespose= await getContractCodeApi(vault)
    //未创建vault  就去创建vault
    let ops=[]
    if(codeRespose.message == "0x" ){
        console.log("进入初始化")
       let initCallData=createVaultService(vault)
       ops=ops.concat(initCallData)
    }
    //申购交易组装
    let issueCallData= issue(vault,axiosStore.currentAccount,[data.tokenInfo.address],[data.optionNumber])
    ops.push(issueCallData)
    let bundlerHash= await sendTxToBundler(vault,salt,ops)
    //处理交易状态
    await bundlerResultTx(bundlerHash)
}

//授权20币
var approveTx=async(token,vault,amount)=>{
    let allownoceResponse= await allownoceApi(token,axiosStore.currentAccount,vault)
    allownoceResponse=allownoceResponse?.message?.allowance || BigNumber.from("0")
    console.log(allownoceResponse,amount,"对比")
    if(allownoceResponse.lt(amount)){
      let apprvoeResponse=await  approveApi(token,vault,amount)
      console.log("apprvoeResponse",apprvoeResponse)
      return apprvoeResponse.status
    }
    return true
}

//------赎回操作-----------------
var redeemTx=async ()=>{
    let vault=data.tokenInfo.vault
    let salt=BigNumber.from(data.tokenInfo.salt) 
    // 组装交易
    let codeRespose= await getContractCodeApi(vault)
    //未创建vault  就去创建vault
    let ops=[]
    if(codeRespose.message == "0x" ){
        console.log("进入初始化")
       let initCallData=createVaultService(vault)
       ops=ops.concat(initCallData)
       
    }
    let redeemCallData= redeem(vault,axiosStore.currentAccount,[data.tokenInfo.type],[data.tokenInfo.address],[data.optionNumber])
    ops.push(redeemCallData)
    let bundlerHash= await sendTxToBundler(vault,salt,ops)
    //处理交易状态
    await bundlerResultTx(bundlerHash)
}


//bundler交易状态处理
var bundlerResultTx=async (bundlerHash)=>{
    //接触按钮锁
    if(!bundlerHash.status){
        data.btnLock=false
        data.transferLoadingData.hash = "";
        data.transferLoadingData.status = "faild";
        return
    }
    //起弹窗
    data.txHash=bundlerHash.hash
    // data.isOpen=true
    data.transferLoadingData.open = true
    data.transferLoadingData.status = "pending";
    //等待交易结果
    let result=  await getBundlerTxResult(bundlerHash.hash);
    // data.txResult=result
   
    if(!result.status){
        data.btnLock=false;
        data.transferLoadingData.status = "faild";
       data.transferLoadingData.hash = result.message;
        return
    }
    data.btnLock=false
    data.transferLoadingData.status = "success";
    data.transferLoadingData.hash = result.message;
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
        margin-top: 16px;
     }
}

</style>