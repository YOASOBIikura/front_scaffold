
<template>
    <div class="marketPlace">
        <a-menu v-model:selectedKeys="data.currentOrderType" mode="horizontal" :items="data.orderTypeList" @select="orderTypeChange"/>
        <div class="order-content">
            <!-- 价格提示 -->
            <!-- <div class="price-tips-content">
                I expect ETH $3,000 -> $3,100 in 6d
            </div> -->

            <!-- 选择期权币种 -->
            <div class="select-option-token-content">
                <selectCoin 
                    :dataList="data.underlyingAssetList" 
                    v-model:value="data.currentUnderlyingAsset"
                    @change="underlyingChange"
                    theme="white"
                ></selectCoin>
            </div>



            <!-- 选择行权日期和行权价格 -->
            <div class="option-select-content">
                <div class="option-card">
                    <div class="title">Expiry Date</div>
                    <div>
                    <swiperSelect            
                        :changeTimeout="500"
                        :initialSlide="data.currentExpiryValue"
                        :options="data.expiryParamData" @selectChange="expiryDateChange"></swiperSelect>
                    </div>
                </div>
                <div class="option-card">
                    <div class="title">Strike Price</div>
                     <div>
                    <swiperSelect         
                        :changeTimeout="500"
                       :initialSlide="data.currentStrikeValue"
                        :options="data.strikeParamData" @selectChange="strikeChange"></swiperSelect>
                    </div>
                </div>
            </div>

            <!-- 选择单子类型 -->
            <div class="select-list-switch">
                <select-switch 
                    :switchList="data.listingList" 
                    v-model:value="data.currentListing"
                    theme="black"
                    @change="listingChange"
                >
                  <template></template>
                </select-switch>
            </div>
            <!-- 表格显示 -->
            <!-- 所有订单 -->
             <listing-table  
                    v-if="data.orderList.length>0"
                    :dataSource="data.orderList" 
                    :columns="data.orderTitle"
                    :listingType="data.currentListing"
                >
                </listing-table>  

              <write-option-empty 
                class="empty" 
                v-if="isShowWriteEmpty"
                :text="'Let’s start writing your options'" 
                :asset="data.currentUnderlyingAsset.name" 
                :orderType="data.currentOrderType[0]"  
                ></write-option-empty>
        </div>
    </div>

    <a-spin v-if="data.loading" class="aSpin" tip="Loading..." :delay="100"> </a-spin>
</template>

       
<script setup>
import { ref, reactive,onMounted,watch,computed } from "vue"
import selectSwitch from "@/components/utils/selectSwitch.vue"
import selectCoin from "@/components/utils/selectCoin.vue"
import swiperSelect from "@/components/utils/swiperSelect.vue"
import listingTable from "@/components/marketPlace/listingTable.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import {useAxiosStore} from "@/pinia/modules/axios"
import {getMarketPriceApi,getMarketOfferApi} from "@/api/marketPrice"
import { BigNumber, ethers } from "ethers"
const axiosStore= useAxiosStore()
const data=reactive({
     loading:false,
     orderTypeList:[
        {
            key: 'call',
            label: 'Call option valuts',
            title: 'Call option valuts',
        },
        {
            key: 'put',
            label: 'Put option vaults',
            title: 'Put option vaults'
        }
     ],  //订单类型
     currentOrderType:["call"],//当前订单类型
     expiryParamData:[],//到期日列表
     currentExpiryValue:0,//日期值
     strikeParamData:[],//行权价列表
     currentStrikeValue:0,//行权价参数值
     currentListing: "All",//监听列表 全部还是个人
     listingList:[ {key: 'All', label: 'All Listings'},{key: 'My', label: 'My Listings'}],
     orderList:[
        //   {
        //   owner: "0x3...dfa",
        //   strikePrice: "3100",
        //   price: "2000",
        //   deribitPrice: "2500",
        //   amount: 10,
        //   totalAmount: 500,
        //   payWith: ["USDC", "USDT"], // TODO 
        //   accept: "Cash Settlement",
        //   KYT: "Passed"
        // }
     ], //订单列表
     orderTitle: [
        { title: "Owner" ,dataIndex: "owner", key: "owner"},
        { title: "Strike Price",dataIndex: "strikePrice",key: "strikePrice"},
        { title: "Price", dataIndex: "price", key: "price"},
        { title: "Deribit Price", dataIndex: "deribitPrice", key: "deribitPrice"},
        { title: "Amount", dataIndex: "amount", key: "amount"},
        { title: "Pay With", dataIndex: "payWith", key: "payWith"},
        { title: "Accept", dataIndex: "accept", key: "accept"},
        { title: "KYT", dataIndex: "KYT", key: "KYT"},
        { title: "", dataIndex: "", key: "action", fixed: "right", width: 16}
     ], //订单数据列表
     //---------数据----------------
     underlyingAssetList:[], //抵押资产数据
     currentUnderlyingAsset:{},//当前抵押资产
})
//-------------计算属性------------
var isShowWriteEmpty=computed(()=>{
     return data.orderList.length==0 
})
//-------------初始化----------------------
onMounted(async()=>{
     await init()
}) 
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})
var  init=async ()=>{
    if(axiosStore.isConnect==1){
      return
    }
    //处理抵押资产列表
    let underlyingAssetData=axiosStore?.optionBusiness?.underlyingAssets||[]
    let underlyingAssetList=JSON.parse(JSON.stringify(underlyingAssetData))
    data.currentUnderlyingAsset=underlyingAssetList[0]
    data.underlyingAssetList=underlyingAssetList
    data.loading=true
    //获取参数
    await getParamData()
    data.loading=false
}

//-------------普通方法------------
var underlyingChange=async (item)=>{
    console.log(item,data.currentUnderlyingAsset,"====ss")
    data.loading=true
    await getParamData()
    data.loading=false
}

