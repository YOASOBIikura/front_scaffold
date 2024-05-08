<template>
           <div class="description">
                <div class="title">Product Description</div>
                <div class="product-img">
                    <div class="absolute-data">
                        <div class="you">You</div>
                        <div class="writer">{{props.orderType}} Option Writer</div>
                        <div class="premium">Pay Premium</div>
                        <div class="pay-amount">{{props.premiumAsset.premium}} <img :src="props.premiumAsset.img" /></div>
                        <div class="lock">Lock {{ props.asset.name }}</div>
                        <div class="lock-amount">
                            {{assetShow}}
                            <img  :src="props.asset.img"/>
                        </div>
                    </div>
                    <img src="@/assets/images/product.png" />
                </div>
            </div>

</template>
<script setup>
import {reactive,defineProps,computed}  from "vue"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber, ethers } from "ethers";
const axiosStore=useAxiosStore()
const props=defineProps({
    orderType:{
       type:String,
       require:true,
       default:"Call"
    },
    asset:{
        type:Object,
        require:true,
        default:{}
    },
    premiumAsset:{
        type:Object,
        require:true,
        default:{}
    },
    underlyingAmount:{
        type:Object,
        require:true,
        default:{}
    }
})
//计算属性
var premiumFee=computed(()=>{
    let fee=""
   props.premiumAssetList.forEach(item=>{
      if(item.select){
        fee=item.premium
      }
   })
   return fee
})

var assetShow=computed(()=>{
    if(!props.asset.decimals){
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
 .description{
        margin-top: 24px;
        .product-img{
            margin-top: 24px;
            height: 272px;
            position: relative;
            .absolute-data{
                width: 100%;
                height: 100%;
                position: absolute;
                font-size: 12px;
                .you{
                    position: absolute;
                    top: 16px;
                    left: 25%;
                    transform: translate(-50%);
                }
                .writer{
                    position: absolute;
                    top: 16px;
                    right: 25%;
                    transform: translate(50%);
                }
                .premium{
                    position: absolute;
                    top: 23%;
                    left: 50%;
                    transform: translate(-50%);
                    background-color: var(--text-color-primary);
                    color: var( --text-color-active);
                    padding: 2px 4px;
                    border-radius: 4px;
                }
                .pay-amount{
                    position: absolute;
                    top: 36%;
                    left: 50%;
                    transform: translate(-50%);
                      line-height: 12px;
                    img{
                        width: 12px;
                        vertical-align: bottom;

                    }
                }
                .lock{
                    position: absolute;
                    top: 53%;
                    right: 18%;
                    background-color: var(--text-color-primary);
                    color: var( --text-color-active);
                    padding: 2px 4px;
                    border-radius: 4px;
                }
                .lock-amount{
                    position: absolute;
                    top: 62%;
                    right: 18%;
                    transform: translate(-50%);
                    line-height: 12px;
                    img{
                        width: 12px;
                        vertical-align: bottom;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
</style>
