<template>
    <navigation-bar title="Sell Call Options"></navigation-bar>
    <div class="sellOption">    
        <!-- 选择币种 -->
        <div class="select-option-token-content">
            <select-switch 
                :switchList="data.underlyingAssetList" 
                v-model:value="data.currentUnderlyingAsset"
                theme="white"
            ></select-switch>
        </div>
       <!-- 数字输入框 -->
       <div class="sell-amount-content">
        <div class="title">Amount</div>
        <div class="input-content">
            <div class="input-row">
                <input-number class="input" v-model:value="data.optionNumber"></input-number>
                <div class="token">{{data.currentTokenSelect}}</div>
            </div>
            <div class="limit-row">
                <!-- <div>$3000</div> -->
                <div></div>
                <div>
                    <span>8238.10</span>
                    <span>
                        <div class="max-btn">Max</div>
                    </span>
                </div>
            </div>
        </div>
       </div>
       
       <!-- 行权价格 -->
        <div class="strike-price-content">
            <div class="strike-title">
                <div class="title">Strike Price</div>
                <div class="current-price">
                    <div class="call-price">
                        <span>Market Price</span>
                        <span style="font-weight: bold;"> $3100</span>
                    </div>
                    <refresh></refresh>
                </div>
            </div>
            <div class="strike">
                <strike-price :priceList="data.strikePrice" v-model:value="data.currentStrikePrice" > </strike-price>          
            </div>

        </div>

        <!-- 到期时间 -->
        <div class="expiry-data-content">
            <div class="title">Expiry Date</div>
            <div>
                <expiry-date-slider
                    class="expiry-date"
                    :expiryDataList="data.expiryDataList" 
                    v-model:value="data.currentExpiryData"
                    @changeAfterReturnTime="changeExpiry"
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
                        <span style="font-weight: bold;"> $3100</span>
                    </div>
                    <refresh></refresh>
                </div>
            </div>
            <div>
                <input-number class="input" v-model:value="data.currentPrice"></input-number>
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
        <a-button 
            type="primary"
            class="pay-btn"
            >Confirm</a-button>
    </div>

</template>
<script setup>

import selectSwitch from "@/components/utils/selectSwitch.vue"
import inputNumber from "@/components/utils/inputNumber.vue"
import strikePrice from "@/components/sellOption/strikePrice.vue"
import mulSelect from "@/components/sellOption/mulSelect.vue"
import navigationBar from "@/components/utils/navigationBar.vue";
import expiryDateSlider from "@/components/sellOption/expiryDateSlider.vue"
import refresh from "@/components/utils/refresh.vue"
import { reactive,onMounted} from "vue";
import { useRouter,useRoute} from "vue-router";
import ethPng from "@/assets/images/eth.png"
import wbtcPng from "@/assets/images/wbtc.png"
import usdtPng from "@/assets/images/usdt.png"
import usdcPng from "@/assets/images/usdc.png"
import {getSigatureLock,getUnderlyTotal} from "@/callData/multiCall/optionFacet"
import {multiCallArrR,multiCallObjR} from "@/apiHandle/multiCall"
import {getVaultApi} from "@/api/vaultFactory"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber } from "ethers";
const router=useRouter()
const route=useRoute()
const axiosStore= useAxiosStore()
const data=reactive({ 
   underlyingAssetList:[],
   strikeAssetList:[],
   premiumAssetList:[],
   liquidationWay:[],//清算方式数组  
   optionNumber:"",//抵押数量
   currentPrice:"2100",//当前抵押资产价格
   currentStrikePrice:"2900",//行权价
   strikePrice:[
      {
        price:"2900",
      },
      {
        price:"3000" 
      },
      {
         price:"3100"
      }
   ],
   expiryDataList:{
      1:1,
      2:2,
      3:3,
      4:7,
      5:14,
      6:21,
      7:30
   },
   currentExpiryData:2,

})
// 
onMounted(async ()=>{
   console.log(route,"=s=s=")
   await init()

//   let vault= await  getVault()
//    await checkUpdateGignature(vault,)
})

var init=async () => {
//    axiosStore
    //处理抵押资产列表
    let underlyingAssetData=axiosStore?.optionBusiness?.underlyingAssets||[]
    let underlyingAssetList=[]
    underlyingAssetData.forEach(item=>{
        item=JSON.parse(JSON.stringify(item))
        item.icon=item.img
        item.key=item.name
        item.label=item.name
        if(route.query.asset == item["name"]){
            data.currentUnderlyingAsset=item["name"]
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
}
//-------------------
var premiumChange=(item)=>{
   console.log(item,"看看看看")
}


//------------
const changeExpiry = (date) => {
    console.log(date);
}
//------------------------------
// 是否触发上链签名

var  checkUpdateGignature=async (vault,underlyingAsset)=>{
  //multicall数据
   let multiCallData=[]
   multiCallData.push(getSigatureLock("getSigatureLock",vault,0,underlyingAsset))  
   multiCallData.push(getUnderlyTotal("getUnderlyTotal",vault,0,underlyingAsset))  
   let multiCallResponse=await multiCallObjR(multiCallData)
   console.log("multiCallResponse",multiCallResponse)   
}

var getVault=async function(){
  let salt=BigNumber.from("0")  
  let vaultResponse= await getVaultApi(axiosStore.currentAccount,salt)
  console.log("vaultResponse",vaultResponse)
  return vaultResponse.message
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