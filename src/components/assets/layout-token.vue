<template>
  <div class="token_info">
    <div class="info">
      <div>
        <img class="token" :src="asset.token_img">
        <p id="symbol">{{asset.token_symbol}}</p>
      </div>
      <div class="token_asset_1">
        <p>{{asset.wallet_amount}}</p>
        <label>${{asset.wallet_value}}</label>
      </div>
      <div class="token_asset_2">
        <p>{{asset.jWallet_amount}}</p>
        <label>${{asset.jWallet_value}}</label>
      </div>
    </div>
    <div class="option">
      <div>
        <button v-on:click="" class="btn1"><img src="@/assets/images/arrow_right2.png"></button>
      </div>
      <div>
        <button v-on:click="" class="btn2"><img src="@/assets/images/arrow_left.png"></button>
      </div>
      <div>
        <button v-on:click="" class="btn3"><img src="@/assets/images/add2.png"><p id="sub">Write Options</p></button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({asset:{type: Object}})


</script>

<style scoped lang="less">
.info{
  width: 375px;
  height: 80px;
}
.token_info{
  border-top: 3px solid #F0F0F0;
  height: 133px;
  .token{
    float: left;
    margin-left: 16px;
    margin-top: 26px;
    width: 50px;
    height: 50px;
  }
  #symbol{
    float: left;
    margin-left: 12px;
    margin-top: 40px;
    font-weight: 600;
    font-size: 16px;
    width: 70px;
  }
}
.token_asset_1, .token_asset_2{
  float: left;
  margin-top: 28px;
  p{
    font-size: 16px;
    font-weight: 400;
  }
  label{
    font-size: 12px;
    font-weight: 400;
    color: #8E8E8E;
  }
}
.token_asset_1{
  margin-left: 30px;
  width: 61px;
}
.token_asset_2{
  margin-left: 48px;
  width: 61px;
}
.option{
  .btn1{
    float: left;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    margin-left: 16px;
    margin-top: 10px;
  }
  .btn2{
    float: left;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    margin-top: 10px;
    margin-left: 8px;
  }
  .btn3{
    float: left;
    width: 263px;
    height: 32px;
    border-radius: 30px 30px 30px 30px;
    border: none;
    margin-top: 10px;
    margin-left: 8px;
    img{
      float: left;
      width: 16px;
      height: 16px;
      margin-left: 76px;
    }
    #sub{
      float: left;
      margin-left: 4px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>