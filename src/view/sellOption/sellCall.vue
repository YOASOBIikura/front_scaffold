<template>
    <navigation-bar title="Sell Call Options"></navigation-bar>
    <div class="sellOption">    
        <!-- 选择币种 -->
        <selectCoin  @change="underlyingChange" :dataList="data.underlyingAssetList" v-model:value="data.currentUnderlyingAsset" ></selectCoin>




       <!-- 数字输入框 -->
       <div class="sell-amount-content">
        <div class="title">Amount</div>
        <inputValue 
        v-model:value="data.underlyingAmount" 
        :isApproximate="true"
        :maxValue="data.underlyingAssetBalance"
        :symbol="data.currentUnderlyingAsset.name" 
        :decimals="data.currentUnderlyingAsset.decimals">
             <div class="slotBalance">
                 <span></span>
                 <span>{{underlyingAssetBalance}}</span>
             </div>
        </inputValue>
       </div> 

           
       
       <!-- 行权价格 -->
        <div class="strike-price-content">
            <div class="strike-title">
                <div class="title">Strike Price</div>
                <div class="current-price">
                    <div class="call-price">
                        <span>Market Price</span>
                        <span style="font-weight: bold;"> ${{data.marketPrice}}</span>
                    </div>
                    <refresh @change="getMarketPrice"></refresh>
                </div>
            </div>
            <div class="strike">
                <strike-price @change="strikePriceChange" :dataList="data.strikePrice" v-model:value="data.currentStrikePrice" > </strike-price>          
            </div>

        </div>
        <!-- 到期时间 -->
        <div class="expiry-data-content">
            <div class="title">Expiry Date</div>
            <div>
                <expiry-date-slider
                    class="expiry-date"
                    :dataList="data.expiryDataList"
                    v-model:value="data.currentExpiryDataValue"
                    @change="changeExpiry"
                ></expiry-date-slider>
            </div>
        </div>   

        <!-- 价格 -->
        <div class="price-content">
            <div class="price-title">
                <div class="title">Price</div>
                <div class="current-price">
                    <div class="price">
                        <span>Deribit Price</span>
                        <span style="font-weight: bold;"> ${{ data.premiumPrice }}</span>
                    </div>
                    <refresh @change="strikePriceChange"></refresh>
                </div>
            </div>
       
            <inputValue 
            :isSuffix="false"  
            :decimals="18"
            :isMax="false"
            v-model:value="data.currentPremiumFee"
            ></inputValue>

        </div>

        <div class="premium-content">
            <div class="title">Strike</div>
            <div class="mul-content">
                <mul-select :isSingle="true" v-model:value="data.strikeAssetList"></mul-select>
            </div>
        </div>


        <!-- 支付币种支持 -->
        <div class="premium-content">
            <div class="title">Premium</div>
            <div class="mul-content">
                <mul-select v-model:value="data.premiumAssetList"></mul-select>
            </div>
        </div>

        <!-- 支持的还款方式选择 -->
        <div class="premium-content">
            <div class="title">Accept</div>
            <div class="mul-content">
                <mul-select  v-model:value="data.liquidationWay"></mul-select>
            </div>
        </div>
    </div>


    <!-- 支付按钮区域 -->
    <div class="pay-btn-content">
        <a-button  @click="sendTx"
            type="primary"
            class="pay-btn"
            >Confirm</a-button>
    </div>
    <a-spin v-if="data.loading" class="aSpin" tip="Loading..."  :delay="50"> </a-spin>

    <multistepLoading
        v-model:isOpen="data.loadingData.open"
        :titleName="data.loadingData.titleName"
        :nextPage="data.loadingData.nextPage"
        :stepList="data.loadingData.stepList"
    ></multistepLoading>
</template>
<script setup>
import inputValue from "@/components/utils/inputValue.vue"
import strikePrice from "@/components/sellOption/strikePrice.vue"
import mulSelect from "@/components/sellOption/mulSelect.vue"
import navigationBar from "@/components/utils/navigationBar.vue";
import expiryDateSlider from "@/components/sellOption/expiryDateSlider.vue"
import refresh from "@/components/utils/refresh.vue"
import selectCoin from "@/components/utils/selectCoin.vue"
import multistepLoading from "@/components/utils/multistepLoading.vue";


