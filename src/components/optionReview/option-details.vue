<template>
    <div class="option-details">
        <div class="collapse-title" @click="data.detailCollapse = !data.detailCollapse">
                <span>
                    Details 
                    <img src="@/assets/images/arrow_open.png" v-if="data.detailCollapse"/>
                    <img src="@/assets/images/arrow_close.png" v-else/>
                </span>
        </div>
        <div v-if="data.detailCollapse">
            <div class="details">
                    <div class="title">Contract Details</div>
                    <div class="account-row">
                        <div class="account">
                            <img src="@/assets/images/test1.png" class="account-img"/>
                            SuperSell
                            <img src="@/assets/images/certified.png" class="KYT-img" />
                        </div>
                        <div class="chain">
                            <img src="@/assets/images/solana.png" class="chain-img"/>
                            Solana
                        </div>
                    </div>
                    <div class="value-row">
                        <div class="title">Deribit Price</div>
                        <div class="value">$8</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Cash Settlement</div>
                        <div class="value">
                            <img src="@/assets/images/tick.png" style="width: 12px;margin-right: 2px"/>
                            Accept
                        </div>
                    </div>
                    <div class="value-row">
                        <div class="title">Asset Delivery</div>
                        <div class="value">3,100 USDT</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Vault Balance</div>
                        <div class="value">
                            <span>10</span>
                            <span class="total-amount">/500 </span>
                            <span>ETH</span>
                        </div>
                    </div>
                    <div class="value-row">
                        <div class="title">Valid Date</div>
                        <div class="value">11 Feb 24-29 Feb 24</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Market Price</div>
                        <div class="value">$3,000</div>
                    </div>
                    <div class="value-row">
                        <div class="title">Price Source</div>
                        <div class="value">Chainlink</div>
                    </div>

            </div>
            <div class="description">
                <div class="title">Product Description</div>
                <div class="product-img">
                    <div class="absolute-data">
                        <div class="you">You</div>
                        <div class="writer">Call Option Writer</div>
                        <div class="premium">Pay Premium</div>
                        <div class="pay-amount">10 <img src="@/assets/images/usdt.png" /></div>
                        <div class="lock">Lock ETH</div>
                        <div class="lock-amount">1 <img src="@/assets/images/eth.png"/></div>
                    </div>
                    <img src="@/assets/images/product.png" />
                </div>
            </div>
            <div class="settlement">
                <div class="title">Call Option Settlement</div>
                <div class="settlement-img">
                    <div class="settlement-absolute">
                        <div class="eth-price">ETH Price</div>
                        <div class="strike-price">
                            <span>Strike Price</span>
                            <span class="value">$3100</span>
                        </div>
                        <div class="current-price">
                            <span>Current Price</span>
                            <span class="value">$3000</span>
                        </div>
                    </div>
                    <img src="@/assets/images/call_settlement.png"/>
                </div>
            </div>
            <div class="repay-type-content">
                <div class="item">
                    <img src="@/assets/images/settlement_icon_1.png"/>
                    <div class="data">
                        <div class="item-title">Exercise for asset delivery</div>
                        <div class="item-info">Pay 3,100 USDT to get 1 ETH</div>
                    </div>
                </div>
                <div class="item">
                    <img src="@/assets/images/settlement_icon_2.png"/>
                    <div class="data">
                        <div class="item-title">Exercise for cash settlement</div>
                        <div class="item-info">Get net profit in ETH</div>
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
        </div>
    </div>
</template>
<script setup>
import { reactive } from "vue";

let data = reactive({
    detailCollapse: false
});

</script>
<style scoped lang="less">

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
                .account-img{
                    width: 40px;
                    vertical-align: top;
                    margin-right: 4px;
                }
                .KYT-img{
                    width: 12px;
                }
            }
            .chain{
                font-size: 14px;
                .chain-img{
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
                    }
                }
            }
        }
    }
    .settlement{
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
    .repay-type-content{
        margin-top: 44px;
        width: 100%;
        padding: 24px 16px;
        border: 1px solid var(--component-border);
        border-radius: 16px;
        margin-bottom: 60px;
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