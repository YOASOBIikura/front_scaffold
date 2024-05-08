<template>
    <div class="protfolio">
      <a-tabs class="protfolio-tabs" v-model:activeKey="data.activeKey" @change="tabChange">
        <!-- listing -->
        <a-tab-pane key="listing" tab="My Listings">
          <div class="contains" ref="offerContainsRef" v-if="data.offerList.length > 0 " @scroll="pandingOrderHandleScroll">
            <pendingOrder v-for="(item) in data.offerList" :key="item" :orderData="item"></pendingOrder>
          </div>    

          <writeOptionEmpty :isSignal="3" :text="`You don't currenty have options`" class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>
        <!-- options -->
        <a-tab-pane key="options" tab="My Options" force-render >
          <div class="select" v-if="true" >
                  <span class="text">{{ data.orderTotal }} Options</span>
                  <div class="list">
                    <div class="list-one"> 
                      <img  src="@/assets/images/selecttwo.png" alt="" @click="selectCondition">
                    </div>
                    <div class="list-two">
                    <img  src="@/assets/images/selectone.png" alt="" @click="sortCondition">
                    </div>
                  </div>
          </div>
           <div class="contains padding" ref="orderContainsRef" v-if="data.orderList.length>0" @scroll="submitOrderScroll">
              <submitOrder 
              v-for="(item,index) in data.orderList" 
              :key="index" :dataInfo="item" 
              :priceList="data.priceList" 
              @liquidate="liquidate"
 
              ></submitOrder> 
            </div>   
            <!-- empty -->
            <writeOptionEmpty :isSignal="2" :text="`You don't currenty have options`" class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>      
      </a-tabs>
      <!-- dialog -->
      <protfolioFilter 
         v-model:isOpen="data.isOpenSelect"
         @confirm="optionConfirm"
         @reset="optionReset"
      ></protfolioFilter>
      <protfolioSort 
         v-model:isOpen="data.isOpenSort"
         @confirm="statusConfirm"
         @reset="statusReset"         
         ></protfolioSort>
      <liquidation 
      v-model:isOpen="data.isOpenLiquidation"
      :dataInfo="data.currentOrder"
      :priceList="data.priceList"
      @liquidate="exerciseLiquidate"
      ></liquidation>
    
    </div>
    <singlestepLoading 
          v-model:isOpen="data.transferLoadingData.open"
          :status="data.transferLoadingData.status"
          :hash="data.transferLoadingData.hash"
          :nextPage="data.transferLoadingData.nextPage"
          :transferName="data.transferLoadingData.transferName"
    ></singlestepLoading>
    <a-spin v-if="data.loading " class="aSpin" tip="Loading..." :delay="100"> </a-spin>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"  
import submitOrder from "@/components/protfolio/submitOrder.vue"
import protfolioFilter from "@/components/protfolio/protfolioFilter.vue"
import protfolioSort from "@/components/protfolio/protfolioSort.vue"
import liquidation from "@/components/protfolio/liquidation.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import singlestepLoading from "@/components/utils/singlestepLoading.vue"
import {liquidateOption} from "@/callData/bundler/optionModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {getOfferApi,getOrderApi} from "@/api/protfolio"
import {useAxiosStore} from "@/pinia/modules/axios"
import {reactive,computed,watch,onMounted,ref} from "vue"
import { BigNumber, ethers } from "ethers"
import {getPriceByPriceOracleApi,getPriceByServiceApi} from "@/api/priceOracle"
import {getVaultToSaltR} from "@/apiHandle/vault"
import {getOptionOrderExistR} from "@/apiHandle/optionFacet"
import {getMulTokenBalance} from "@/apiHandle/token"
import {getUnderlyTotal} from "@/callData/multiCall/optionFacet"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import { message } from "ant-design-vue"
import { useRoute } from "vue-router"
const axiosStore= useAxiosStore()
const route = useRoute();
  let data=reactive({
    activeKey:"listing", // options / listing
    isOpenSelect:false,
    isOpenSort:false,
    isOpenLiquidation:false,
    offerList:[],
    btnLock:false,//按钮锁
    orderPage: 1,
    offerPage: 1,
    scrollOfferLoadLock: false, // 滚动加载锁
    scrollOrderLoadLock: false, // order订单的滚动加载锁
    //------------
    orderList:[],//订单列表 
    orderTotal: 0, // 所有订单总数
    priceList:{},//价格列表
    priceAddressList:[],//价格地址列表,
    currentOrder:{},
    //筛选条件
    filterType:[],
    filterStatus:[],
    filterSort:0,
    //---
    loading:false,

    transferLoadingData: {
        open: false,
        status: "pending",
        hash: "",
        nextPage: {
            path: "/protfolio",
            query: {},
            name: "my protfolio"
        },
      transferName: "Liquidate"
    }
  })
