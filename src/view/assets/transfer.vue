<template>
    <div class="assetsTransfer">
        <navigationBar>
            <template v-slot:icon>
                <img  :style="{width: '16px',height: '16px'}" src="@/assets/images/token-eth.png" alt="">
            </template>
           
        </navigationBar>
        <!--  -->
        <div class="option">
            <div class="left">
                <p class="info">
                    <img class="icon" src="@/assets/images/wallet.png" alt="">
                    <span class="title">Wallet</span>
                </p>
                <span class="balance">Balance</span>
                <span class="text">1212212</span>
            </div>

            <div class="middle">
                <img class="icon" src="@/assets/images/arrow_right2.png" alt="">
            </div>

            <div class="right">
                <p class="info">
                    <span class="title">JVault</span>
                    <img class="icon" src="@/assets/images/j_wallet.png" alt="">            
                </p>
                <span class="balance">Balance</span>
                <span class="text">10250522</span>
            </div>
        </div>
        <!--  -->
        <div class="input-content">
            <div class="input-row">
                <input-number class="input" v-model:value="data.optionNumber"></input-number>
                <div class="token">ETH</div>
            </div>
            <div class="limit-row">
                <div>$3000</div>
                <div>
                    <span>
                        <span>0.0001</span>
                        <span>-</span>
                        <span>10</span>
                    </span>
                    <span>
                        <div class="max-btn">Max</div>
                    </span>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="cost">
            <p class="left">
                <img class="icon" src="@/assets/images/cost.png" alt="">
                <span class="text">Network Cost</span>
            </p>
            <span class="right">0.002Eth</span>
        </div>
        <!--  -->
        <span class="btn">Transfer</span>
        <!--  -->
        <assetTranfer></assetTranfer>
    </div>
</template>
<script setup>
import navigationBar from "@/components/utils/navigationBar.vue"
import inputNumber from "@/components/utils/input-number.vue"
import assetTranfer from "@/components/assets/assetTranfer.vue"
import {reactive} from "vue"
let data=reactive({
    optionNumber:0
})
</script>
<style lang="less" scoped>
.assetsTransfer{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
    .option{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        margin-bottom: 8px;
        .left{
          width: 49%;
          background-color: var(--bg-color-secondarycontainer);
          display: flex;
          flex-direction: column;
          padding: 16px;
          box-sizing: border-box;
          border-radius: 8px;
          .info{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 6px;
            .icon{
               width: 16px;
               height: 16px;
               margin-right: 4px;
            }
            .title{
               color: var(--text-color-primary);
               font-size: 16px;
               font-weight: 600;
            }
          }
          .balance{
             color: var(--text-color-second);
             font-size: 14px;
             margin-bottom: 4px;
          }
          .text{
             font-size: 14px;
             color: var( --text-color-primary);
             margin-bottom: 2px;
          }
        }
        .middle{
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border:4px solid var(--bg-color-page);
          position: absolute;
          background: var(--bg-color-secondarycontainer);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .icon{
            width: 24px;
            height: 24px;
          }
        }
        .right{
          width: 49%;
          background-color: var(--bg-color-secondarycontainer);
          display: flex;
          flex-direction: column;
          padding: 16px;
          box-sizing: border-box;
          border-radius: 8px;
          align-items: flex-end;
          .info{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 6px;
            .icon{
               width: 16px;
               height: 16px;
               margin-left: 4px;
            }
            .title{
               color: var(--text-color-primary);
               font-size: 16px;
               font-weight: 600;
            }
          }
          .balance{
             color: var(--text-color-second);
             font-size: 14px;
             margin-bottom: 4px;
          }
          .text{
             font-size: 14px;
             color: var( --text-color-primary);
             margin-bottom: 2px;
          }
        }
    }
    // 数字输入框区域
    .input-content{
        margin-top: 8px;
        background-color: var(--bg-color-secondarycontainer);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
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
     .cost{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 17px;
        .left{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
            .text{
                color: var( --text-color-second);
                font-size: 14px;
            }
        }
        .right{
            font-size: 14px;
            color: var(--text-color-primary);
        }
     }
     .btn{
        width: 100%;
        height: 48px;
        text-align: center;
        line-height: 48px;
        color: var(--text-color-active);
        background-color: var( --bg-color-container-active);
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
     }
}

</style>