<template>
    <div v-if="dataSource.length > 0">
        <a-table
                :dataSource="dataSource" 
                :columns="columns"
                :bordered="false"
                :pagination="false"
                :scroll="{ x: 1100,y: 'calc(100vh - 570px)'}"
        >
        <template #bodyCell="{ column, record }">
            <!-- owner -->
            <template v-if="column.key === 'owner'">
                <div class="owner-item">
                    <div class="img-content">
                        <img class="owner" src="@/assets/images/test1.png" />
                        <img class="network" src="@/assets/images/solana.png"/>
                    </div>
                    <div class="owner-info">
                        <div class="name">{{record.owner}}</div>
                        <div class="network">solana</div>
                    </div>
                </div>
            </template>
            
            <!-- strike Price -->
            <template v-if="column.key === 'strikePrice'">
                <div class="strike-price">
                    ${{record.strikePrice}}
                </div>
            </template>

            <!-- price -->
            <template v-if="column.key === 'price'">
                <div class="price">
                    ${{record.price}}
                </div>
            </template>

             <!-- deribitPrice -->
            <template v-if="column.key === 'deribitPrice'">
                <div class="deribit-price">
                    ${{record.deribitPrice}}
                </div>
            </template>

            <!-- Amount -->
            <template v-if="column.key === 'amount'">
                <div class="amount">
                    <img class="token" src="@/assets/images/eth.png"/>
                    <div>{{record.amount}}</div>
                    <div class="total-amount">/500</div>
                </div>
            </template>

            <!-- payWith -->
            <template v-if="column.key === 'payWith'">
                <div class="pay-with">
                    <!-- 币种图片在这里替换 -->
                    <img src="@/assets/images/usdc.png" class="token"/>
                    <img src="@/assets/images/usdt.png" class="token"/>
                    <div class="token-label" v-if="record.payWith.length > 1">
                        Both
                    </div>
                    <div class="token-label" v-else>
                        {{record.payWith[0]}}
                    </div>
                </div>
            </template>

            <!-- accept -->
            <template v-if="column.key === 'accept'">
                <div class="accept">
                    {{record.accept}}
                </div>
            </template>

            <!-- KYT -->
             <template v-if="column.key === 'KYT'">
                <div class="kyt">
                    <div v-if="record.KYT === 'Passed'">
                        <img src="@/assets/images/tick2.png"/>
                        Passed
                    </div>
                    <div v-else-if="record.KYT === 'UnderReview'">
                        <img src="@/assets/images/review.png"/>
                        Under Review
                    </div>
                    <div v-else>-</div>
                </div>
            </template>


            <template v-if="column.key === 'action'">
                <div>
                    <img src="@/assets/images/copy.png" class="copy-img"/>
                </div>
            </template>
        </template>
        </a-table>
    </div>
    <div v-else class="no-listing">
        <div class="empty-img">
            <img src="@/assets/images/empty.png"/>
        </div>
        <div class="empty-info">Let’s start writing your options</div>
        <div class="add-option-btn" v-if="listingType == 'My'">
            <a-button 
                shape="round" 
                type="primary"
                @click="connectWallet"
                >
            <img class="" src="@/assets/images/add.png" />
            Write Options</a-button>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
  dataSource: {type: Array, default: []},
  columns: Array,
  listingType: {type: String, default: "All"}
});

</script>
<style scoped lang="less">
.no-listing{
    display: flex;
    flex-direction: column;
    align-items: center;
    .empty-img{
        margin-top: 32px;
        img{
           width: 72px; 
        }
    }
    .empty-info{
        color: var(--text-color-primary);
        font-size: 16px;
        font-weight: bold;
        margin-top: 16px;
    }
    .add-option-btn{
        margin-top: 32px;
        line-height: 16px;
        img{
            margin-right: 4px;
            width: 16px;
            vertical-align: text-bottom;
        }
    }
}
.owner-item{
    display: flex;
    justify-content: flex-start;
    width: 90px;
    align-items: center;
    .img-content{
        position: relative;
        .owner{
            width: 24px;
        }
        .network{
            position: absolute;
            right: -2px;
            bottom: 4px;
            width: 12px;
        }
    }
    .owner-info{
        line-height: 16px;
        margin-left: 4px;
        margin-top: -4px;
        .name{
            font-size: 14px;
            font-weight: bold;
        }
        .network{
            font-size: 12px;
            color: var(--text-color-second);
            line-height: 12px;
        }
    }
}
.strike-price{
    width: 66px;
}
.price{
    width: 50px;
}
.deribit-price{
    width: 70px;
}
.amount{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .token{
        width: 12px;
        margin-right: 2px;
    }
    .token-amount{
        color: var(--text-color-primary);
    }
    .total-amount{
        color: var(--text-color-second);
    }
}
.pay-with{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 66px;
    .token{
        width: 12px;
        margin-right: 2px;
    }
    .token-label{
        color: var(--text-color-primary);
    }
}
.accept{
    width: 100px;
}
.kyt{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 66px;
    img{
        width: 12px;
        margin-right: 2px;
    }
}
.copy-img{
    width: 16px;
}
:deep(.ant-table-content){
    font-size: 12px;
  .ant-table-thead {
    padding: 12px 16px;
    .ant-table-cell{
        background-color: var(--bg-color-page);
        color: var(--text-color-second);
        font-weight: normal;
        &::before{
        background-color: var(--bg-color-page) !important;
        }
    }
  }
}
:deep(.ant-table-tbody  .ant-table-cell-fix-right){
    padding: 0;
    right: -1px !important;
    &::after{
       box-shadow: inset -4px -4px 1px 4px rgba(255,255,255,0.5);
       width: 10px;
    }
}
:deep(.ant-table-thead .ant-table-cell){
    background-color: var(--bg-color-page);
}
:deep(.ant-table-thead .ant-table-cell-fix-right){
    right: -1px !important;
    &::after{
        box-shadow: inset -4px -4px 1px 4px rgba(255,255,255,0.5);
       width: 10px;
    }
}
</style>