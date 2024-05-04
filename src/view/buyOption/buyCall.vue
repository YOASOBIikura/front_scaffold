<template>
    <navigation-bar title="Buy Call Options"></navigation-bar>
    <div class="buyOption">
        <!-- 标题 -->
        <div class="header-content">
            <div class="title">Buy {{data.currentUnderlyingAsset.name}} Call</div>
            <div class="token-content">
                <img :src="data.currentUnderlyingAsset.img" class="token"/>
                <img :src="data.currentStrikeAsset.img" class="token"/>
                <div class="ticket"></div>
            </div>
        </div>
        <!-- 价格变动 --> 
        <div class="price-change-content">
            <div>
                <img src="@/assets/images/price-up.png" class="img"/>
            </div>
            <div class="price up">
                ${{data.remarkInfo.strikePrice}}
            </div>
        </div>
        <!-- 日期显示 -->
        <div class="date-content">
            <img src="@/assets/images/date-icon.png" class="date-img"/>
            <div>
                <span>{{data.remarkInfo.optionDate}}</span>
                <span>·</span>
                <span>{{dateShow}}</span>
            </div>
        </div>
        <!-- 数字输入框 -->

        <inputValue 
        v-model:value="data.underlyingAmount" 
        :isApproximate="true"
        :maxValue="data.underlyingAssetBalance"
        :symbol="data.currentUnderlyingAsset.name" 
        :decimals="data.currentUnderlyingAsset.decimals"
        @input="inputChange"   
        @inputMax="maxChange"
        >
             <div class="slotBalance">
                 <span></span>
                 <span>{{underlyingAssetBalance}}</span>
             </div>
        </inputValue>

        <!-- 支付币种选择 -->
        <div class="underly-assets-content">
            <div class="title-row">
                <div class="title">Pay Premium With</div>
                <!-- <div class="info">
                    <span>Premium per ETH </span>
                    <span>$10</span>
                </div> -->
            </div>
            <div class="select-content">
                <div @click="selectPremium(item)" :class="item.select?'item active':'item'" v-for="(item,index) in data.premiumAssetList" :key="index">
                    <div class="token">
                        <img :src="item.img" />
                        <span>{{ item.premium }}{{item.name}}</span>
                    </div>
                    <div class="balance">
                        Balance:{{item.balanceShow}}
                    </div>
                </div>
            </div>
        </div>
        <!-- 详细数据 -->
       <div class="option-details">
            <div class="collapse-title" @click="data.detailCollapse = !data.detailCollapse">
                    <span>
                        Details 
                        <img src="@/assets/images/arrow_open.png" v-if="data.detailCollapse"/>
                        <img src="@/assets/images/arrow_close.png" v-else/>
                    </span>
            </div>

            <div v-if="data.detailCollapse">
                <details-info 
                :dataInfo="data.detailsInfoData" 
                :marketPrice="data.currentUnderlyingPrice">
            </details-info>
                <description 
                :orderType="'Call'"
                :asset="data.currentUnderlyingAsset" 
                :premiumAsset="data.currentPremiumAsset"
                :underlyingAmount="data.underlyingAmount"        
                 ></description>
                <settlement 
                :orderType="'call'"
                :asset="data.currentUnderlyingAsset" 
                :strikePrice="data.remarkInfo.strikePrice"
                :marketPrice="data.currentUnderlyingPrice"
                ></settlement>
                <repay-type 
                 :asset="data.currentUnderlyingAsset" 
                 :underlyingAmount="data.underlyingAmount"        
                 :strikeAsset="data.currentStrikeAsset"
                 :strikeAmount="data.cuurentStrikeAmount"
                ></repay-type>          
            </div>
       </div>
    </div>
        <!-- 支付按钮区域 -->
    <div class="pay-btn-content">
        <a-button 
            type="primary"
            class="pay-btn"
            @click="buyCall"
            >Pay {{ data.currentPremiumAsset.premium }} {{data.currentPremiumAsset.name}}</a-button>
    </div>

     <singlestepLoading
        v-model:isOpen="data.transferLoadingData.open"
        :status="data.transferLoadingData.status"
        :hash="data.transferLoadingData.hash"
        :nextPage="data.transferLoadingData.nextPage"
        :transferName="data.transferLoadingData.transferName"
     ></singlestepLoading>
    
</template>

<script setup>