const offerContainsRef = ref(null);
const orderContainsRef = ref(null);
//----------------------------------
//条件筛选
var selectCondition=()=>{
      data.isOpenSelect=true
}
//排序
var sortCondition=()=>{  
  data.isOpenSort=true
}
//操作栏确认
var optionConfirm=async (_filterType,_filterStatus)=>{
  data.isOpenSelect=false
   data.filterStatus=_filterStatus
   data.filterType=_filterType
   data.loading=true
   await getOrderList()
   data.loading=false
}

var optionReset=async(_filterType,_filterStatus)=>{
  data.isOpenSelect=false
   data.filterStatus=_filterStatus
   data.filterType=_filterType
   data.loading=true
   await getOrderList()
   data.loading=false
}

//排序栏确认
var statusConfirm=async (value)=>{
  data.isOpenSort=false
  data.filterSort=value
   console.log(value)
   data.loading=true
   await getOrderList()
   data.loading=false
}

var statusReset=async (value)=>{
   data.isOpenSort=false
   data.filterSort=value
   console.log(value)
   data.loading=true
   await getOrderList()
   data.loading=false

}
// 滚动加载监听滚动条
var pandingOrderHandleScroll = () => {
  if(data.scrollOfferLoadLock){
    return;
  }
  const container = offerContainsRef.value
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    data.offerPage += 1;
    getOfferList(data.offerPage)
  }
}

var submitOrderScroll=()=>{
  if(data.scrollOrderLoadLock){
    return;
  }
  const container = orderContainsRef.value
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    data.orderPage += 1;
    getOrderList(data.orderPage)
  }
}

var tabChange=async ()=>{
   await initContent()
}


var getDate=(date)=>{
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
}

var timeTransformDateWithoutHour = (time, split= '', isUTC = false) => {
    let monthEnglish = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let date = new Date(time);
    if(isUTC) {
      return date.getUTCDate() + split + monthEnglish[date.getUTCMonth()] + split + (date.getUTCFullYear()).toString().substring(2);
    }
    return date.getDate() + split + monthEnglish[date.getMonth()] + split + (date.getFullYear()).toString().substring(2);
}
var liquidate=(orderInfo)=>{
  data.currentOrder=orderInfo
  data.isOpenLiquidation=true
}
//-------------初始化-----------------
onMounted(async ()=>{
   data.activeKey = route.query.type ? route.query.type : "listing";
   await init()
})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})

var init=async()=>{
  await  initContent()
}