import { reactive,onMounted,computed,watch} from "vue";
import { useRouter,useRoute} from "vue-router";
import {getSigatureLock,getUnderlyTotal} from "@/callData/multiCall/optionFacet"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import {getVaultApi} from "@/api/vaultFactory"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber, ethers } from "ethers";
import {setSigatureLockApi,sign712OrderApi,getStrikeApi,createOrderApi} from "@/api/optionModule"
import {balanceOfApi} from "@/api/token"
import {getPriceByPriceOracleApi} from "@/api/priceOracle"
import {getWalletBalanceApi} from "@/api/utils"
import { message } from 'ant-design-vue';
const router=useRouter()
const route=useRoute()
const axiosStore= useAxiosStore()
const data=reactive({ 
   underlyingAssetList:[], //抵押资产列表
   strikeAssetList:[],//行权资产列表
   premiumAssetList:[],//权力金资产列表
   liquidationWay:[],//清算方式数组  
   currentStrikePrice: {},//当前选中行权价
   currentUnderlyingAsset:{},//当前抵押资产
   strikePrice:[], //行权价列表
   expiryDataList:[],//到期日列表
   currentExpiryDataValue:{},//到期日选中值
   currentExpiryData:BigNumber.from("0"),//参数要使用的到期日
   marketPrice:BigNumber.from("0"),//市场价
   //---------------
   vault:"", //vault地址
   underlyingAssetBalance:BigNumber.from("0"), //真实数量
   underlyingAmount:BigNumber.from("0"),//抵押数量
   currentPremiumFee:BigNumber.from("0"),//输入框的期权费
   premiumPrice:BigNumber.from("0"),//deberit期权费
   //-----------------
   loading:false,
 
    // loading信息
    loadingData: {
        open: false,
        nextPage: {
            path: "/protfolio",
            query: {},
            name: "my protfolio"
        },
        titleName: "sell Call",
        stepList: []
    }

})
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



//----------普通处理方法--------------------
const changeExpiry = (item) => {;
    data.currentExpiryData=BigNumber.from(parseInt(item.timestamp/1000))
    data.premiumPrice=item.premiumPrice
}

var strikePriceChange=async (item)=>{
   console.log(item,"ppp")
   data.loading=true
   await handleDerbitPriceAndExpiryData()
   data.loading=false
}
//-----------初始化相关-------------------
onMounted(async ()=>{
   console.log(route,"=s=s=")
 
   await init()
})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})


var init=async () => {
    if(axiosStore.isConnect==1){
      return
    }
  
    //处理抵押资产列表
    let underlyingAssetData=axiosStore?.optionBusiness?.underlyingAssets||[]
    let underlyingAssetList=[]
    underlyingAssetData.forEach(item=>{
        item=JSON.parse(JSON.stringify(item))
        if(route.query.asset == item["name"]){
            data.currentUnderlyingAsset=item
        }
        underlyingAssetList.push(item)
    })
    data.underlyingAssetList=underlyingAssetList

    //处理行权资产
    let strikeAssetData=axiosStore?.optionBusiness?.strikeAssets||[]
    let strikeAssetList=[]
    strikeAssetData.forEach(item=>{
        item=JSON.parse(JSON.stringify(item))
        item.select=false
        strikeAssetList.push(item) 
    })
    data.strikeAssetList=strikeAssetList

    //处理权力金资产
    let premiumAssetData=axiosStore?.optionBusiness?.premiumAssets||[]
    let premiumAssetList=[]
    premiumAssetData.forEach(item=>{
        item=JSON.parse(JSON.stringify(item))
        item.select=false
        premiumAssetList.push(item) 
    })
    console.log(premiumAssetList,"----sss")
    data.premiumAssetList=premiumAssetList

    //处理清算方式
    let liquidation=axiosStore?.optionBusiness?.liquidation||[]

    let liquidationWay=[]
    liquidation.forEach(item=>{
          item=JSON.parse(JSON.stringify(item))
          item.select=false
          liquidationWay.push(item)
    })
    data.liquidationWay=liquidationWay

    data.vault= await getVault()
    await underlyingChange()
   
  
}