import description from "@/components/buyOption/description.vue";
import settlement from "@/components/buyOption/settlement.vue";
import repayType from "@/components/buyOption/repayType.vue";
import detailsInfo from "@/components/buyOption/detailsInfo.vue";
import singlestepLoading from "@/components/utils/singlestepLoading.vue"

import { BigNumber,ethers } from "ethers";
import { reactive,onMounted,watch,computed,toRaw} from "vue"
import inputValue from "@/components/utils/inputValue.vue"
import navigationBar from "@/components/utils/navigationBar.vue";
import {createVaultService,getMulVaultR} from "@/apiHandle/vault"
import {useAxiosStore} from "@/pinia/modules/axios"
import {issue} from "@/callData/bundler/issuanceModule"
import {submitOptionOrder} from "@/callData/bundler/optionModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {getOrderApi} from "@/api/protfolio"
import { useRouter,useRoute} from "vue-router";
import { message } from 'ant-design-vue';
import {getPriceByPriceOracleApi} from "@/api/priceOracle"
import {getMulTokenBalance} from "@/apiHandle/token"
import {setVaultType} from "@/callData/bundler/vaultManageModule"
import {getVaultApi} from "@/api/vaultFactory"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import {getSigatureLock,getUnderlyTotal} from "@/callData/multiCall/optionFacet"
const route=useRoute()
const router=useRouter()
const axiosStore=useAxiosStore()
const data = reactive({
    detailCollapse:true,
    currentUnderlyingAsset:{},
    premiumAssetList:[],
    currentPremiumAsset:{},//当前的行权资产
    currentStrikeAsset:{},//当前行权资产
    currentUnderlyingPrice:"0",//当前抵押资产价格
    cuurentStrikeAmount:BigNumber.from("0"),
    signatureInfo:{}, //签名源信息
    signature:"",//签名信息
    remarkInfo:{},//补充信息  
    //-----
    underlyingAmount: BigNumber.from("0"), //抵押数量
    underlyingAssetBalance:BigNumber.from("0"),//
    btnLock:false,//按钮锁

    //下级组件信息
    detailsInfoData:{},
    descriptionData:{},
    repayTypeData:{},

    // loading信息
    transferLoadingData: {
        open: false,
        status: "pending",
        hash: "",
        nextPage: {
            path: "/protfolio",
            query: {},
            name: "my protfolio"
        },
        transferName: "buy Call"
    }

});

//---------计算属性-----------------
//显示的抵押资产余额
var underlyingAssetBalance=computed(()=>{
    //判断当前对象是0
     if(!data.currentUnderlyingAsset.decimals){
         return 0
     }
     console.log(data.underlyingAssetBalance,"=s==s===ss")
     return (data.underlyingAssetBalance.div(ethers.utils.parseUnits("1",data.currentUnderlyingAsset.decimals-2)).toNumber()/100).toFixed(2)
})



var dateShow=computed(()=>{
      let  date= data.signatureInfo?.expirationDate || 0
      if(date==0){
        return `0d 0h 0m`
      }
      //当前时间
      let nowTime=parseInt(new Date().getTime() /1000)
      //剩余时间
      let residualTime= date-nowTime
      //天 
      let day=parseInt(residualTime/(24*60*60))
      //小时
      let hour=parseInt((residualTime-day*24*60*60)/3600)
      //分
      let minute  =parseInt((residualTime-day*24*60*60-hour*3600)/60) 
      console.log(residualTime,date,nowTime,"当前时间",day,hour,minute)

      return `${day}d ${hour}h ${minute}m`
})
//-------------方法---------------------
var selectPremium=(item)=>{
      data.premiumAssetList.forEach(item=>{
          item.select=false
      })
      item.select=true
      data.currentPremiumAsset=item
}

var inputChange= (value)=>{
      console.log(data.underlyingAmount,"触发修改值",value)
    //   data.underlyingAmount=value
    chandlePremium(value)

}

var maxChange= (value)=>{
    chandlePremium(value)
    console.log(value,"max产想你想你想你")
}

var chandlePremium=(value)=>{
    let premiumFees=data.signatureInfo?.premiumFees||[]
    
    data.premiumAssetList?.forEach((item,index)=>{
      let premium=(value.mul(BigNumber.from(premiumFees[index])).div(ethers.utils.parseUnits("1",item.decimals)).div(ethers.utils.parseUnits("1",data.currentUnderlyingAsset.decimals-2)).toNumber())/100
      console.log("修改权力金",premium)
      item["premium"]=premium
    }) 
}