var initContent=async ()=>{
  if(axiosStore.isConnect==1){
      return
  }
  data.loading=true
    if(data.activeKey=="options"){
      await getOrderList()
    }else{
      await getOfferList()
    }
    data.loading=false
}
var exerciseLiquidate=async (orderInfo,liquidateType,incomeAmount)=>{
  await liquidationTx(orderInfo,liquidateType,incomeAmount)
}
//--------数据查询-----------
//offer
var getOfferList=async (page = 1)=>{
   let orderResponse= await getOfferApi("",axiosStore.chainId,axiosStore.currentAccount,page);
   let offerList = [];
     //处理used
    let totalList=[]
    orderResponse?.data?.forEach(item=>{
        let obj={
          writerVault:item["writer_vault"],
          orderType:item["option_type"],
          underlyingAsset:item["underlying_asset"]
        }
        totalList.push(obj)
    })
    let unUsedList= await getUnderlyAssetTotal(totalList)
   //处理数据
   orderResponse?.data?.forEach((item,index) => {
    let netWork=""
    switch(item["chain_id"]){
      case "137":netWork="polygon";break;
      case "1":netWork="ethereum";break;
      case "42161":netWork="arbitrum";break;
    }
    // 处理可还款资产
    let premiumAssets = [];
    item["premium_assets"].forEach((token) => {
        premiumAssets.push(JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(token))))  
    });
    //处理清算方式
    let liquidate=""
    switch(Number(item["liquidate_modes"][0])){
        case 0:
        liquidate="Cash Settlement/Asset Delivery";
        break;
        case 1:
        liquidate="Cash Settlement"
          break;
        case 2:
        liquidate="Asset Delivery"
          break     
    }
    let  underlyingAsset= JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(item.underlying_asset)));
    let  strikeAsset=JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(item.strike_assets[0])))
    let  total=BigNumber.from(item.total).div(ethers.utils.parseUnits("1",underlyingAsset.decimals-underlyingAsset.decimalsShow)).toNumber()/10 ** underlyingAsset.decimalsShow
    // let  used=BigNumber.from(item.used).div(ethers.utils.parseUnits("1",underlyingAsset.decimals-2)).toNumber()/100
    let unUsed=BigNumber.from("0")
    if(BigNumber.from(unUsedList[index]).eq(BigNumber.from("0"))){
      unUsed=total
    }else{    
      unUsed=BigNumber.from(unUsedList[index]).div(ethers.utils.parseUnits("1",underlyingAsset.decimals- underlyingAsset.decimalsShow)).toNumber()/10 ** underlyingAsset.decimalsShow
    }
    let obj = {
      id:item.id,
      orderType:item["option_type"]==0?'call':'put',
      total:total,
      netWork: netWork,
      strikePrice: item.strike_price,
      premiumAssets: premiumAssets,
      createDate: item.create_time*1000,
      expirationDate: item.expiration_date*1000,
      unUsed:unUsed,
      strikeAsset:strikeAsset,
      underlyingAsset: underlyingAsset,
      liquidate: liquidate,
      premiumPrice: item.option_premium ?  item.option_premium: item.derbit_price, // 期权费

    }
    console.log(obj);
    offerList.push(obj);
   });
   if(page == 1){
    data.offerList = offerList;
   } else {
    data.offerList = data.offerList.concat(offerList);
   }
   if(offerList.length == 0){
      data.offerPage -= 1;
      data.scrollOfferLoadLock = true;
   }

}

