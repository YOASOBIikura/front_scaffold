<template>
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

</template>
<script setup>

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