<template>
    <navigation-bar title="Buy Call Options"></navigation-bar>
    <div class="buyOption">
        <!-- 标题 -->
        <div class="header-content">
            <div class="title">Buy ETH {{ baseData.optionType }}</div>
            <div class="token-content">
                <img src="@/assets/images/token-eth.png" class="token"/>
                <img src="@/assets/images/token-usdt.png" class="token"/>
                <div class="ticket"></div>
            </div>
        </div>
        <!-- 价格变动 --> 
        <div class="price-change-content">
            <div>
                <img src="@/assets/images/price-up.png" class="img"/>
            </div>
            <div class="price up">
                $3100
            </div>
        </div>
        <!-- 日期显示 -->
        <div class="date-content">
            <img src="@/assets/images/date-icon.png" class="date-img"/>
            <div>
                <span>27 Feb 24</span>
                <span>·</span>
                <span>28d 18h 30m</span>
            </div>
        </div>
        <!-- 数字输入框 -->
        <div class="input-content">
            <div class="input-row">
                <inputValue 
                    v-model:value="baseData.optionNumber" 
                    :isApproximate="true"
                    :symbol="'ETH'" 
                    :decimals="18"
                >
                 <div class="limit-row">
                    <div>$3000</div>
                    <div>
                        <span>
                            <span>0.0001</span>
                            <span>-</span>
                            <span>10</span>
                        </span>
                    
                    </div>
                </div>
                </inputValue>
            </div>
        </div>
        <!-- 支付币种选择 -->
        <div class="underly-assets-content">
            <div class="title-row">
                <div class="title">Pay Premium With</div>
                <div class="info">
                    <span>Premium per ETH </span>
                    <span>$10</span>
                </div>
            </div>
            <div class="select-content">
                <div class="item active">
                    <div class="token">
                        <img src="@/assets/images/usdt.png" />
                        <span>0 USDT</span>
                    </div>
                    <div class="balance">
                        Balance: 1000.28
                    </div>
                </div>
                <div class="item">
                     <div class="token">
                        <img src="@/assets/images/usdc.png" />
                        <span>0 USDC</span>
                    </div>
                    <div class="balance">
                        Balance: 20.12
                    </div>
                </div>
            </div>
        </div>
        <!-- 详细数据 -->
        <div class="option-details">
            <div class="collapse-title" @click="data.detailCollapse = !data.detailCollapse">
                    <span>
                        Details 
                        <img src="@/assets/images/arrow_open.png" v-if="data.detailCollapse"/>
                        <img src="@/assets/images/arrow_close.png" v-else/>
                    </span>
            </div>
            <div v-if="data.detailCollapse">
                <details-info></details-info>
                <description></description>
                <settlement></settlement>
                <repay-type></repay-type>          
            </div>
       </div>
    </div>
        <!-- 支付按钮区域 -->
    <div class="pay-btn-content">
        <a-button 
            type="primary"
            class="pay-btn"
            >Pay 10 USDT</a-button>
    </div>

     
    
</template>

<script setup>
import description from "@/components/buyOption/description.vue";
import settlement from "@/components/buyOption/settlement.vue";
import repayType from "@/components/buyOption/repayType.vue";
import detailsInfo from "@/components/buyOption/detailsInfo.vue";

import navigationBar from "@/components/utils/navigationBar.vue";
import {createVaultService,getMulVaultR,maxSaltVaultR} from "@/apiHandle/vault"
import {useAxiosStore} from "@/pinia/modules/axios"
import {issue,redeem} from "@/callData/bundler/issuanceModule"
import {submitOptionOrder} from "@/callData/bundler/optionModule"
const axiosStore=useAxiosStore()
const data = reactive({
    detailCollapse: false, // 是否折叠详情
    underlyingAmount: BigNumber.from("0"),
    underlyingAssetBalance:BigNumber.from("0"),
    currentUnderlyingAsset:{}
});

