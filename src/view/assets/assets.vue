<template>
    <div class="assets">
        <assetHeader :address="axiosStore.currentAccount"></assetHeader>
        <div class="total-info">
              <p class="infop1">
                  <span class="title">Total Asset</span>
                  <span class="text">${{ data.totalAsset}}</span>
              </p>  
              <p class="infop2">
                  <span class="title">Wallet</span>
                  <span class="text">${{ data.totalWallet }}</span>
              </p>
              <p  class="infop2">
                  <span class="title">JVault</span>
                  <span class="text">${{ data.totalVault }}</span>
              </p>
        </div>
        <div class="contains" v-if="data.tokenList.length>0">
           <assetOption   :tokenInfo="item" v-for="(item,index) in data.tokenList" :key="index" :issueMode="data.issueMode"></assetOption>  
       
        </div>
        <writeOptionEmpty :isSignal="3" :text="`wallet is not connect`" class="empty" v-else ></writeOptionEmpty>

    </div>


    <a-spin v-if="data.loading" class="aSpin" tip="Loading..." :delay="50"> </a-spin>
</template>
<script setup>
import assetHeader from "@/components/assets/assetHeader.vue"
import assetOption from "@/components/assets/assetOption.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import {reactive,onMounted,watch,computed} from "vue"
import {useAxiosStore} from "@/pinia/modules/axios";
import {getVaultApi} from "@/api/vaultFactory"
import { BigNumber, ethers } from "ethers";
import {getVaultAllPosition} from "@/callData/multiCall/manager"
// import {getAssetTypeCount} from "@/callData/multiCall/platformFacet"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import {balanceOf} from "@/callData/multiCall/token"
import {getWalletBalanceApi} from "@/api/utils"
import {getPrice} from "@/callData/multiCall/priceOracle"
import {getIssueMode} from "@/callData/multiCall/IssuanceFacet"
import {getPriceByPriceOracleApi,getPriceByServiceApi} from "@/api/priceOracle"
const axiosStore= useAxiosStore()
const data=reactive({
     tokenList:[],
     totalAsset:0,
     totalWallet:0,
     totalVault:0,
     issueMode:0,
     //----
     loading:false
})
// 生命周期
onMounted(async ()=>{
   await init()

})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})


var init=async ()=>{
   if(axiosStore.isConnect==1){
      return
   }
   data.loading=true
   //处理币种信息
   await hanleToken()
   //请求处理页面
   await handleBalance()
   //获取价格
   // await handlePrice()
   await handlePriceByService()
   //计算总价值
   await handleValue()
   data.loading=false
   console.log("tokenList",data.tokenList)
}



//----------------相关初始数据处理-----------------------
//计算总价值
var handleValue= async ()=>{
   let totalAsset=BigNumber.from("0");
   let totalWallet=BigNumber.from("0");
   let totalVault=BigNumber.from("0");
   data?.tokenList?.forEach(item=>{
      let valueWallet= item.tokenPrice.mul(item.walletBalance).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",item.decimals))
      totalWallet=valueWallet.add(totalWallet)
      let valueVault= item.tokenPrice.mul(item.vaultBalance).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",item.decimals))
      totalVault=valueVault.add(totalVault)
   })
   totalAsset=totalAsset.add(totalWallet.add(totalVault))
   data.totalAsset=(totalAsset.toNumber()/100).toFixed(2)
   data.totalWallet=(totalWallet.toNumber()/100).toFixed(2)
   data.totalVault=(totalVault.toNumber()/100).toFixed(2)

}


// 处理tokenList 列表
var hanleToken=async ()=>{
   let tokenList=[]
   axiosStore?.currentTokens?.forEach(item=>{
        if(item.isShowAsset && item.isAble){
           let obj=JSON.parse(JSON.stringify(item))
           obj.vault=ethers.constants.AddressZero
           obj.salt=BigNumber.from("0")
           obj.walletBalance=BigNumber.from("0")
           obj.vaultBalance= BigNumber.from("0")
           obj.tokenPrice=BigNumber.from("0")
           tokenList.push(obj)
        }
   })
   data.tokenList=tokenList
}

