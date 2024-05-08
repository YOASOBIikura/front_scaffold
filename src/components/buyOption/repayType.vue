<template>
    <div class="repay-type-content">
        <div class="item">
            <img src="@/assets/images/settlement_icon_1.png"/>
            <div class="data">
                <div class="item-title">Exercise for asset delivery</div>
                <div class="item-info">Pay {{payStrikeAmount}} {{props.strikeAsset.name}} to get {{ newUnderlyingAmount }} {{props.asset.name}}</div>
            </div>
        </div>
        <div class="item">
            <img src="@/assets/images/settlement_icon_2.png"/>
            <div class="data">
                <div class="item-title">Exercise for cash settlement</div>
                <div class="item-info">Get net profit in {{props.asset.name}}</div>
            </div>
        </div>
        <div class="item">
                <img src="@/assets/images/settlement_icon_3.png"/>
            <div class="data">
                <div class="item-title">Not exercise</div>
                <div class="item-info">No payment needed</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {reactive,defineProps,computed}  from "vue"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber,ethers } from "ethers";

const props=defineProps({
    asset:{
        type:Object,
        require:true,
        default:{}
    },
    underlyingAmount:{
        type:Object,
        require:true,
        default:{}
    },
    strikeAsset:{
        type:Object,
        require:true,
        default:{}          
    },
    strikeAmount:{
        type:Object,
        require:true,
        default:{}      
    }
})

var payStrikeAmount=computed(()=>{
    if(!BigNumber.isBigNumber(props.strikeAmount) || !props.strikeAsset.decimals){
        return 0
    }
    let newAmount= props.strikeAmount.mul(props.underlyingAmount).div(ethers.utils.parseUnits("1",props.asset.decimals-props.asset.decimalsShow)).div(ethers.utils.parseUnits("1",props.strikeAsset.decimals))
    return newAmount.toNumber()/10 ** props.asset.decimalsShow
})

var newUnderlyingAmount=computed(()=>{
    if(!BigNumber.isBigNumber(props.underlyingAmount) || !props.asset.decimals){
        return 0
    }
     return BigNumber.from(props.underlyingAmount).div(ethers.utils.parseUnits("1",props.asset.decimals-props.asset.decimalsShow)).toNumber()/10 ** props.asset.decimalsShow
})
</script>
<style scoped lang="less">
.title{
    font-size: 24px;
    font-weight: bold;
}
 .repay-type-content{
        margin-top: 44px;
        width: 100%;
        padding: 24px 16px;
        border: 1px solid var(--component-border);
        border-radius: 16px;
        margin-bottom: 20px;
        .item{
            margin-top: 24px;
            display: flex;
            font-size: 14px;
            img{
                width: 40px;
            }
            .data{
                margin-left: 12px;
                .item-title{
                    color: var(--text-color-second);
                }
                
            }
            
            &:first-child{
                margin-top: 0;
            }
        }
    }
</style>