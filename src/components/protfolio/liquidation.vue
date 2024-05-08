<template>
      <a-drawer v-if="props.isOpen"  :height="'auto'" class="liquidation"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen">
        <template v-slot:title>
             <div class="filter">
                 <img  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
                 <span class="title">Choose Exercise Method</span>
                 <span></span>
             </div>
        </template>
        <div class="liquidation-body">
            <div 
            v-if="(props.dataInfo?.liquidateMode == 0 || props.dataInfo?.liquidateMode == 1) && props.dataInfo?.isCurrentHolder" :class="data.currentIndex==0?'settle settle-active':'settle'" @click="data.currentIndex=0">
                <img class="icon" src="@/assets/images/method1.png" alt="">
                <p class="info">
                    <span class="text1">Cash settlemnt</span>
                    <span class="text2">{{ cashValue }}</span>
                    <span class="text3">≈${{ profit }}</span>
                </p>
                <span class="status">Recommend</span>
            </div>

            <div v-if="(props.dataInfo?.liquidateMode == 0 || props.dataInfo?.liquidateMode == 2) && props.dataInfo?.isCurrentHolder" :class="data.currentIndex==1?'settle settle-active':'settle'" @click="data.currentIndex=1">
                <img class="icon" src="@/assets/images/method2.png" alt="">
                <p class="info">
                    <span class="text1">Asset Delivery</span>
                    <span class="text2">{{assetDeliveryShow}}</span>
                </p>
            </div>

            <!-- <div class="warn">
                <img class="icon" src="@/assets/images/warn.png" alt="">
                <span class="text">Slippage in trading may cause deviations</span>
            </div> -->
            

            <div v-if="props.dataInfo?.isCurrentHolder" class="btn btn1 select" @click="liquidate">Exercise</div>
            <div class="btn" @click="notExercise">Not Exercise</div>
       </div>
      </a-drawer>
</template>
<script setup>
import { reactive,defineProps,defineEmits,computed} from 'vue';
import { BigNumber, ethers } from 'ethers';
import { useAxiosStore } from "@/pinia/modules/axios";
import { message } from 'ant-design-vue';
const axiosStore = useAxiosStore();
const data=reactive({
    currentIndex:0
})
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   },
   dataInfo:{
    type:Object,
    require:true,
    default:{}
   },
   priceList:{
      type:Object,
       require:true,
       default:{}
    }
})
const emits= defineEmits(["update:isOpen","liquidate"])
//关闭弹窗
var closeDrawer=()=>{
   emits("update:isOpen",false)
}



var assetDeliveryShow=computed(()=>{
    let info=""
    let underlyingAmount=props.dataInfo?.underyingAmount.div(ethers.utils.parseUnits("1",props.dataInfo?.underlyingAsset?.decimals-props.dataInfo?.underlyingAsset?.decimalsShow)).toNumber()/10 ** props.dataInfo?.underlyingAsset?.decimalsShow
    let strikeAmount=props.dataInfo?.strikeAmount.mul(props.dataInfo?.underyingAmount).div(ethers.utils.parseUnits("1",props.dataInfo?.strikeAsset?.decimals - props.dataInfo?.strikeAsset?.decimalsShow)).div(ethers.utils.parseUnits("1",props.dataInfo?.underlyingAsset?.decimals)).toNumber()/10 ** props.dataInfo?.strikeAsset?.decimalsShow
    info=`Pay ${strikeAmount}${props.dataInfo?.strikeAsset?.name} to get ${underlyingAmount}${props.dataInfo?.underlyingAsset?.name}`
    return info
})


var profit=computed(()=>{
  return getProfit()
})

var cashValue=computed(()=>{
   let value=getCashValue()
   return `Get ${value}${props.dataInfo?.underlyingAsset?.name}`
})


var getCashValue=()=>{
    let profitValue=getProfit()
   let asset=String(props.dataInfo?.underlyingAsset?.address).toLocaleLowerCase()
   let underlyingPrice=props.priceList[asset]
   if(!underlyingPrice){
      return 0
   }
   underlyingPrice=underlyingPrice.div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals - props.dataInfo?.underlyingAsset?.decimalsShow)).toNumber() / 10 ** props.dataInfo?.underlyingAsset?.decimalsShow
   let value=profitValue/underlyingPrice
   return value
}