//-------------初始化相关---------------------
onMounted(async ()=>{
 
    await  init()
})
//处理监听事件
watch(computed(()=>axiosStore.isWalletChange),async (newVal)=>{
   await  init()
})
var init=async()=>{
    if(axiosStore.isConnect==1){
      return
    }

    //取得0号vault
    await buyCall()
    // let vault= await getVaultApi(axiosStore.currentAccount,axiosStore.vaultSalt)
    // vault=vault?.message?.vault ||  new Error("vault error")
}
//------------上链业务相关------------------
var buyCall=async ()=>{
   let ops=[]
   let vaultData= await getMulVaultR([0,"maxSalt"])
   let maxSaltVault=vaultData["maxSalt"]?.vault
   let maxSalt=vaultData["maxSalt"]?.salt || 10
   let mainVault=vaultData["0"]?.vault
   console.log("sss",mainVault)
   //创建vault
   let createVaultData=createVaultService(maxSaltVault)
   ops=ops.concat(createVaultData)
   //从0号vault申购
   let asset=[]
   let amount=[]
   ops.push(issue(mainVault,mainVault,asset,amount))  
   //业务处理
   let info={
    strikeSelect:0,
        holder:"",
        liquidateSelect:0,
        writer:"",
        recipient:"",
        premiumSelet:0,
        underlyingAmount:0,
        signature:{
            orderType:0,
            underlyingAsset:"",
            underlyingAssetType:0,
            underlyingNftID:0,
            expirationDate:0,
            total:1,
            timestamp:3,
            liquidateModes:[],
            strikeAssets:[],
            strikeAmounts:[],
            premiumAssets:[],
            premiumFees:[]
        }
   }
   let writerSignature=""
   ops.push(submitOptionOrder(info,writerSignature))
   console.log(vault,salt,ops)
   //取vault下标
   console.log(maxSalt,"---")
   let bundlerHash= await sendTxToBundler(maxSaltVault,salt,ops)
   console.log("bundlerHash",bundlerHash)
    //接触按钮锁
    if(!bundlerHash.status){
        // data.btnLock=false
        return
    }
}




</script>

<style scope lang="less">
.buyOption{
    padding: 56px 12px 80px;
    overflow: auto;
    width: 100%;
    height: 100%;
}

.header-content{
  height: 48px;  
  margin-top: 8px;
  display: flex;
  padding: 4px 0;
  justify-content: space-between;
  align-items: center;
  .title{
    font-size: 24px;
    font-weight: bold;

  }
  .token-content{
    position: relative;
    margin-top: 8px;
    .token{
        width: 36px;
        position: relative;
        display: inline-block;
        &:first-child{
            margin-right: -8px;
            z-index: 6;
        }
    }
    .ticket{
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        border: 4px dashed #fff;
        z-index: 5;
        top: 0;
        right: 0;
    }
  }
  
}
// 价格变动
.price-change-content{
    display: flex;
    justify-content: start;
    margin-top: 8px;
    .img{
        width: 24px;
        margin-right: 6px;
    }
    .price{
        font-size: 16px;
        font-weight: bold;
        line-height: 25px;
        &.up{
            color: #01A754;
        }
    }
}

// 日期显示
.date-content{
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    margin-top: 8px;
    .date-img{
        width: 24px;
        margin-right: 6px;
    }
    
}

// 数字输入框区域
.input-content{
    margin-top: 8px;
    background-color: var(--bg-color-secondarycontainer);
    border-radius: 8px;
    padding: 4px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-color-second);
        font-size: 14px;
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

// 支付币种选择区域
.underly-assets-content{
    margin-top: 24px;
    .title-row{
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-weight: 400;
        .title{
            color: var(--text-color-primary);
        }
        .info{
            color: var(--text-color-second);
        }
    }
    .select-content{
        margin-top: 8px;
        border-radius: 8px;
        border: 1px solid var(--component-border);
        width: 100%;
        position: relative;
        display: flex;
        .item{
            height: 70px;
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
            .balance{
                margin-top: 4px;
                color: var(--text-color-second);
                font-size: 14px;
            }
        }
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
.option-details{
    margin-top: 28px; 
    .collapse-title{
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        width: 100%;
        position: relative;
    
        img{
            vertical-align: sub;
            width: 16px;
        }
        &::before{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            left: 0px;
        }
        &::after{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            right: 0;
        }
    }
}

</style>