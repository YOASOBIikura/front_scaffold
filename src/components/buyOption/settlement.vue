<template>
           <div class="settlement">
                <div class="title">Call Option Settlement</div>
                <div class="settlement-img">
                    <div class="settlement-absolute">
                        <div class="eth-price">{{ props.asset.name }} Price</div>
                        <div class="strike-price">
                            <span>Strike Price</span>
                            <span class="value">${{ props.strikePrice }}</span>
                        </div>
                        <div class="current-price">
                            <span>Current Price</span>
                            <span class="value">${{newMarketPrice}}</span>
                        </div>
                    </div>
                    <img src="@/assets/images/call_settlement.png"/>
                </div>
            </div>

</template>
<script setup>
import {defineProps,reactive,computed} from "vue"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber, ethers } from "ethers";

const axiosStore=useAxiosStore()
const props=defineProps({
    asset:{
         type:Object,
         require:true,
         default:{}
    },
     strikePrice:{
        type:String,
        require:true,
        default:"0"
     },
     marketPrice:{
        type:[Object,String,Number],
        require:true,
        default:"0"
     }
})
var newMarketPrice=computed(()=>{
    if(!BigNumber.isBigNumber(props.marketPrice)){
        return 0
    }
    return  BigNumber.from(props.marketPrice).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100
})
</script>
<style scoped lang="less">
 .settlement{
       .title{
        font-size: 24px;
        font-weight: bold;
       }
        margin-top: 40px;
        .settlement-img{
            position: relative;
            margin-top: 24px;
            .settlement-absolute{
                position: absolute;
                width: 100%;
                height: 100%;
                font-size: 12px;
                color: var(--text-color-second);
                .eth-price{
                    position: absolute;
                    top: 0;
                    left: 12px;
                }
                .strike-price{
                    position: absolute;
                    top: 45%;
                    left: 12px;
                    .value{
                        color: var(--text-color-primary);
                        margin-right: 12px;
                    }
                }
                .current-price{
                    position: absolute;
                    top: 79%;
                    left: 12px;
                    .value{
                        color: var(--text-color-primary);
                        margin-right: 12px;
                    }
                }
            }
        }
    }
</style>