<template>
    <div class="protfolio">
      <a-tabs class="protfolio-tabs" v-model:activeKey="data.activeKey">
        <!-- listing -->
        <a-tab-pane key="listing" tab="My Listings">
          <div class="contains" v-if="false">
            <pendingOrder v-for="(item) in 5" :key="item"></pendingOrder>
          </div>    

          <writeOptionEmpty :isSignal="false" :text="`You don't currenty have options`" class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>
        <!-- options -->
        <a-tab-pane key="options" tab="My Options" force-render >
          <div class="select" v-if="true">
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
           <div class="contains padding" v-if="true">
              <submitOrder v-for="(item) in 2" :key="item"  @liquidation="liquidationTx"></submitOrder> 
            </div>   
            <!-- empty -->
            <buyOptionEmpty class="empty"  v-else></buyOptionEmpty>   
        </a-tab-pane>      
      </a-tabs>
      <!-- dialog -->
      <protfolioFilter v-model:isOpen="data.isOpenSelect"></protfolioFilter>
      <protfolioSort v-model:isOpen="data.isOpenSort"></protfolioSort>
      <liquidation v-model:isOpen="data.isOpenLiquidation"></liquidation>
    </div>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"  
import submitOrder from "@/components/protfolio/submitOrder.vue"
import protfolioFilter from "@/components/protfolio/protfolioFilter.vue"
import protfolioSort from "@/components/protfolio/protfolioSort.vue"
import liquidation from "@/components/protfolio/liquidation.vue"
import buyOptionEmpty from "@/components/utils/buyOptionEmpty.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import {liquidateOption} from "@/callData/bundler/optionModule"
import {sendTxToBundler,getBundlerTxResult} from "@/plugin/bundler"
import {getMyOfferApi} from "@/api/protfolio"
import {useAxiosStore} from "@/pinia/modules/axios"
import {reactive,computed,watch,onMounted} from "vue"
const axiosStore= useAxiosStore()
  let data=reactive({
    activeKey:"listing",
    isOpenSelect:false,
    isOpenSort:false,
    isOpenLiquidation:false,
    orderList:[{
        
    }],
    btnLock:false,//按钮锁
  })

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
  await getOrderList()
}
//--------数据查询-----------
var getOrderList=async ()=>{
   let orderResponse= await getMyOfferApi(axiosStore.chainId,axiosStore.currentAccount)
   console.log("orderResponse",orderResponse)
}
//-------------上链请求-----------------------
//清算交易
  var liquidationTx=async ()=>{
    console.log(121123223)
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