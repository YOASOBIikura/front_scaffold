<template>
  <div class="list_page">
    <div class="option">
      <div class="btn">
        <button :style="data.mar?active:{}" @click="handleBtn('mar')">MarketPlace</button>
        <button :style="data.my?active:{}" @click="handleBtn('my')">My listing</button>
      </div>
      <button class="search">
        <img src="../../assets/images/search.png" alt="search"/>
      </button>
    </div>
    <div class="mark">
      <span>LP Vault</span>
      <span>Time</span>
      <img src="../../assets/images/caret-up-small.png" alt="up and down"/>
      <span>Premium</span>
      <img src="../../assets/images/caret-up-small.png" alt="up and down"/>
      <span>Available(SOL)</span>
    </div>
    <div class="list">
      <Table v-for="item in getItems" :key="item.id" />
    </div>
  </div>
</template>

<script setup>

import {computed, reactive} from "vue";
import Table from "@/components/degen/table.vue"

let data = reactive({
  mar: true,
  my: false,
  items: []
})

let active = reactive({
  backgroundColor: 'var(--bg-color-page)',
  color: 'var(--text-color-primary)',
  boxShadow: 'box-shadow: 1px 4px 16px 0px #00000014'
})

const getItems = computed(()=>{
  for (let i = 0; i < 30; i++) {
    let obj = new Object()
    obj.id = i
    data.items.push(obj)
  }
  return data.items
})

function handleBtn(sign){
  if (sign == 'mar'){
    data.mar = true
    data.my = false
  }else if (sign == 'my'){
    data.mar = false
    data.my = true
  }
}

</script>

<style scoped lang="less">
.list_page{
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}
.option{
  display: flex;
  margin-top: 16px;
  margin-left: 8px;
  .btn{
    display: flex;
    border-radius: 24px;
    background-color: var(--bg-color-unActive);
    button{
      border: none;
      background-color: transparent;
      border-radius: 24px;
      width: 109px;
      height: 32px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: var(--text-color-tabs-unActive);
      margin-top: 3px;
      margin-bottom: 3px;
      &:first-child{
        margin-left: 4px;
      }
      &:last-child{
        margin-right: 4px;
      }
    }
  }
}
.search{
  border: none;
  background-color: transparent;
  img{
    width: 24px;
    height: 24px;
    margin-left: 85px;
  }
}
.mark{
  display: flex;
  height: 48px;
  align-items: center;
  border-bottom: 1px solid var(--component-border);
  img{
    width: 16px;
    height: 16px;
  }
  span{
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: var(--text-color-tabs-unActive);
    &:first-child{
      padding-left: 12px;
      padding-right: 53px;
    };
    &:nth-child(2){
      margin-left: 10px;
      padding-left: 10px;
    };
    &:nth-child(4){
      margin-left: 9.67px;
    };
    &:last-child{
      margin-left: 9.67px;
      padding-right: 12px;
    }
  }
}
.list{
  width: 100%;
  height: 60%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>