//--------基础查询数据-----------


var getVault=async function(){
  let salt=axiosStore.vaultSalt
  let vaultResponse= await getVaultApi(axiosStore.currentAccount,salt)
  console.log("vaultResponse",vaultResponse)
  return vaultResponse.message.vault
}

var underlyingChange=async ()=>{
    data.loading=true
     let balance= await balanceOf(data.currentUnderlyingAsset.isGasToken,data.currentUnderlyingAsset.address,data.vault)
     data.underlyingAssetBalance=balance
     await getMarketPrice()
     data.loading=false
     console.log("抵押资产余额",balance)
}

var balanceOf=async (isGasToken,underlyingAsset,wallet)=> {
    let balanceResponse
    if(isGasToken){
        balanceResponse= await  getWalletBalanceApi(wallet)
        console.log("balanceResponse",balanceResponse)
        return balanceResponse.message 
    }      
    balanceResponse= await balanceOfApi(underlyingAsset,wallet)
    return balanceResponse.message.balance
}

//获取行权价列表
var getStrikePrice=async ()=>{
     let marketPrice=data.marketPrice
     let priceInterval=data.currentUnderlyingAsset.priceInterval
     //做参数数据处理
     let basePrice=parseInt(marketPrice/priceInterval)
     let startPrice=(basePrice+1)*priceInterval
     let priceRange=[]
     for(let i=0;i<8;i++){
        //处理js小数问题
        let newPrice=(startPrice+priceInterval*i).toFixed(2)
        priceRange.push(`${newPrice*100/100}`)
     }
    console.log(priceRange,"----sss")
     let priceResponse= await getStrikeApi(route.query.asset,"call",priceRange,marketPrice)
     let strikePrice=[]
     console.log("priceResponse",priceResponse)
     for(let i=0;i<8;i++){
        if(priceResponse.data){
            let key=startPrice+i*priceInterval
                if(key && priceResponse?.data[`${key}`]?.length >0){
                    let dataList=[]
                     priceResponse?.data[`${key}`].forEach(item=>{
                         let obj={
                            "date": item.date,
                            "timestamp": item.timestamp,
                            "strike_price": item.strike_price,
                            "mark_price": item.mark_price,
                            "model_price": item.model_price
                         }
                         dataList.push(obj)
                    })
                    let result={
                    key:i,
                    price:String(key),
                    data:dataList,
                }
                strikePrice.push(result) 
            }
        }
     }
     data.strikePrice=strikePrice
     data.currentStrikePrice=strikePrice[0]||{}
     console.log(data.strikePrice,"----ss",data.currentStrikePrice)
     await handleDerbitPriceAndExpiryData()
     
}

//处理derbit价格 和 日期列表
var handleDerbitPriceAndExpiryData=async ()=>{
     let currentStrikePrice= data.currentStrikePrice || {}
     //处理日期
     let expiryDataList=[]
     currentStrikePrice?.data?.forEach((item,index)=>{
         let nowTime=parseInt(new Date().getTime() /1000) 
         let day=Math.ceil((item.timestamp-nowTime)/(60*60*24))
         let obj={
              key:index,
              day:day,
              timestamp:item.timestamp*1000,
              premiumPrice:Number(data.marketPrice *item["mark_price"]).toFixed(2),
              date:item.date
         }
         expiryDataList.push(obj)
     })
     //日期组件所需数据
     if(expiryDataList.length>0){
        data.currentExpiryDataValue=expiryDataList[0]
        data.currentExpiryData=BigNumber.from(parseInt(data.currentExpiryDataValue.timestamp/1000))
        data.expiryDataList=expiryDataList
        //处理权力金
        //  data.currentPremiumFee=expiryDataList[data.currentExpiryDataValue]
        data.premiumPrice=data.currentExpiryDataValue.premiumPrice || 0
     }
     console.log(data.currentExpiryDataValue,"真实数据",expiryDataList)
}


