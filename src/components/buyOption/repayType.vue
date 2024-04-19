<template>
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
</template>
<script setup>

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