//-------------初始化相关---------------------
onMounted(async ()=>{
    await  init()
})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})
var init=async()=>{
    if(axiosStore.isConnect==1){
      return
    }
    //获取订单信息
    await getOrder()
    
 

    // 处理抵押资产
    let underlyingAssetData=data.signatureInfo.underlyingAsset || ""
    data.currentUnderlyingAsset= JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(underlyingAssetData))) 




    //行权资产
    let currentStrikeAsset=data.signatureInfo.strikeAssets ||[]
    data.currentStrikeAsset=JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(currentStrikeAsset[0])))

    //处理权力金资产 
    let premiumAssetData=data.signatureInfo.premiumAssets || []
    let balanceList=[]
    //获取余额(买家)
    if(premiumAssetData.length>0){
          //处理余额  获取0号vault
        let vault=await getVault()
        balanceList=await getTokenBalance(vault,premiumAssetData)
    }
    //处理数据
    let premiumAssetList=[]
    premiumAssetData.forEach((item,index)=>{
         let token= axiosStore.getTokenByAddress(item)
         token=JSON.parse(JSON.stringify(token))
         token["balance"]=balanceList[index]
         token["balanceShow"]=(balanceList[index].div(ethers.utils.parseUnits("1",token.decimals-2)).toNumber())/100
         token["select"]=false
         token["premium"]=BigNumber.from("0")
         token["signPremiumFeesIndex"]=index
         if(index==0){
            token["select"]=true
         }
         premiumAssetList.push(token)
    })
    data.currentPremiumAsset=premiumAssetList[0] || {}
    data.premiumAssetList=premiumAssetList
   //获取抵押资产价格
    data.currentUnderlyingPrice=  await getPrice(data.currentUnderlyingAsset.address)


    //处理能够购买的余额
    await getUnderlyAssetTotal()
}