//获取市场价
var getMarketPrice=async ()=>{
    data.loading=true
   let underlyingAssetPrice= await  getPriceByPriceOracleApi(data.currentUnderlyingAsset.address,axiosStore.remark.usdToken)
   underlyingAssetPrice=underlyingAssetPrice?.message?.price ||BigNumber.from("0")
   data.marketPrice=(underlyingAssetPrice.div(ethers.utils.parseUnits("1",Number(axiosStore.remark.priceDecimals)-2)).toNumber()/100).toFixed(2)
   console.log(underlyingAssetPrice,"underlyingAssetPrice", data.marketPrice)
   await getStrikePrice()
   data.loading=false
}
//---------------上链业务相关部分---------------
var sendTx=async ()=>{
    if(data.strikePrice.length==0){
        message.warning("invalid strikePrice")
        return
    }


     //抵押数量为0 
     if(data.underlyingAmount.eq(BigNumber.from("0"))){
        message.warning("please input underlyingAmount")
         return
     } 
     //行权资产列表选择
     let isStrike=0
      data.strikeAssetList.forEach(item=>{
          if(item.select){
            isStrike++
          }
      })
      if(isStrike==0) {
        // console.error("未选择行权资产")\
        message.warning("please select strike")
        return
      }
    //权力金资产为空时 
      let isPremum=0
      data.premiumAssetList.forEach(item=>{
          if(item.select){
            isPremum++
          }
      })
      console.log(isPremum)
      if(isPremum==0) {
        // console.error("未选择权力金资产")
        message.warning("please select premium")
        return
      }
     //清算方式选择
     let isLiquidationWay=0
      data.liquidationWay.forEach(item=>{
          if(item.select){
              isLiquidationWay++
          }
      })
      if(isLiquidationWay==0) {
        // console.error("未选择清算方式")\
        message.warning("please select liquidation")
        return
      }
      console.log("开始上链流程",data.vault,data.currentUnderlyingAsset.address)
     await checkUpdateGignature(data.vault,data.currentUnderlyingAsset.address)
}


// 是否触发更新链上的签名
var  checkUpdateGignature=async (vault,underlyingAsset)=>{
    

   let time=parseInt(new Date().getTime()/1000)
   let currentTimestamp=BigNumber.from(time)
  //multicall数据
   let multiCallData=[]
   multiCallData.push(getSigatureLock("getSigatureLock",vault,0,underlyingAsset))  
   multiCallData.push(getUnderlyTotal("getUnderlyTotal",vault,0,underlyingAsset))  
   let multiCallResponse=await multiCallObjR(multiCallData)
   console.log("multiCallResponse",multiCallResponse)   
   //如果当前时间戳> 链上时间戳   &&  total大于0的情况 则需要去除老的签名    
    let timestamp=multiCallResponse["getSigatureLock"]?.timestamp || BigNumber.from("0")
    let total=multiCallResponse["getUnderlyTotal"]?.total || BigNumber.from("0")
    let premium=await handlePremiumAsset() 
    let strike=await handleStrikeAsset()
    let liquidateModes= handleLiquidation()
    // loadingData 数据进行构建
    data.loadingData.stepList = [{name: "Signature Offer Info", status: "current", hash: ""}];
    if(currentTimestamp.gt(timestamp) && total.gt(BigNumber.from("0"))){
        data.loadingData.stepList.push(
            {name: "Cacel Old Offer", status: "pending", hash: ""}
        );
    } 
    data.loadingData.stepList.push(
        {name: "Offer Submit", status: "pending", hash: ""}
    );
    
    data.loadingData.open = true;

   //进行712签名
    let signatureInfo={
        orderType:0,
        underlyingAsset: underlyingAsset, 
        underlyingAssetType:data.currentUnderlyingAsset.assetType,
        underlyingNftID:0,
        expirationDate:data.currentExpiryData,
        total:data.underlyingAmount,
        timestamp:currentTimestamp,
        liquidateModes:liquidateModes,
        strikeAssets:strike.strikeAssets,
        strikeAmounts:strike.strikeAmounts,
        premiumAssets:premium.premiumAssets,
        premiumFees:premium.premiumFees      
    }
   
    let signatureResponse= await sign712OrderApi(axiosStore.chainId,axiosStore.currentContractData["OptionModule"],signatureInfo)
    console.log("signature",signatureResponse)
   //是否触发链上签名
   if(!signatureResponse.status){
    //    console.error("用户拒绝签名",signatureResponse)
       data.loadingData.stepList[0].status = "faild";
       message.error("user refused to sign")     
       return
   }
   data.loadingData.stepList[0].status = "success";
   if(currentTimestamp.gt(timestamp) && total.gt(BigNumber.from("0"))){
        data.loadingData.stepList[1].status = "current";
        //触发上链签名
       let resetSigature= await  setSigatureLockApi(data.vault,0,underlyingAsset,currentTimestamp)
       if(!resetSigature.message.status){
        //   console.error("取消老订单失败")
           data.loadingData.stepList[1].status = "faild";
           message.error("cacel old offer fail")
          return
       }
       data.loadingData.stepList[1].status = "success";
   }
   let loadingUpdateIndex = data.loadingData.stepList.length - 1;
    data.loadingData.stepList[loadingUpdateIndex].status = "current";
   //更新签名到中心化服务器
    let response=await storeSingature(signatureInfo,signatureResponse.message)
    console.log("response 中心化服务器",response)
    if(!response.data){
    //    console.error("存储数据到中心化服务器失败")   
           data.loadingData.stepList[loadingUpdateIndex].status = "faild";
           message.error(response.message)
           return
    }
    data.loadingData.stepList[loadingUpdateIndex].status = "success";
    //流程完成 弹窗
    message.success("submit offer success")
    // router.push({path:"/protfolio"})
}

