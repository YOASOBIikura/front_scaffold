
<template>
    <div class="page">
        <a-menu v-model:selectedKeys="baseData.currentSelectOption" mode="horizontal" :items="menuOptionType" />
        <div class="order-content">
            <!-- 价格提示 -->
            <div class="price-tips-content">
                I expect ETH $3,000 -> $3,100 in 6d
            </div>
            <!-- 选择期权币种 -->
            <div class="select-option-token-content">
                <select-switch 
                    :switchList="optionTokenSwitchList" 
                    v-model:value="baseData.currentSelectOptionToken"
                    theme="white"
                ></select-switch>
            </div>
            <!-- 选择行权日期和行权价格 -->
            <div class="option-select-content">
                <div class="option-card">
                    <div class="title">Expiry Date</div>
                    <div>
                    <swiperSelect 
                        :options="options" @selectChange="selectChange"></swiperSelect>
                    </div>
                </div>
                <div class="option-card">
                    <div class="title">Strike Price</div>
                     <div>
                    <swiperSelect 
                        :options="options" @selectChange="selectChange"></swiperSelect>
                    </div>
                </div>
            </div>
            <!-- 选择单子类型 -->
            <div class="select-list-switch">
                <select-switch 
                    :switchList="listingSwitchList" 
                    v-model:value="baseData.currentListing"
                    theme="black"
                    @change="changeListSwitch"
                >
                  <template></template>
                </select-switch>
            </div>
            <!-- 表格显示 -->
            <!-- 所有订单 -->
            <div class="all-listing-table">
              <listing-table    
                :dataSource="allListingData" 
                :columns="allListColumns"
                :listingType="baseData.currentListing"
              >
              </listing-table>
            </div>
            <!-- 我的订单 -->
        </div>
    </div>
</template>


<script setup>
import { ref, reactive } from "vue"
import selectSwitch from "../components/utils/select-switch.vue"
import swiperSelect from "../components/utils/swiper-select.vue"
import listingTable from "../components/marketPlace/listing-table.vue"
// 菜单区分类型
const menuOptionType = reactive([
    {
        key: 'call',
        label: 'Call option valuts',
        title: 'Call option valuts',
    },
    {
        key: 'put',
        label: 'Put option vaults',
        title: 'Put option vaults'
    }
]);
const optionTokenSwitchList = [
  {key: 'ETH',label: 'ETH', icon: "/src/assets/images/eth.png"},
  {key: 'WBTC', label: 'WBTC', icon: "/src/assets/images/wbtc.png"}
];
// 订单类型选择
const listingSwitchList = [{key: 'All', label: 'All Listings'},{key: 'My', label: 'My Listings'}]


let baseData = reactive({
  currentSelectOption: ["call"],
  currentSelectOptionToken: "ETH",
  currentListing: "All"
});


// 订单日期TODO
const options = reactive([
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  },
  {
    value: '1',
    name: '12 DEC 23'
  }
])
const selectChange = (index) => {
    console.log(index);
}



// 所有订单数据
let allListColumns = [
  { title: "Owner" ,dataIndex: "owner", key: "owner"},
  { title: "Strike Price",dataIndex: "strikePrice",key: "strikePrice"},
  { title: "Price", dataIndex: "price", key: "price"},
  { title: "Deribit Price", dataIndex: "deribitPrice", key: "deribitPrice"},
  { title: "Amount", dataIndex: "amount", key: "amount"},
  { title: "Pay With", dataIndex: "payWith", key: "payWith"},
  { title: "Accept", dataIndex: "accept", key: "accept"},
  { title: "KYT", dataIndex: "KYT", key: "KYT"}
];
let allListingData = reactive([
  {
    owner: "0x3...dfa",
    strikePrice: "3100",
    price: "2000",
    deribitPrice: "2500",
    amount: 10,
    totalAmount: 500,
    payWith: ["USDC", "USDT"], // TODO 
    accept: "Cash Settlement",
    KYT: "Passed"
  }
]);


const changeListSwitch = (value) => {
  console.log(value);
  let baseData = [
  {
    owner: "0x3...dfa",
    strikePrice: "3100",
    price: "2000",
    deribitPrice: "2500",
    amount: 10,
    totalAmount: 500,
    payWith: ["USDC", "USDT"], // TODO 
    accept: "Cash Settlement",
    KYT: "Passed"
  }
];
  if(value == "My"){
    allListingData = [];
  } else {
    allListingData = baseData;
  }
}

</script>


<style scoped lang="less">
.page{
    max-width: 400px;
}
.order-content{
    padding: 16px 32px;
    .price-tips-content{
      padding: 0px 8px;
      background-color: rgba(1, 167, 84, 0.07);
      color: var(--text-color-success);
      border-radius: 8px;
      height: 40px;
      line-height: 40px;
      margin-bottom: 16px;
    }

    .select-option-token-content{
      margin-bottom: 16px;
    }

    .option-select-content{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        .option-card{
            height: 167px;
            width: calc(50% - 8px);
            border-radius: 16px;
            box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.1);
            .title{
                height: 48px;
                line-height: 48px;
                font-size: 14px;
                border-bottom: 1px solid var(--component-border);
                text-align: center;
            }
            
        }
    }

    .select-list-switch{
        width: 200px;
    }
    .all-listing-table{
      width: 100%;
      max-height: 340px;
      overflow: auto;
      margin-top: 16px;
    }
}


</style>
