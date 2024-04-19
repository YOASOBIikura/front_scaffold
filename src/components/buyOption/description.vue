<template>
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

</template>
<script setup>

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
                    }
                }
            }
        }
    }
</style>