//----------------请求----------------------
var getOrder=async ()=>{
   let response= await getOrderApi(route.query.id,axiosStore.chainId,"")
   console.log("response",response)
   response=response?.data || []
   let signInfo={}
   let signature=""
   let remarkInfo={}
   let strikeAmount=BigNumber.from("0")
   //下级组件信息
   let detailsInfoData={}
   response?.forEach(item=>{
       signInfo={
        orderType:0,
        underlyingAsset:item["underlying_asset"],
        underlyingAssetType:item["underlying_asset_type"],
        underlyingNftID:item["underlying_nft_id"],
        expirationDate:item["expiration_date"],
        total:item["total"],
        timestamp:item["timestamp"],
        liquidateModes:item["liquidate_modes"],
        strikeAssets:item["strike_assets"],
        strikeAmounts:item["strike_amounts"],
        premiumAssets:item["premium_assets"],
        premiumFees:item["premium_fees"]
       }
       signature=item.sign

       remarkInfo={
          total:item["total"],
          chainId:item["chain_id"],
          writerVault:item["writer_vault"],
          wallet:item["writer_wallet"],
          uesd:item["used"],
          status:item["status"],
          premiumFeeUsd:item["option_premium"],
          marketPrice:item["market_price"],
          derbitPrice:item["derbit_price"],
          optionDate:item["option_date"],
          strikePrice:item["strike_price"]
       }
       let liquidate=""
          switch(Number(item["liquidate_modes"][0])){
             case 0:
             liquidate="Asset Delivery/Cash Settlement";
             break;
             case 1:
             liquidate="Cash Settlement"
               break;
             case 2:
             liquidate="Asset Delivery"
                break     
          }
       //处理子信息
       let underlyingAssetToken=axiosStore.getTokenByAddress(item["underlying_asset"])
       let total=(BigNumber.from(item["total"]).div(ethers.utils.parseUnits("1",underlyingAssetToken.decimals-2)).toNumber())/100
       let used=(BigNumber.from(item["used"]).div(ethers.utils.parseUnits("1",underlyingAssetToken.decimals-2)).toNumber())/100



       detailsInfoData={
          derbitPrice:item["derbit_price"],
          liquidateWay:liquidate,
          marketPrice:item["market_price"],
          optionDate:item["option_date"],
          strikePrice:item["strike_price"],
          unUsed: total-used,
          total:total,
          underlyingAssetToken:underlyingAssetToken,
          writerVault:item["writer_vault"],
          wallet:item["writer_wallet"],
       }
      
       strikeAmount=BigNumber.from(item["strike_amounts"][0])


       
   })


   //
   data.signatureInfo=signInfo
   data.signature=signature
   data.remarkInfo=remarkInfo
   console.log("signInfo",signInfo)
   data.detailsInfoData=detailsInfoData
   data.cuurentStrikeAmount=strikeAmount
  
   
}
//------------上链业务相关------------------
//买操作上链
var buyCall=async ()=>{
    //处理边界条件
   if(data.signature==""){
       message.warning("order data error")
      return
   }
    //抵押数量为0
  if(data.underlyingAmount.eq(BigNumber.from("0"))){
     message.warning("please input underlyingAmount")
     return 
   }
   //获取卖家0vault余额
   let writerBalance=  await getTokenBalance(data.remarkInfo.writerVault,[data.currentUnderlyingAsset.address])
   if(BigNumber.isBigNumber(writerBalance[0]) && data.underlyingAmount.gte(writerBalance[0])){
     message.warning("writer Vault balance not enough")
     return 
   }

   //检查线上的offer余额是否足够
   let underkyTotal=await getUnderlyAssetTotal()
   if(data.underlyingAmount.gte(underkyTotal)){
     message.warning("offer total not enough")
     return 
   }
   //-----------------------------
   let ops=[]
   let vaultData= await getMulVaultR([0,"maxSalt"])
   let maxSaltVault=vaultData["maxSalt"]?.vault
   let maxSalt=vaultData["maxSalt"]?.salt 
   let mainVault=vaultData["0"]?.vault
   console.log("sss",mainVault)
   //创建vault
   let createVaultData=createVaultService(maxSaltVault)
   ops=ops.concat(createVaultData)
   //设置vaultType
   ops.push(setVaultType(maxSaltVault,BigNumber.from("7")))
   //从0号vault申购
   let asset=[data.currentPremiumAsset.address]
   let premiumFee=data.signatureInfo?.premiumFees[data.currentPremiumAsset.signPremiumFeesIndex]
   let premium=data.underlyingAmount.mul(premiumFee).div(ethers.utils.parseUnits("1",data.currentUnderlyingAsset.decimals))
   //判断买家余额是否足够  
   if(premium.gte(data.currentPremiumAsset.balance)){
       message.warning("premium balance not enough")
       return
   }
   let amount=[premium]
   console.log(maxSaltVault,mainVault,asset,amount,"======")
   ops.push(issue(maxSaltVault,mainVault,asset,amount))  
   //权利金选择
   let premiumSelet=0
   data?.premiumAssetList.forEach((item,index)=>{
       if(item.select){
          premiumSelet=index
       }
   })
   //业务处理
   let info={
        strikeSelect:0,
        holder:maxSaltVault,
        liquidateSelect:0,
        writer:data.remarkInfo.writerVault,
        recipient:mainVault,
        premiumSelet:premiumSelet,
        underlyingAmount:data.underlyingAmount,
        signature:toRaw(data.signatureInfo)
   }
   console.log("订单信息",info)
   let writerSignature=data.signature
   ops.push(submitOptionOrder(info,writerSignature))
   //取vault下标
   console.log(maxSalt,"---");
   data.transferLoadingData.open = true;
   data.transferLoadingData.status = "pending";
   data.transferLoadingData.hash = "";
   let bundlerHash= await sendTxToBundler(maxSaltVault,maxSalt,ops)
   console.log("bundlerHash",bundlerHash)
    // 接触按钮锁
    if(!bundlerHash.status){
        data.btnLock=false;
        data.transferLoadingData.status = 'faild';
        data.transferLoadingData.hash = bundlerHash.hash;
        return
    }
    //起弹窗
    // data.txHash=bundlerHash.hash
    // data.isOpen=true
    //等待交易结果
    let result=  await getBundlerTxResult(bundlerHash.hash)
    // data.txResult=result
    console.log("交易结果",result)
    if(!result.status){
        data.transferLoadingData.status = "faild";
        data.transferLoadingData.hash = bundlerHash.hash;
        data.btnLock=false
        return
    }
    data.transferLoadingData.status = "success";
    data.transferLoadingData.hash = bundlerHash.hash;
}

