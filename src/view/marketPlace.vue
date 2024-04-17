
<template>
    <div class="page">
        <a-menu v-model:selectedKeys="currentSelectOption" mode="horizontal" :items="menuOptionType" />
        <div class="order-content">
            <!-- 价格提示 -->
            <div class="price-tips-content">
                I expect ETH $3,000 -> $3,100 in 6d
            </div>
            <!-- 选择期权币种 -->
            <div class="select-option-token-content">
                <select-switch 
                    :switchList="optionTokenSwitchList" 
                    v-model:value="currentSelectOptionToken"
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
                </div>
            </div>
            <!-- 选择单子类型 -->
            <div class="select-list-switch">
                <select-switch 
                    :switchList="listingSwitchList" 
                    v-model:value="currentListing"
                    theme="black"
                ></select-switch>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, reactive } from "vue"
import selectSwitch from "../components/select-switch.vue"
import swiperSelect from "../components/swiper-select.vue"
// 菜单区分类型
const menuOptionType = ref([
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
let currentSelectOption = ref(['call']);

// 选择option币种
const optionTokenSwitchList = [{name: 'ETH',label: 'ETH'},{name: 'BTC', label: 'BTC'}];
let currentSelectOptionToken = ref("ETH");

// 订单类型选择
const listingSwitchList = [{name: 'All', label: 'All Listings'},{name: 'My', label: 'My Listings'}]
let currentListing = ref("All");

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
}

</style>