var expiryDateChange=async (item)=>{
    data.currentExpiryValue=item
    let strikeParamData=[]
    let strikeData=data.expiryParamData[item].priceList||[]
    strikeData?.forEach(item=>{
        strikeParamData.push(item)
    })
    data.strikeParamData=strikeParamData
    //获取订单 
    await getOrderList()
   console.log(item,"日期选择")
}
var strikeChange=async (item)=>{
    data.currentStrikeValue=item
   console.log(item,"行权价选择")
    //获取订单
    await getOrderList()
}
var listingChange=async (item)=>{
   console.log(item,"listing",data.currentListing)
//    data.currentListing=item.key
    //获取订单
    await getOrderList()

}

var orderTypeChange=async (item)=>{
     console.log("小姐姐",item,data.currentOrderType)
     data.loading=true
     await getParamData()
     //获取订单
     data.loading=false
}

//---------服务器数据-----------------
//获取参数
var getParamData=async ()=>{
    data.expiryParamData=[]
    data.strikeParamData=[]
    let paramData=await getMarketPriceApi(axiosStore.chainId,data.currentOrderType[0],data.currentUnderlyingAsset.name)
    paramData=paramData?.data||[]
    let expiryParamData=[]
    let strikeParamData=[]
    paramData?.forEach((item,index)=>{
           let priceList=[]
           item["strike_price"]?.forEach((child,cIndex)=>{
                 let cObj={
                    "value": String(cIndex),
                    "name":String(child)
                 }
                 priceList.push(cObj)
           })

          let obj={
              value: String(index),
              name:item["option_date"],
              priceList:priceList
          }
          //当前日期有行权价才加入列表
          if(priceList.length>0){
            expiryParamData.push(obj)
          }

    })
    let strikeData=expiryParamData[0]?.priceList||[]
    strikeData?.forEach(item=>{
        strikeParamData.push(item)
    })
    data.currentStrikeValue=0
    data.currentExpiryValue=0
    data.expiryParamData=expiryParamData
    data.strikeParamData=strikeParamData

    await getOrderList()
}

//获取订单
var getOrderList=async ()=>{
     let strikePrice=data.expiryParamData[data.currentExpiryValue]?.name
     let date=data.strikeParamData[data.currentExpiryValue]?.name
     let wallet=""
     if(data.currentListing=="My"){
         wallet=axiosStore.currentAccount
     }
     let orderListResponse= await getMarketOfferApi(axiosStore.chainId,data.currentOrderType[0]=="call"?0 : 1,data.currentUnderlyingAsset.name,date,strikePrice,wallet)
     console.log("orderListResponse",orderListResponse)
     let orderList=[]
     orderListResponse?.data?.forEach(item=>{
          //network
          let netWork=""
          switch(item["chain_id"]){
             case "137":netWork="polygon";break;
             case "1":netWork="ethereum";break;
             case "42161":netWork="arbitrum";break;
          }
          //权力金币种信息处理
          let premiumAsset=[]
          item["premium_assets"]?.forEach(child=>{
            premiumAsset.push(JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(child))))
          })
          //处理抵押资产
          let underlyingAsset=JSON.parse(JSON.stringify(axiosStore.getTokenByAddress(item.underlying_asset)))
          //处理总量
          let total=BigNumber.from(item["total"]).div(ethers.utils.parseUnits("1",underlyingAsset.decimals)).toNumber()
          //处理未使用
          let unUsed=Number(total)-BigNumber.from(item["used"]).div(ethers.utils.parseUnits("1",underlyingAsset.decimals)).toNumber()
          //处理清算方式

          let liquidate=""
          switch(Number(item["liquidate_modes"][0])){
             case 0:
             liquidate="Both";
             break;
             case 1:
             liquidate="Cash Settlement"
               break;
             case 2:
             liquidate="Asset Delivery"
                break     
          }
          let obj={
            id:item.id,
            chainIcon:axiosStore.remark.chainIcon,
            orderType:item["option_type"]==0?'call':'put',
            netWork:netWork,
            ownerValue:item["writer_wallet"],
            owner: `${String(item["writer_wallet"]).substring(0,4)}..${String(item["writer_wallet"]).substring(39)}`,
            strikePrice: item["strike_price"],
            price: item["market_price"],  //市场价
            deribitPrice: item["option_premium"],//权力金价
            unUsed:unUsed,
            total: total,
            premiumAsset: premiumAsset, 
            underlyingAsset:underlyingAsset,
            liquidate: liquidate,
            KYT: "Passed" 
          }
          orderList.push(obj)
     })
     data.orderList=orderList
    

}
</script>


<style scoped lang="less">

.marketPlace{
    padding: 56px 16px 50px;
    box-sizing: border-box;
    width: 100%;
    .price-tips-content{
      padding: 0px 8px;
      background-color: rgba(1, 167, 84, 0.07);
      color: var(--text-color-success);
      border-radius: 8px;
      height: 40px;
      line-height: 40px;
  
    }

    .select-option-token-content{
      margin-bottom: 16px;
      margin-top: 16px;
    }

    .option-select-content{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        .option-card{
            height: 167px;
            width: calc(50% - 8px);
            border-radius: 16px;
            box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.1);
            .title{
                height: 48px;
                line-height: 48px;
                font-size: 14px;
                border-bottom: 1px solid var(--component-border);
                text-align: center;
            }
            
        }
    }

    .select-list-switch{
        width: 200px;
        margin-bottom: 17px;
    }
    .all-listing-table{
      width: 100%;
      max-height: 340px;
      overflow: auto;
      margin-top: 16px;
 
    }
    .empty{
         margin-top: 50%;
         transform: translateY(-50%);

      }
}


</style>