//处理行权资产  //因为行权资产跟权力金资产一样 所以这里做同步处理
var handleStrikeAsset=async ()=>{
   let strikeAssets=[]
   let decimals=[]
   let strikeAmounts=[]


   data.strikeAssetList.forEach(item=>{
       if(item.select){
          strikeAssets.push(item.address)
          decimals.push(item.decimals)
       }
   })
   //处理行权资产的价格
   let strikePrice=[ethers.utils.parseUnits("1",18),ethers.utils.parseUnits("1",18)]
   //获取价格
   /**
    * 1eth 3500usd
    * 1usdc 1usd
    * 
    */
   //每一份的行权数量
   let value=ethers.utils.parseUnits(data.currentStrikePrice.price,18) //行权价
   console.log("行权价",value)
    strikeAssets.forEach((item,index)=>{
        //行权价*抵押资产的精度/行权资产的价格
        let amount=value.mul(ethers.utils.parseUnits("1",decimals[index])).div(strikePrice[index]) 
        strikeAmounts.push(amount) 
    })
   console.log("行权价",strikeAssets,strikeAmounts)
   return {
    strikeAssets,strikeAmounts
   }
}

//处理权力金资产
var handlePremiumAsset=async ()=>{
   let premiumAssets=[]
   let premiumFees=[]
   let decimals=[]
   
   data.premiumAssetList.forEach(item=>{
       if(item.select){
        premiumAssets.push(item.address)
        decimals.push(item.decimals)
       }
   })
   //获取权力金价格
   let premium=[ethers.utils.parseUnits("1",18),ethers.utils.parseUnits("1",18)]
   /**
    * 期权价格*权力金资产的精度/期权的价格
    */
    console.log(data.currentPremiumFee,"-----sss")
    let value=BigNumber.from("0")  //权力金费用 带18精度
    if(data.currentPremiumFee.eq(BigNumber.from("0"))){
       value=ethers.utils.parseUnits(`${data.premiumPrice}`,18)   
    }else{
        //currentPremiumFee 已经带精度了
        value=data.currentPremiumFee
    }
    premiumAssets.forEach((item,index)=>{
          let amount=value.mul(ethers.utils.parseUnits("1",decimals[index])).div(premium[index])
          premiumFees.push(amount)
    })
    console.log("权力金费用",premiumAssets,premiumFees)
   //返回价值
   return {
    premiumAssets,
    premiumFees
   }
}

