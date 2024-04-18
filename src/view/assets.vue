<template>
  <div>
    <layoutavatar :account="accountInfo"></layoutavatar>
  </div>

  <div class="centre">
    <div class="centre_inner">
      <div class="info_1">
        <p>Total Asset</p>
        <label>${{total.value}}</label>
      </div>
      <div class="info_2">
        <p>Wallet</p>
        <label>${{wallet.value}}</label>
      </div>
      <div class="info_3">
        <p>jWallet</p>
        <label>${{jWallet.value}}</label>
      </div>
    </div>
  </div>
  <div>
    <ul>
      <li v-for="(item, index) in assetList.list" :key="index">
        <layouttoken :asset="item"></layouttoken>
      </li>
    </ul>
  </div>
</template>

<script setup>
import layoutavatar from "../components/assets/layout-avatar.vue"
import layouttoken from "../components/assets/layout-token.vue"
import {reactive, ref} from "vue";

const accountInfo = reactive({data:{
    name: "Joey268",
    address: "0x69...350d",
    photo: "/src/assets/images/avatarDemo.png"
  }
})

const assetInfo = reactive({data:{
    token_img: "/src/assets/images/token-eth.png",
    token_symbol: "ETH",
    wallet_amount: "30.234",
    wallet_value: "10,131.67",
    jWallet_amount: "102.368",
    jWallet_value: "232,131.60"
  }
})

const assetList = reactive({
  list: [
    {
      token_img: "/src/assets/images/token-eth.png",
      token_symbol: "ETH",
      wallet_amount: "30.234",
      wallet_value: "10,131.67",
      jWallet_amount: "102.368",
      jWallet_value: "232,131.60"
    },
    {
      token_img: "/src/assets/images/wbtc.png",
      token_symbol: "WBTC",
      wallet_amount: "23.56",
      wallet_value: "12,584.12",
      jWallet_amount: "0.23",
      jWallet_value: "125.52"
    },
    {
      token_img: "/src/assets/images/token-usdt.png",
      token_symbol: "USDT",
      wallet_amount: "2,131.23",
      wallet_value: "2,131.23",
      jWallet_amount: "123.45",
      jWallet_value: "125.52"
    },
    {
      token_img: "/src/assets/images/usdc.png",
      token_symbol: "USDC",
      wallet_amount: "88.88",
      wallet_value: "88,88",
      jWallet_amount: "0",
      jWallet_value: "0"
    }
  ]
})

const asset_data = [
  {
    token_img: "/src/assets/images/token-eth.png",
    token_symbol: "ETH",
    wallet_amount: "30.234",
    wallet_value: "10,131.67",
    jWallet_amount: "102.368",
    jWallet_value: "232,131.60"
  },
  {
    token_img: "/src/assets/images/wbtc.png",
    token_symbol: "WBTC",
    wallet_amount: "23.56",
    wallet_value: "12,584.12",
    jWallet_amount: "0.23",
    jWallet_value: "125.52"
  },
  {
    token_img: "/src/assets/images/token-usdt.png",
    token_symbol: "USDT",
    wallet_amount: "2,131.23",
    wallet_value: "2,131.23",
    jWallet_amount: "123.45",
    jWallet_value: "125.52"
  },
  {
    token_img: "/src/assets/images/usdc.png",
    token_symbol: "USDC",
    wallet_amount: "88.88",
    wallet_value: "88,88",
    jWallet_amount: "0",
    jWallet_value: "0"
  }
]

// total Asset
const total = reactive({value: "2,483.08"})

// wallet
const wallet = reactive({value: "2,382.88"})

// jWallet
const jWallet = reactive({value: "100.20"})



function setTotal(value){
  total.value = value
}

function setWallet(value){
  wallet.value = value
}

function setjWallet(value){
  jWallet.value = value
}

</script>

<style scoped lang="less">
.centre{
  background: #F0F0F0;
  padding-top: 8px;
  height: 89px;
}
.centre_inner{
  background: #FFFFFF;
  height: 81px;
  div{
    float: left;
    margin-top: 24px;
  }
  p{
    font-size: 14px;
    margin-bottom: 8px;
  }
  label{
    font-weight: 600;
    width: 100px;
  }
  .info_1{
    margin-left: 16px;
  }
}
.info_2{
  margin-left: 66px;
  p{
    margin-left: 35px;
  }
}
.info_3{
  margin-left: 53px;
  p{
    margin-left: 18px;
  }
}
</style>