var getProfit=()=>{
   //行权价
   let strikePriceTemp=getStrikePrice()
   //市场价
   let narketPriceTemp=getMarketPrice()
   //价差
   let spread=0
   if(props.dataInfo?.orderTypeShow=="Call"){
      spread=narketPriceTemp-strikePriceTemp
   }else{
      spread=strikePriceTemp-narketPriceTemp
   }
   if(spread<=0){
      spread=0
   }
   return spread
}



var getMarketPrice=()=>{
   let asset=""
     if(props.dataInfo?.orderTypeShow=="Call"){
         asset=String(props.dataInfo?.underlyingAsset?.address).toLocaleLowerCase()
     }else{
         asset=String(props.dataInfo?.strikeAsset?.address).toLocaleLowerCase()
     }
     let price= props.priceList[asset]
     if(!price){
       return 0
     }
     price=price.div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100
     return price
}

var getStrikePrice=()=>{
   let  asset=String(props.dataInfo?.strikeAsset?.address).toLocaleLowerCase()
     let  decimals=props.dataInfo?.strikeAsset?.decimals
     let amount= props.dataInfo?.strikeAmount
     let price= props.priceList[asset]
     if(!price){
       return 0
     }
     return amount.mul(price).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",decimals)).toNumber()/100
}
var getProfitAmount=()=>{
    let profitValue=getCashValue()
    return ethers.utils.parseUnits(`${profitValue}`,props.dataInfo?.underlyingAsset?.decimals)

}

//----
var notExercise=()=>{
    if(!data.dataInfo.isCurrentHolder){
        let nowTime=parseInt(new Date().getTime())/1000
        if( data.dataInfo.expirationDate>=nowTime){
             message.warning("Before the time was up,writer could not liquidate")
             return
        }
    }  
     data.currentIndex=3
     liquidate()
}


var liquidate=()=>{
    let _incomeAmount=getProfitAmount()
    let liquidateType=1
     if(data.currentIndex==0){
        //利差清算
        liquidateType=2
     }else if(data.currentIndex==1){
        //实物交割
        liquidateType=1
     }else{
        //不清算
        liquidateType=3
     }
     console.log("liquidate","----")
     emits("liquidate",props.dataInfo,liquidateType,_incomeAmount)
}
</script>
<style lang="less" scoped>
      .liquidation{
        width: 100%;
        .filter{
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .text{
            font-size: 16px;
            font-weight: 600;
            color: var( --text-color-primary);
            }
            .close{
            width: 24px;
            height: 24px;
            }
        }


        .liquidation-body{
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            .settle{
                width: 100%;
                height: 94px;
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;
                padding: 16px 24px;
                box-sizing: border-box;
                border:1px solid  var( --border-color);
                border-radius: 8px;
                margin-bottom: 16px;
                .icon{
                    width: 24px;
                    height: 24px;
                    margin-right: 28px;
                }
                .info{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .text1{
                    color: var(--text-color-second);
                    font-size: 14px;
                    }
                    .text2{
                    color: var(--text-color-primary);
                    font-size: 14px;
                    } 
                    .text3{
                    color: var(--text-color-primary);
                    font-size: 14px;
                    }
                }
                .status{
                    display: flex;
                    background-color: var(--text-color-third);
                    color: var( --text-color-active);
                    font-size: 12px;
                    border-radius: 4px;
                    padding: 2.5px 4px;
                    position: absolute;
                    right: 16px;
                    top: 16px;
                }
            }
            .settle-active{
                background-color: var(--bg-color-secondarycontainer);
                border:1px solid var(--bg-color-container-active) ;
            }
            .warn{
               width: 100%;
               background-color: var(--bg-color-warn);
               border-radius:8px;
               padding: 14px;
               box-sizing: border-box;
               display: flex;
               flex-direction: row;
               align-items: center;
               .icon{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                margin-right: 8px;
               }
               .text{
                 color: var(--text-color-primary);
                 font-size: 12px;
               }
            }

       }
        .btn{
            width: 100%;
            height: 48px;
            line-height: 48px;
            text-align: center;
            background-color: var(--component-border);
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color-second);
            border-radius: 8px; 
            margin-bottom: 8px;
        }
        .btn1{
            margin-top: 20px;
        }
        .select{
            background-color: var(--bg-color-container-active);
            color: var(--text-color-active);
        }
      }


</style>