//处理结算方式
var handleLiquidation=()=>{
   let liquidateModes=[]
   data.liquidationWay.forEach(item=>{
      if(item.select){
         liquidateModes.push(item.value)
      }
   })
   if(liquidateModes.length==2){
      liquidateModes=[0]
   }
   return liquidateModes
}

// 存储签名数据到中心化服务器
var storeSingature=async (signData,signature)=>{
    let premium="0"  
    if(data.currentPremiumFee.toString()=="0"){
        premium=String(data.premiumPrice)
    }else{
        premium=(data.currentPremiumFee.div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100)
    }

  //处理bigNumber问题
  signData.expirationDate=signData.expirationDate.toString()
  signData.total=signData.total.toString()
  signData.timestamp=signData.timestamp.toString()
  let strikeAmounts=[]
  signData.strikeAmounts.forEach(item=>{
    strikeAmounts.push(item.toString())
  })
  signData.strikeAmounts=strikeAmounts

  let premiumFees=[]
  signData.premiumFees.forEach(item=>{
    premiumFees.push(item.toString())
  })

  signData.premiumFees=premiumFees

  //----
  let orederInfo={
    "chain_id":String(axiosStore.chainId),
    "underlying_symbol":String(data.currentUnderlyingAsset.name).toLocaleUpperCase(),
    "writer_wallet": axiosStore.currentAccount,
    "writer_vault": data.vault,
    "sign_data": signData,
    "sign":signature,
    "strike_price": data.currentStrikePrice.price,
    "option_premium": String(premium),
    "option_date":data.currentExpiryDataValue.date,
    "derbit_price":data.premiumPrice,
    "market_price":data.marketPrice
  }
  return await createOrderApi(orederInfo)
}
</script>
<style scoped lang="less">
.sellOption{
    padding: 72px 12px 100px;
    overflow: auto;
    width: 100%;
    height: 100%;
}
.title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
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

.select-option-token-content{
    margin-top: 16px;
}
// 数字输入框区域
.sell-amount-content{
    margin-top: 24px;
    .input-content{
        margin-top: 16px;
        background-color: var(--bg-color-secondarycontainer);
        border-radius: 8px;
        padding: 16px;
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
}

// 行权价格区域
.strike-price-content{
    margin-top: 32px;
    .strike-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .current-price{
            .call-price{
                padding: 2px 4px;
                font-size: 12px;
                background-color: rgba(1, 167, 84, 0.07);
                color: var(--text-color-success);
                display: inline-block;
                border-radius: 4px;
            }
            .put-price{
                padding: 2px 4px;
                font-size: 12px;
                background-color: rgba(234, 60, 50, 0.07);
                color: var(--text-color-error);
                display: inline-block;
                border-radius: 4px;
            }
            .refresh{
                display: inline-block;
                margin-left: 4px;
                img{
                    width: 24px;
                    vertical-align: middle;
                }
            }
        }
    }
    .strike{
        margin-top: 16px;
    }
}

// 到期时间区域
.expiry-data-content{
    margin-top: 32px;
    .current-expiry-date{
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 16px;
    }
    .expiry-date{
        margin-top: 16px;
    }
}

// 价格区域
.price-content{
    margin-top: 32px;
     .price-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .current-price{
            .price{
                padding: 2px 4px;
                font-size: 12px;
                background-color: var(--bg-color-secondarycontainer);
                color: var(--text-color-primary);
                display: inline-block;
                border-radius: 4px;
            }
            .refresh{
                display: inline-block;
                margin-left: 4px;
                img{
                    width: 24px;
                    vertical-align: middle;
                }
            }
        }
    }
    .input{
        height: 48px;
        font-size: 16px;
        background-color: var(--bg-color-secondarycontainer);
        margin-top: 16px;
    }
}

// 支持的支付币种区域
.premium-content{
    margin-top: 32px;
    .mul-content{
        margin-top: 16px;
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



</style>