<template>
    <div class="protfolio">
      <a-tabs v-model:activeKey="data.activeKey">
        <a-tab-pane key="listing" tab="My Listings">
             <pendingOrder></pendingOrder>

        </a-tab-pane>
        <a-tab-pane key="options" tab="My Options" force-render >


        </a-tab-pane>      
       
      </a-tabs>
    </div>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"
import {reactive} from "vue"
  let data=reactive({
    activeKey:"listing"
  })
</script>

<style lang="less" >
  .protfolio{
     width: 100%;
     padding: 0px 16px;  
     .ant-tabs .ant-tabs-tab{
        color:var(--text-color-tabs-unActive);
        font-size: 16px;
     }
     .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
       font-size: 16px;
       color:var(--text-color-tabs-active);
     }
  }
</style>