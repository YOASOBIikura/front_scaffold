<template>
    <navigation-bar title="Sell Put Options"></navigation-bar>
    <div class="sellOption">    
        <!-- 选择币种 -->
        <selectCoin @change="underlyingChange"  :dataList="data.strikeAssetList" v-model:value="data.currentStrikeAsset" ></selectCoin>
        
        <!-- put 下的锁定币种 -->
        <div  class="lock-token-content">
            <div class="title">Lock</div>
            <div class="select-content">
                <div @click="selectLockAsset(item)" :class="item.select?'item active':'item'" v-for="(item,index) in data.underlyingAssetList" :key="index">
                    <div class="token">
                        <img :src="item.img" />
                        <span>{{ item.name }}</span>
                    </div>
                </div>
            </div>
        </div>


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
                    <refresh @change="strikePriceChange"></refresh>
                </div>
            </div>
            <div class="strike">
                <strike-price :dataList="data.strikePrice" v-model:value="data.currentStrikePrice" > </strike-price>          
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

</template>
<script setup>
import inputValue from "@/components/utils/inputValue.vue"
import strikePrice from "@/components/sellOption/strikePrice.vue"
import mulSelect from "@/components/sellOption/mulSelect.vue"
import navigationBar from "@/components/utils/navigationBar.vue";
import expiryDateSlider from "@/components/sellOption/expiryDateSlider.vue"
import refresh from "@/components/utils/refresh.vue"
import selectCoin from "@/components/utils/selectCoin.vue"
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
const router=useRouter()
const route=useRoute()
const axiosStore= useAxiosStore()
const data=reactive({ 
   underlyingAssetList:[],//抵押资产列表
   currentUnderlyingAsset:{},//当前抵押资产
   strikeAssetList:[], //行权资产列表
   currentStrikeAsset:{},//当前行权资产
   premiumAssetList:[],//权力金资产
   liquidationWay:[],//清算方式数组  
   currentPrice:BigNumber.from("2200"),//当前抵押资产价格
   currentStrikePrice: {},//行权价
   strikePrice:[], //行权价列表
   expiryDataList:[],//到期日列表
   currentExpiryDataKey:{},//到期日选中值
   currentExpiryData:BigNumber.from("0"),
   //---------------
   vault:"", //vault地址
   underlyingAssetBalance:BigNumber.from("0"), //真实数量
   underlyingAmount:BigNumber.from("0"),//抵押数量
   currentPremiumFee:BigNumber.from("2200"),
})
//---------计算属性-----------------
//显示的抵押资产余额
var underlyingAssetBalance=computed(()=>{
    //判断当前对象是0
     if(!data.currentUnderlyingAsset.decimals){
         return 0
     }
     console.log("当前抵押资产余额",data.underlyingAssetBalance)
     return (data.underlyingAssetBalance.div(ethers.utils.parseUnits("1",data.currentUnderlyingAsset.decimals-2)).toNumber()/100).toFixed(2)
})

//----------普通处理方法--------------------
var selectLockAsset=async (value)=>{
     data.underlyingAssetList.forEach(item=>{ 
          item.select=false
     })
     value.select=true
     data.currentUnderlyingAsset=value
     await underlyingChange()
}


const changeExpiry = (item) => {;
    data.currentExpiryData=BigNumber.from(parseInt(item.timestamp/1000))
    data.premiumPrice=item.premiumPrice
}


var strikePriceChange=async (item)=>{
   console.log(item,"ppp")
   await handleDerbitPriceAndExpiryData()
}