//处理余额问题
var handleBalance=async ()=>{
   //处理余额  获取0号vault
   let vault= await getVaultApi(axiosStore.currentAccount,axiosStore.vaultSalt)
   vault=vault?.message?.vault ||  new Error("vault error")
   console.log(vault,"当前vault")

   //multicall数据
   let multiCallData=[]
   //获取vault申购模式
   let issueModeCallData=getIssueMode("getIssueMode",vault)
   multiCallData.push(issueModeCallData)
   //获取vault仓位
   let positions=[1,2,3,4,5,6,7,8,9,10]
   let vaultCallData= getVaultAllPosition("getVaultAllPosition",vault,positions)
   multiCallData.push(vaultCallData)
   //获取钱包余额 
   data?.tokenList.forEach(async item=>{
      if(!item.isGasToken){
         //处理是代币的情况
         let balanceOfData=balanceOf(item.name,item.address,axiosStore.currentAccount)
         multiCallData.push(balanceOfData)  
      }else{
         //处理钱包余额是gas币的情况
         let response=await getWalletBalanceApi(axiosStore.currentAccount)
         //保留两位小数
         item.walletBalance=response?.message || BigNumber.from("0")
      
      }    
   })
   //请求
  let multiCallResponse= await multiCallObjR(multiCallData)
   console.log("multiCallResponse",multiCallResponse)
   //处理vault地址
   data?.tokenList.forEach(item=>{
       item.vault=vault
       item.salt=BigNumber.from("0")
   })
   //处理申购模式
   data.issueMode=multiCallResponse["getIssueMode"]?.issueMode || 0 

   //处理钱包token余额
   data?.tokenList.forEach(item=>{
      if(!item.isGasToken){
         item.walletBalance=multiCallResponse[item.name]?.balance || BigNumber.from("0")
      }   
   })
   //处理vault余额
   let vaultPosition=multiCallResponse["getVaultAllPosition"].positions || []
   data?.tokenList.forEach(item=>{
        for(let i=0;i<vaultPosition.length;i++){
          if(item.address.toLowerCase() == vaultPosition[i].component.toLowerCase()){
               item.vaultBalance= vaultPosition[i].balance || BigNumber.from("0")
          }
        } 
   })

}


// 处理价格问题
var handlePrice=async ()=>{
   //multicall数据
   let multiCallData=[]
   data?.tokenList?.forEach(item=>{
      let getPriceData=getPrice(item.name,item.address,axiosStore.remark.usdToken)
      multiCallData.push(getPriceData) 
   })

   let multiCallResponse= await multiCallObjR(multiCallData)
   data?.tokenList?.forEach(item=>{
       item.tokenPrice=multiCallResponse[item.name]?.price || BigNumber.from(0)
   })
   console.log("getPrice",multiCallResponse)
}


var handlePriceByService=async ()=>{
     let tokenAddrList=[]
     data?.tokenList?.forEach(item=>{
      tokenAddrList.push(item.address)
     })
     let priceList= await getPriceByServiceApi(axiosStore.chainId,"","",tokenAddrList) 
     priceList=priceList?.data?.token_list||[]
     data?.tokenList?.forEach((item,index)=>{
        item.tokenPrice=BigNumber.from(priceList[index] )  || BigNumber.from("0")   
     })

}
</script>
<style lang="less" scoped>
   .assets{
      width: 100%;
      padding-top:56px;
      padding-bottom: 50px;
      box-sizing: border-box;
      height: 100%;
      .total-info{
          width: 100%;
          padding: 24px 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          .infop1{
             display: flex;
             flex-direction: column;
             .title{
                color: var(--text-color-primary);
                font-size: 14px;
                margin-bottom: 8px;
             }
             .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
             }
          }
          .infop2{
             display: flex;
             flex-direction: column;
             align-items: flex-end;
             .title{
                color: var(--text-color-primary);
                font-size: 14px;
                margin-bottom: 8px;
             }
             .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
             }        
          }
      }
      .contains{
         width: 100%;
         height: 100%;
         overflow-y:auto ;
         padding-bottom: 233px;
         box-sizing: border-box;  
      }
   }
   .empty{
        width: 100%;
        height: auto;
        margin-top: 50%;
        transform: translateY(-50%);
      }

</style>