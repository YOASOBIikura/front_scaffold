<template>
  <div>
    <layoutavatar></layoutavatar>
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
</template>

<script setup>
import layoutavatar from "../components/assets/layout-avatar.vue"
import {reactive, ref} from "vue";

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
}
.centre_inner{
  background: #FFFFFF;
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