//-----------初始化相关-------------------
onMounted(async ()=>{
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

    //处理抵押资产列表  put情况下下 这里是usdc usdt
    let underlyingAssetData=axiosStore?.optionBusiness?.strikeAssets||[]
    let underlyingAssetList=[]
    underlyingAssetData.forEach((item,index)=>{
        item=JSON.parse(JSON.stringify(item))
        if(index==0){
            item.select=true
            data.currentUnderlyingAsset=item
        }
        underlyingAssetList.push(item)
    })
    data.underlyingAssetList=underlyingAssetList


    console.log(data.underlyingAssetList,"PSP PSP视频")
    //处理行权资产  行权资产这里是eth 或btc
    let strikeAssetData=axiosStore?.optionBusiness?.underlyingAssets||[]
    let strikeAssetList=[]
    strikeAssetData.forEach((item,index)=>{
        item=JSON.parse(JSON.stringify(item))
        if(route.query.asset == item["name"]){
            data.currentStrikeAsset=item
        }
        strikeAssetList.push(item) 
    })
    data.strikeAssetList=strikeAssetList
    console.log(data.underlyingAssetList,"PSP PSP视频2222")

    //处理权力金资产
    let premiumAssetData=axiosStore?.optionBusiness?.premiumAssets||[]
    let premiumAssetList=[]
    premiumAssetData.forEach(item=>{
        item=JSON.parse(JSON.stringify(item))
        item.select=false
        premiumAssetList.push(item) 
    })
    console.log("权力金资产列表",premiumAssetList,"----sss")
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
    if(data.vault=="") {
         console.log("vault","请求失败")
         return
    }
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
     let balance=await  balanceOf(data.currentUnderlyingAsset.address,data.vault)
     data.underlyingAssetBalance=balance
     await getMarketPrice()
     console.log("抵押资产余额",data.currentUnderlyingAsset,balance)
}

var balanceOf=async (underlyingAsset,wallet)=> {
    let balanceResponse= await balanceOfApi(underlyingAsset,wallet)
    return balanceResponse.message.balance
}


//获取行权价列表
var getStrikePrice=async ()=>{
     let marketPrice=data.marketPrice
     //做参数数据处理
     let basePrice=parseInt(marketPrice/100)
     let startPrice=(basePrice+1)*100
     let priceRange=[]
     for(let i=0;i<8;i++){
        priceRange.push(`${startPrice-100*i}`)
     }
    console.log(priceRange,"----sss")
     let priceResponse= await getStrikeApi(route.query.asset,"call",priceRange,marketPrice)
     let strikePrice=[]
     console.log("priceResponse",priceResponse)
     for(let i=0;i<8;i++){
        if(priceResponse.data){
            let key=startPrice-i*100
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
     data.currentExpiryDataValue=expiryDataList[0]
     data.currentExpiryData=BigNumber.from(parseInt(data.currentExpiryDataValue.timestamp/1000))
     data.expiryDataList=expiryDataList
     //处理权力金
    //  data.currentPremiumFee=expiryDataList[data.currentExpiryDataValue]
     data.premiumPrice=data.currentExpiryDataValue.premiumPrice || 0
     console.log(data.currentExpiryDataValue,"真实数据",expiryDataList)
}


//获取市场价
var getMarketPrice=async ()=>{
   let underlyingAssetPrice= await  getPriceByPriceOracleApi(data.currentStrikeAsset.address,axiosStore.remark.usdToken)
   underlyingAssetPrice=underlyingAssetPrice?.message?.price ||BigNumber.from("0")
   data.marketPrice=(underlyingAssetPrice.div(ethers.utils.parseUnits("1",Number(axiosStore.remark.priceDecimals)-2)).toNumber()/100).toFixed(2)
   console.log(underlyingAssetPrice,"underlyingAssetPrice", data.marketPrice)
   await getStrikePrice()
}

//---------------上链业务相关部分---------------
var sendTx=async ()=>{
    console.log(data.underlyingAmount,"data.underlyingAmount",data.currentStrikePrice)
    //  return
    //权力金资产为空时 
      let isPremum=0
      data.premiumAssetList.forEach(item=>{
          if(item.select){
            isPremum++
          }
      })
      if(isPremum==0) {
        console.error("未选择权力金资产")
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
        console.error("未选择清算方式")
        return
      }
      await checkUpdateGignature(data.vault,data.currentStrikeAsset.address)
}



// 是否触发更新链上的签名  put的情况是相反的 要额外处理
var  checkUpdateGignature=async (vault,underlyingAsset)=>{
   console.log("入口参数",vault,underlyingAsset)
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
    //处理对应的数据
    let strike=await handleStrikeAsset()
    let premium=await handlePremiumAsset() 
    let liquidateModes= handleLiquidation()
   //进行712签名
    let signatureInfo={
        orderType:1,
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
    console.log("signatureInfo",signatureInfo)
    let signatureResponse= await sign712OrderApi(axiosStore.chainId,axiosStore.currentContractData["OptionModule"],signatureInfo)
    console.log("signature",signatureResponse)
    if(!signatureResponse.status){
       console.error("用户拒绝签名",signatureResponse)
       return
   }

   if(currentTimestamp.gt(timestamp) && total.gt(BigNumber.from("0"))){
        //触发上链签名
       let resetSigature= await  setSigatureLockApi(_vault,0,underlyingAsset,currentTimestamp)
       if(!resetSigature.message.status){
          console.error("取消老订单失败")
          return
       }
   }
   //更新签名到中心化服务器

    let response=await storeSingature(signatureInfo,signatureResponse.message)
    if(!response){
       console.error("存储数据到中心化服务器失败")   
    }
    //流程完成 弹窗
   
}



//因为是put需要额外处理
//处理行权资产  //因为行权资产跟权力金资产一样 所以这里做同步处理
var handleStrikeAsset=async ()=>{
    //put情况下 行权资产是eth
   let strikeAssets=[data.currentStrikeAsset.address]
    /**
    *  1usdc价格*eth的精度 / 行权价
   */  
   let underlyingAsset=data.currentUnderlyingAsset //usdc
   console.log(underlyingAsset,"当前抵押资产")
   let underlyingAssetPrice=ethers.utils.parseUnits("1",18) //获取usdc的价格
   let strikePrice=ethers.utils.parseUnits(data.currentStrikePrice.price,18) //行权价
   // 1usdc价格*eth的精度 / 行权价
   let amount=underlyingAssetPrice.mul(ethers.utils.parseUnits("1",data.currentStrikeAsset.decimals)).div(strikePrice)
   let strikeAmounts=[amount]
    console.log("行权参数",strikeAssets,strikeAmounts,data.currentUnderlyingAsset)
    return {
        strikeAssets,
        strikeAmounts
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
   //-----------------------------
   /**   
    * //2步
    * 1usdc(数量a)*usdc的价格(b)*期权费(usd)(c) / 行权价(usd)(d) =1usdc 该支付的期权费  p
    * 
    * p*usdt的精度(e)/usdt(价格)(f)=1usdc期权费 转换成的 usdt数量
    * 
    * //单算
    * 1usdc(数量)*usdc的价格*期权费 * usdc的精度 / (usdt的价格*行权价格) =1usdc 期权费该支付的usdt数量
    *
    */
   let underlyingAsset=data.currentUnderlyingAsset
   let underlyingAssetPrice=ethers.utils.parseUnits("1",18) //获取usdc的价格
   console.log("当前抵押资产 权力金",underlyingAsset,underlyingAssetPrice)

   let value=BigNumber.from("0")  //权力金费用 带18精度
    if(data.currentPremiumFee.eq(BigNumber.from("0"))){
       value=ethers.utils.parseUnits(`${data.premiumPrice}`,18)   
    }else{
        //currentPremiumFee 已经带精度了
        value=data.currentPremiumFee 
    }
   let strikePrice=ethers.utils.parseUnits(data.currentStrikePrice.price,18)   //行权价 带精度
   let underlyPremiumUsd=underlyingAssetPrice.mul(value).div(strikePrice)  //1usdc 该支付的期权费
    console.log("premium,期权费,行权价,该支付的期权费",value,strikePrice,underlyPremiumUsd)
    //把期权费转换成usdt的数量
    premiumAssets.forEach((item,index)=>{
          //把该支付的期权费带上精度 
          let amount=underlyPremiumUsd.mul(ethers.utils.parseUnits("1",decimals[index])).div(premium[index])
          premiumFees.push(amount)
    })
    console.log("期权费列表",premiumAssets,premiumFees)

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
var storeSingature=async ()=>{
    let premium="0"  
    if(data.currentPremiumFee.toNumber()==0){
        premium=String(data.premiumPrice)
    }else{
        premium=(data.currentPremiumFee.div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100)
    }
  let orederInfo={
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
  await createOrderApi(orederInfo)
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

.lock-token-content{
    margin-top: 24px;
     .select-content{
        margin-top: 8px;
        border-radius: 8px;
        border: 1px solid var(--component-border);
        width: 100%;
        position: relative;
        display: flex;
        .item{
            height: 48px;
            width: 50%;
            border-radius: 8px;
            padding: 16px 12px;
            &.active{
                border: 2px solid var(--bg-color-container-active);
            }
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
        }
    }
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