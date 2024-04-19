<template>
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

</template>
<script setup>

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
</style>
