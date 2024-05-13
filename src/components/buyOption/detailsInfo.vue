<template>
            <div class="details">
                    <div class="title">Contract Details</div>
                    <div class="account-row">
                        <div class="account">
                            <p class="account-img" id="avtor" > </p>
                             <span>{{`${String(props.dataInfo.wallet).substring(0,4)}..${String(props.dataInfo.wallet).substring(38)}`}}</span>
                            <img src="@/assets/images/certified.png" class="KYT-img" />
                            <img  class="KYT-img" src="@/assets/images/copy2.png" alt="" @click="copyText(props.dataInfo.wallet)">
                        </div>
                        <div class="chain">
                            <img :src="axiosStore.remark.chainIcon" class="chain-img"/>
                            {{axiosStore.remark.chainName}}
                        </div>
                    </div>
                    <div class="value-row">
                        <div class="title">Writer Vault</div>
                        <div class="value">{{`${String(props.dataInfo.writerVault).substring(0,4)}..${String(props.dataInfo.writerVault).substring(38)}`}}</div>
                    </div>
                    <div class="value-row">
                        <div class="title">MarketPrice</div>
                        <div class="value">${{newMarketPrice}}</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Strike Price</div>
                        <div class="value">${{props.dataInfo.strikePrice}}</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Accept</div>
                        <div class="value">
                            <!-- <img src="@/assets/images/tick.png" style="width: 12px;margin-right: 2px"/> -->
                            {{props.dataInfo.liquidateWay}}
                        </div>
                    </div>
                    <div class="value-row">
                        <div class="title">Expire Date</div>
                        <div class="value">{{props.dataInfo.optionDate}}</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Vault Balance</div>
                        <div class="value">
                            <span>{{props.dataInfo.unUsed}}</span>
                            <span class="total-amount">/{{props.dataInfo.total}} </span>
                            <span>{{props.dataInfo?.underlyingAssetToken?.name}}</span>
                        </div>
                    </div>

              

            </div>

</template>
<script setup>
import {reactive,defineProps,computed,watch}  from "vue"
import {useAxiosStore} from "@/pinia/modules/axios"
import { BigNumber,ethers } from "ethers";
import  jazzicon from 'jazzicon'
import {message} from "ant-design-vue"
const axiosStore=useAxiosStore()
const props=defineProps({
    dataInfo:{
        type:Object,
        require:true,
        default:{}
    },
    marketPrice:{
        type:[Object,String,Number],
        require:true,
        default:{}
    }
})
var newMarketPrice=computed(()=>{
    if(!BigNumber.isBigNumber(props.marketPrice)){
        return 0
    }

    return  BigNumber.from(props.marketPrice).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100
})
watch(()=>props.dataInfo.wallet,()=>{
    // 制造头像
    createAvator()
})
const data=reactive({})
var createAvator=()=>{
    let el= document.getElementById("avtor")
    el.innerHTML=""
    let addrNumber=BigNumber.from(props.dataInfo.wallet).mod(BigNumber.from("0xffffffff"))
    let avator=  jazzicon(40,addrNumber)
    el.appendChild(avator)
}
var copyText = async (data)=> {
        let oInput = document.createElement('input');
        oInput.value = data;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand("Copy"); 
        message.success("copy success");
        oInput.remove();
}

</script>
<style scoped lang="less">
.title{
            font-size: 24px;
            font-weight: bold;
}
.details{
        margin-top: 40px;
      
        .account-row{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 24px;
            .account{
                font-size: 16px;
                font-weight: bold;
                line-height: 40px;
                display: flex;
                flex-direction: row;
                align-items: center;
                .account-img{
                    width: 40px;
                    // vertical-align: top;
                    height: 40px;
                    margin-right: 4px;
                }
                .KYT-img{
                    width: 12px;
                    margin-left: 4px;
                }
            }
            .chain{
                font-size: 14px;
                .chain-img{
                    border-radius: 50%;
                    width: 16px;
                    vertical-align: sub;
                }
            }
        }
        .value-row{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 16px;
            .title{
                color: var(--text-color-second);
                font-size: 14px;
            }
            .value{
                .total-amount{
                    color: var(--text-color-second);
                }
            }
            
        }

    }
</style>
