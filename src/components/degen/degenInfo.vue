<template>
  <div class="info">
    <div class="inter">
      <div class="token">
        <img src="../../assets/images/accountDemo.png" alt="token img"/>
        <div class="symbol">
          <span id="name">Solana</span>
          <span id="sym">SOL</span>
        </div>
        <div class="price">
          <span class="pri">Price (2h%)</span>
          <div class="money">
            <span>$3,847.99</span>
            <span>(-0.90%)</span>
          </div>
        </div>
        <img src="../../assets/images/chevron-down.png" alt="To down"/>
      </div>
      <div class="option">
        <img src="../../assets/images/Kline.png" alt="K line"/>
      </div>
    </div>
    <div class="type">
      <button :style="data.call?activeCallORPut:{}" @click="handleCallOrPut('call')">Call</button>
      <button :style="data.put?activeCallORPut:{}" @click="handleCallOrPut('put')">Put</button>
    </div>
    <div class="time">
      <button :style="data.time[0]?activeTime:{}" @click="handleTime(0)"><2H</button>
      <button :style="data.time[1]?activeTime:{}" @click="handleTime(1)">2h-8h</button>
      <button :style="data.time[2]?activeTime:{}" @click="handleTime(2)">8h-24h</button>
    </div>
  </div>
</template>

<script setup>

import {reactive} from "vue";

let data = reactive({
  call: true,
  put: false,
  time: [false, true, false]
})

let activeCallORPut = reactive({
  backgroundColor: 'var(--bg-color-page)',
  color: 'var(--text-color-error)',
  boxShadow: '1px 4px 16px 0px #00000014'
})

let activeTime = reactive({
  backgroundColor: 'var(--bg-color-page)',
  color: 'var(--text-color-degen-active)',
  boxShadow: '1px 4px 16px 0px #00000014'
})

function handleCallOrPut(sign){
  if (sign == 'call'){
    data.call = true
    data.put = false
  }else if (sign == 'put'){
    data.call = false
    data.put = true
  }
}

function handleTime(index){
  data.time = [false, false, false]
  data.time[index] = true
}

</script>

<style scoped lang="less">
.info{
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  gap: 8px;
}
.inter{
  display: flex;
}
.token{
  display: flex;
  background-color: var(--bg-color-unActive);
  border-radius: 18px;
  width: 86%;
  img{
    width: 28px;
    height: 28px;
    margin-top: 12px;
    margin-left: 12px;
    margin-bottom: 8px;
  }
  .symbol{
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    margin-bottom: 4px;
    margin-left: 8px;
    border-right: 2px solid var(--component-border);
    padding-right: 16px;
    #name{
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
    #sym{
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.55);
    }
  }
  .price{
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    margin-bottom: 6px;
    margin-left: 17px;
    .pri{
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: var(--text-color-primary);
    }
    .money{
      display: flex;
      gap: 4px;
      span:first-child{
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
      }
      span:last-child{
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: var(--text-color-error);
      }
    }
  }
  img:last-child{
    width: 24px;
    height: 24px;
    margin: 12px 12px 19px 12px;
  }
}
.option{
  border-radius: 18px;
  margin-left: 8px;
  background-color: var(--bg-color-unActive);
  img{
    width: 24px;
    height: 24px;
    margin: 12px;
  }
}
.type{
  display: flex;
  border-radius: 24px;
  gap: 4px;
  background-color: var(--bg-color-unActive);
  button{
    border: none;
    width: 47.5%;
    height: 32px;
    background-color: transparent;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: var(--text-color-tabs-unActive);
    border-radius: 24px;
    margin-top: 4px;
    margin-bottom: 4px;
    margin-left: 4px;
  }
}
.time{
  display: flex;
  border-radius: 24px;
  gap: 4px;
  background-color: rgba(247, 247, 247, 1);
  button{
    border: none;
    width: 31.5%;
    height: 32px;
    background-color: transparent;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: var(--text-color-tabs-unActive);
    margin-top: 4px;
    margin-bottom: 4px;
    border-radius: 24px;
    &:first-child{
      margin-left: 4px;
    }
    &:last-child{
      margin-left: 3px;
    }
  }
}
</style>