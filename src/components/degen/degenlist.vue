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
      <div class="m_t">
        <span>Time</span>
        <img src="../../assets/images/caret-up-small.png" alt="up and down"/>
      </div>
      <div class="m_p">
        <span>Premium</span>
        <img src="../../assets/images/caret-up-small.png" alt="up and down"/>
      </div>
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
  width: 100%;
}
.option{
  display: flex;
  margin-top: 16px;
  margin-left: 8px;
  width: 100%;
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
  width: 100%;
  display: flex;
  border: none;
  background-color: transparent;
  align-items: center;
  justify-content: flex-end;
  margin-right: 8px;
  img{
    width: 24px;
    height: 24px;
  }
}
.mark{
  display: flex;
  height: 48px;
  align-items: center;
  border-bottom: 1px solid var(--component-border);
  margin-left: 8px;
  margin-right: 8px;
  justify-content: space-between;
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
      margin-left: 12px;
      width: 31%;
    }
    &:last-child{
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
      margin-right: 12px;
      width: 23%;
      min-width: 90px;
    }
  }
  div{
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .m_t{
    width: 13%;
    min-width: 46px;
    span{
      min-width: 30px;
    }
  }
  .m_p{
    width: 18%;
    min-width: 66px;
    span{
      min-width: 50px;
    }
  }
}
.list{
  height: 60%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 23%;
  &::-webkit-scrollbar{
    width: 1px;
  }
}
</style>