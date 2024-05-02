<template>
    <div class="protfolio">
      <a-tabs class="protfolio-tabs" v-model:activeKey="data.activeKey">
        <!-- listing -->
        <a-tab-pane key="listing" tab="My Listings">
          <div class="contains" ref="containsRef" v-if="data.orderList.length > 0 " @scroll="pandingOrderHandleScroll">
            <pendingOrder v-for="(item) in data.orderList" :key="item" :orderData="item"></pendingOrder>
          </div>    

          <writeOptionEmpty :isSignal="3" :text="`You don't currenty have options`" class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>
        <!-- options -->
        <a-tab-pane key="options" tab="My Options" force-render >
          <div class="select" v-if="true" >
                  <span class="text">9 Options</span>
                  <div class="list">
                    <div class="list-one">
                      <img  src="@/assets/images/selecttwo.png" alt="" @click="selectCondition">
                    </div>
                    <div class="list-two">
                    <img  src="@/assets/images/selectone.png" alt="" @click="sortCondition">
                    </div>
                  </div>
          </div>
           <div class="contains padding" v-if="true" @scroll="submitOrderScroll">
              <submitOrder v-for="(item) in 2" :key="item"  @liquidation="liquidationTx"></submitOrder> 
            </div>   
            <!-- empty -->
            <writeOptionEmpty :isSignal="2" :text="`You don't currenty have options`" class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>      
      </a-tabs>
      <!-- dialog -->
      <protfolioFilter v-model:isOpen="data.isOpenSelect"></protfolioFilter>
      <protfolioSort v-model:isOpen="data.isOpenSort"></protfolioSort>
      <liquidation v-model:isOpen="data.isOpenLiquidation"></liquidation>
    
    </div>

    <a-spin v-if="data.loading " class="aSpin" tip="Loading..." :delay="100"> </a-spin>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"  
import submitOrder from "@/components/protfolio/submitOrder.vue"
import protfolioFilter from "@/components/protfolio/protfolioFilter.vue"
import protfolioSort from "@/components/protfolio/protfolioSort.vue"
import liquidation from "@/components/protfolio/liquidation.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import {liquidateOption} from "@/callData/bundler/optionModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {getOrderApi} from "@/api/protfolio"
import {useAxiosStore} from "@/pinia/modules/axios"
import {reactive,computed,watch,onMounted,ref} from "vue"
import { BigNumber, ethers } from "ethers"
const axiosStore= useAxiosStore()
  let data=reactive({
    activeKey:"listing",
    isOpenSelect:false,
    isOpenSort:false,
    isOpenLiquidation:false,
    orderList:[],
    btnLock:false,//按钮锁
    orderPage: 1,
    scrollLoadLock: false, // 滚动加载锁


    //---
    loading:false
  })
const containsRef = ref(null)

//条件筛选
var selectCondition=()=>{
      data.isOpenSelect=true
}
//排序
var sortCondition=()=>{
  data.isOpenSort=true
}
//-------------初始化-----------------
onMounted(async ()=>{
   await init()
})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})

var init=async()=>{
  data.loading=true
  await getOrderList(data.orderPage)
  data.loading=false
}
//--------数据查询-----------
var getOrderList=async (page = 1)=>{
   let orderResponse= await getOrderApi("",axiosStore.chainId,axiosStore.currentAccount,page);
   let orderList = [];
   orderResponse?.data?.forEach((item) => {
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
    let  total=BigNumber.from(item.total).div(ethers.utils.parseUnits("1",underlyingAsset.decimals-2)).toNumber()/100
    let  used=BigNumber.from(item.used).div(ethers.utils.parseUnits("1",underlyingAsset.decimals-2)).toNumber()/100

    
    let obj = {
      id:item.id,
      orderType:item["option_type"]==0?'call':'put',
      total:total,
      netWork: netWork,
      strikePrice: item.strike_price,
      premiumAssets: premiumAssets,
      createDate: item.create_time*1000,
      expirationDate: item.expiration_date*1000,
      used:used,
      strikeAsset:strikeAsset,
      underlyingAsset: underlyingAsset,
      liquidate: liquidate,
      premiumPrice: item.option_premium ?  item.option_premium: item.derbit_price, // 期权费

    }
    orderList.push(obj);
   });
   if(page == 1){
    data.orderList = orderList;
   } else {
    data.orderList = data.orderList.concat(orderList);
   }
   if(orderList.length == 0){
      data.orderPage -= 1;
      data.scrollLoadLock = true;
   }
   console.log(page, data.orderList, orderList);

}

// 滚动加载监听滚动条
var pandingOrderHandleScroll = () => {
  if(data.scrollLoadLock){
    return;
  }
  const container = containsRef.value
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    data.orderPage += 1;
    getOrderList(data.orderPage)
  }
}

var submitOrderScroll=()=>{
    console.log("滚动22")
}



//-------------上链请求-----------------------
//清算交易
  var liquidationTx=async ()=>{
      data.isOpenLiquidation=true  
      let ops=[]
  //_orderType,_orderID,_type,_incomeAmount,_slippage
  ops.push(liquidateOption())
  console.log(maxSalt,"---")
  let bundlerHash= await sendTxToBundler(maxSaltVault,salt,ops) 
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
        height: 100%;
      }

  }

</style>