//订单
var getOrderList=async (page = 1)=>{
  // _optionId,_chainId,_wallet
  let orderListResponseRaw=  await getOrderApi("",axiosStore.chainId,axiosStore.currentAccount,data.filterType,data.filterStatus,data.filterSort,page);
  let orderListResponse=orderListResponseRaw.data||[]
  //处理价格列表
  let priceAddressList=new Set()
  orderListResponse?.forEach(item=>{
    priceAddressList.add(String(item["underlying_asset"]).toLocaleLowerCase())
    priceAddressList.add(String(item["strike_asset"]).toLocaleLowerCase())
  })
  priceAddressList=Array.from(priceAddressList)
 await getPriceByService(priceAddressList)
  //查看订单是否存在
  let orderExist=[]
  orderListResponse?.forEach(item=>{
      let obj={
        orderId:item["order_id_contract"],
        orderType:item["option_type"],
      }
      orderExist.push(obj)
  })  

  let orderExistResult= await getOptionOrderExist(orderExist)
 //处理普通数据
  let orderList=[]
  orderListResponse?.forEach((item,index)=>{
      let underlyingAsset=axiosStore.getTokenByAddress(item["underlying_asset"])
      let strikeAsset=axiosStore.getTokenByAddress(item["strike_asset"])

      let expirationDate=Number(item["expiration_date"])
      let date=timeTransformDateWithoutHour(expirationDate*1000)
      let days=`0 Days`
      if(orderExistResult[index]){   
         days=getDate(expirationDate)
      }

      // 当前账号是买家还是卖家
      let isCurrentHolder=String(axiosStore.currentAccount).toLocaleLowerCase() == String(item["holder_wallet"]).toLocaleLowerCase()
      let obj={
         id:item["id"],
         orderStatus:orderExistResult[index],
        //  orderStatus:true,
         expirationDate:expirationDate,
         days:days,
         date:date,
         orderId:item["order_id_contract"],
         chainName:axiosStore.remark.chainName,
         chainIcon:axiosStore.remark.chainIcon,
         orderType:item["option_type"],
         orderTypeShow:item["option_type"]==0?'Call':'Put',
         underlyingAsset:underlyingAsset,
         strikeAsset:strikeAsset,
         chainId:item["chain_id"],
         underyingAmount:BigNumber.from(item["underlying_amount"]),
         underyingAmountShow:BigNumber.from(item["underlying_amount"]).div(ethers.utils.parseUnits("1",underlyingAsset.decimals-underlyingAsset.decimalsShow)).toNumber()/10 ** underlyingAsset.decimalsShow,
         strikeAmount:BigNumber.from(item["strike_amount"]),
         writer:item["writer"],
         writerWallet:item["writer_wallet"],
         holder:item["holder"],
         holderWallet:item["holder_wallet"],
         liquidateMode:item["liquidate_mode"],
         recipient:item["recipient"],
         isCurrentHolder:isCurrentHolder
      }
      console.log(obj,"objjjsd")
      orderList.push(obj)
  });
  //获取币种市场价格
  data.orderTotal = orderListResponseRaw.total;
   if(page == 1){
    data.orderList=orderList
   } else {
    data.orderList = data.orderList.concat(orderList);
   }
   if(orderList.length == 0){
      data.orderPage -= 1;
      data.scrollOrderLoadLock = true;
   }

}