//查询货币价格
var getPrice=async (_masterToken)=>{
    let underlyingAssetPrice=await getPriceByPriceOracleApi(_masterToken,axiosStore.remark.usdToken)
    underlyingAssetPrice=underlyingAssetPrice?.message?.price ||BigNumber.from("0")
    return underlyingAssetPrice
}
//查询货币余额
var getTokenBalance=async (account,tokenList)=>{
    let accountList=[]
    tokenList.forEach(item=>{
        accountList.push(account)
    })
    let balanceList= await getMulTokenBalance(accountList,tokenList)
    console.log(account,"balanceList",balanceList)
    return balanceList
}
// 获取0号vault
var getVault=async ()=>{
   //处理余额  获取0号vault
   let vault= await getVaultApi(axiosStore.currentAccount,axiosStore.vaultSalt)
   vault=vault?.message?.vault ||  new Error("vault error")
   console.log(vault,"当前vault")
   return vault
}

//卖单总余额
var  getUnderlyAssetTotal=async ()=>{
    let multiCallData=[]
    multiCallData.push(getUnderlyTotal("getUnderlyTotal",data.remarkInfo.writerVault,0,data.currentUnderlyingAsset.address))  
    let multiCallResponse=await multiCallObjR(multiCallData)
    console.log("multiCallResponse",multiCallResponse)   
    //如果当前时间戳> 链上时间戳   &&  total大于0的情况 则需要去除老的签名    
    let total=multiCallResponse["getUnderlyTotal"]?.total || BigNumber.from("0")

    //修改值
    console.log(total,'slslslls')
    if(BigNumber.from(total).eq(BigNumber.from("0"))){
        total=BigNumber.from(String(data.remarkInfo.total)) 
    }
    data.underlyingAssetBalance=total
    data.detailsInfoData.unUsed=BigNumber.from(total).div(ethers.utils.parseUnits("1",data.currentUnderlyingAsset.decimals-2)).toNumber()/100
    return total
}



</script>

<style scope lang="less">
.buyOption{
    padding: 56px 12px 80px;
    overflow: auto;
    width: 100%;
    height: 100%;
}
.slotBalance{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: 6px;
    box-sizing: border-box;
}

.header-content{
  height: 48px;  
  margin-top: 8px;
  display: flex;  
  padding: 4px 0;
  justify-content: space-between;
  align-items: center;
  .title{
    font-size: 24px;
    font-weight: bold;

  }
  .token-content{
    position: relative;
    margin-top: 8px;
    .token{
        width: 36px;
        position: relative;
        display: inline-block;
        border-radius: 50%;
        &:first-child{
            margin-right: -8px;
            z-index: 6;
        }
    }
    .ticket{
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 4px dashed #fff;
        z-index: 5;
        top: 0;
        right: 0;
    }
  }
  
}
// 价格变动
.price-change-content{
    display: flex;
    justify-content: start;
    margin-top: 8px;
    .img{
        width: 24px;
        margin-right: 6px;
    }
    .price{
        font-size: 16px;
        font-weight: bold;
        line-height: 25px;
        &.up{
            color: #01A754;
        }
    }
}

// 日期显示
.date-content{
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
    margin-bottom: 24px;
    .date-img{
        width: 24px;
        margin-right: 6px;
    }
    
}

// 数字输入框区域
.input-content{
    margin-top: 8px;
    background-color: var(--bg-color-secondarycontainer);
    border-radius: 8px;
    padding: 4px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-color-second);
        font-size: 14px;
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

// 支付币种选择区域
.underly-assets-content{
    margin-top: 24px;
    .title-row{
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 400;
        .title{
            color: var(--text-color-primary);
        }
        .info{
            color: var(--text-color-second);
        }
    }
    .select-content{
        margin-top: 8px;
        border-radius: 8px;
   
        width: 100%;
        position: relative;
        display: flex;
        .item{
            border: 2px solid var(--border-color);
            height: 70px;
            width: 50%;
            border-radius: 8px;
            padding: 16px 12px;
            box-sizing: border-box;
          
            .token{
                color: var(--text-color-primary);
                font-size: 16px;
                line-height: 16px;
                img{
                    width: 16px;
                    margin-right: 4px;
                    vertical-align: top;
                }
            }
            .balance{
                margin-top: 4px;
                color: var(--text-color-second);
                font-size: 14px;
            }
        }
        .active{
                border: 2px solid var(--bg-color-container-active);
        }
    }
}

.pay-btn-content{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    height: 80px;
    padding: 16px;
    border: 1px solid var(--component-border);
    .pay-btn{
        width: 100%;
        height: 48px;
    }
}

.option-details{
    margin-top: 28px; 
    .collapse-title{
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        width: 100%;
        position: relative;
    
        img{
            vertical-align: sub;
            width: 16px;
        }
        &::before{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            left: 0px;
        }
        &::after{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            right: 0;
        }
    }
}



</style>