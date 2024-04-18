<template>
    <div class="page">
        <!-- 页头位置 -->
        <div class="page-header">
            <div>
                <img src="@/assets/images/back.svg" class="back"/>
            </div>
            <div>
                <div class="copy-btn">
                    <img src="@/assets/images/copy.svg" />
                    Copy to sell</div>
            </div>
        </div>
        <!-- 标题 -->
        <div class="header-content">
            <div class="title">Buy ETH {{ optionType }}</div>
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
                <input-number class="input" v-model:value="optionNumber"></input-number>
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
    </div>
</template>

<script setup>
import { ref } from "vue"
import inputNumber from "@/components/input-number.vue"
let optionType = ref("call");


let optionNumber = ref("1");

</script>

<style scope lang="less">
.page{
    padding: 0 12px;
}
.page-header{
    height: 48px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    align-items: center;
    .back{
        width: 24px;
        height: 24px;
    }
    .copy-btn{
        line-height: 32px;
        font-size: 14px;
        background-color: var(--bg-color-secondarycontainer);
        padding: 4px 12px;
        border-radius: 32px;
        font-weight: 600;
        img{
           vertical-align: sub;
           margin-right: 4px;
        }
    }
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
    padding: 16px;
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
</style>