//-------------上链请求-----------------------
//清算交易
var liquidationTx=async (orderInfo,liquidateType,incomeAmountValue)=>{
    data.transferLoadingData.open = true;
    data.transferLoadingData.status = "pending";
    console.log("orderInfo",orderInfo)
    //------------数据上链-------------------------
    data.isOpenLiquidation=false  
    let orderId=orderInfo.orderId
    let orderType=orderInfo.orderType
    let slippage=ethers.utils.parseEther("1")
    let incomeAmount=0

    let ops=[]
    let pythTokenName=[]
    //------------处理行权数据--------------------
   if(liquidateType==2){
    //利差清算
    ops.push(liquidateOption(orderType,orderId,2,incomeAmountValue,slippage))
    //处理pyth币种问题
    pythTokenName.push(orderInfo.strikeAsset.name)
    pythTokenName.push(orderInfo.underlyingAsset.name)
    console.log(pythTokenName,"------sss")
  }else if(liquidateType==1){
    //检查0号vault资产是否足够 买家
    let strikeAmount=orderInfo.underyingAmount.mul(orderInfo.strikeAmount).div(ethers.utils.parseUnits("1",orderInfo?.underlyingAsset?.decimals))
    let isCheck= await   checkBuyerBalance(orderInfo.recipient,orderInfo.strikeAsset.address,strikeAmount)
    if(!isCheck){
       message.warning("vault balance is insufficient to pay strikeAmount")
       data.transferLoadingData.status = "faild";
       return
    }
    //实物交割
    ops.push(liquidateOption(orderType,orderId,1,incomeAmount,slippage))
  }else{
    //不行权
    ops.push(liquidateOption(orderType,orderId,0,incomeAmount,slippage))
  }

  // ---------------处理哪个行权-------------------------
  let vault=""
  if(!orderInfo.isCurrentHolder && liquidateType==3){
    //处理卖家行权
    vault=orderInfo.writer
  }else{
    //处理买家行权
    vault=orderInfo.holder
  }

  let salt= await getVaultToSalt(vault)
  
  let bundlerHash= await sendTxToBundler(vault,salt,ops,pythTokenName) 
  console.log("bundlerHash",bundlerHash)



  //接触按钮锁
  if(!bundlerHash.status){
      data.transferLoadingData.hash = "";
      data.transferLoadingData.status = "faild";
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
  if(!result.status){
      data.btnLock=false
       data.transferLoadingData.status = "faild";
       data.transferLoadingData.hash = result.message;
      return
  }
  data.transferLoadingData.status = "success";
  data.transferLoadingData.hash = result.message;
  //修改当前订单状态
  orderInfo.orderStatus=false
}


var getVaultToSalt=async (vault)=>{
   return await getVaultToSaltR(vault)
}
var getPrice=async (assetList)=>{
  for(let i=0;i<assetList.length;i++){
    let lowerAddress=String(assetList[i]).toLocaleLowerCase()
    if(!data.priceAddressList.includes(lowerAddress)){
      let underlyingAssetPrice= await  getPriceByPriceOracleApi(assetList[i],axiosStore.remark.usdToken)
      data.priceList[assetList[i]]=underlyingAssetPrice?.message?.price || BigNumber.from("0")
      data.priceAddressList.push(lowerAddress)
    }
  }


  console.log("价格列表",data.priceAddressList,data.priceList)
}

var getPriceByService=async (assetList)=>{
  for(let i=0;i<assetList.length;i++){
    let lowerAddress=String(assetList[i]).toLocaleLowerCase()
    if(!data.priceAddressList.includes(lowerAddress)){
      let underlyingAssetPrice=  await getPriceByServiceApi(axiosStore.chainId,assetList[i])
      data.priceList[assetList[i]]=BigNumber.from(underlyingAssetPrice?.data?.a_price)  || BigNumber.from("0")
      data.priceAddressList.push(lowerAddress)
    }
  }



}

//查看当前订单是否存在
var getOptionOrderExist=async (dataList)=>{
    if(dataList.length==0){
      return []
    }
    return await getOptionOrderExistR(dataList)
}

//检查买家0号vault余额是否足够
var checkBuyerBalance=async (account,asset,strikeAmount)=>{
    let accountList=[account]
    let dataList=[asset]
    let balance=  await getMulTokenBalance(accountList,dataList)
    console.log(balance)
    if(balance[0].gte(strikeAmount)){
           return true
    }

    return false
}

//买单总余额(剩余)
var  getUnderlyAssetTotal=async (dataList)=>{
    let multiCallData=[]
    dataList?.forEach((item,index)=>{
        multiCallData.push(getUnderlyTotal(`${index}`,item.writerVault,item.orderType,item.underlyingAsset))
    })
    let multiCallResponse=await multiCallObjR(multiCallData)
    console.log("multiCallResponse",multiCallResponse)   
    let result=[]
    for(let key in multiCallResponse){
        result.push(multiCallResponse[key]?.total)
    }
    return result
}



</script>

<style lang="less" >
  .protfolio{
     width: 100%;
     padding: 56px 0px 50px; 
     box-sizing: border-box;
     height: 100%;
     .protfolio-tabs{
        width: 100%;
        height: 100%;
        .ant-tabs-nav{
          padding:0 16px;
          box-sizing: border-box;
        }
        .ant-tabs-content{
          width: 100%;
          height: 100%;
          .contains{
            width: 100%;
            height: 100%;
            overflow-y:auto ;
            padding: 0 16px;
            box-sizing: border-box;        
          }
          .padding{
            padding-bottom: 50px;
          }
        }
     }
     .select{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        box-sizing: border-box;
        .text{
          font-size: 16px;
          color: var(--text-color-primary);
        }
        .list{
          display: flex;
          flex-direction: row;
          align-items: center;
          .list-one{
            width: 32px;
            height: 32px;
            border-radius: 50%;     
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-color-secondarycontainer);
            img{
              width: 16px;
              height: 16px;
            }
          }
          .list-two{
            width: 32px;
            height: 32px;
            border-radius: 50%;  
            margin-left: 9px;   
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;        
            background-color: var(--bg-color-secondarycontainer);
            img{
              width: 16px;
              height: 16px;
            }

          }
        }
      }
      .empty{
        width: 100%;
        height: auto;
        margin-top: 50%;
        transform: translateY(-50%);
      }

  }

</style>