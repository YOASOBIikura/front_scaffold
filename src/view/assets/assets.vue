<template>
    <div class="assets">
        <assetHeader></assetHeader>
        <div class="total-info">
              <p class="infop1">
                  <span class="title">Total Asset</span>
                  <span class="text">$2483</span>
              </p>  
              <p class="infop2">
                  <span class="title">Wallet</span>
                  <span class="text">$2328</span>
              </p>
              <p  class="infop2">
                  <span class="title">JVault</span>
                  <span class="text">$253322</span>
              </p>
        </div>
        <assetOption v-for="(item,index) in 4" :key="index"></assetOption>
    </div>
</template>
<script setup>
import assetHeader from "@/components/assets/assetHeader.vue"
import assetOption from "@/components/assets/assetOption.vue"

</script>
<style lang="less" scoped>
   .assets{
      width: 100%;
      .total-info{
          width: 100%;
          padding: 24px 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          .infop1{
             display: flex;
             flex-direction: column;
             .title{
                color: var(--text-color-primary);
                font-size: 14px;
                margin-bottom: 8px;
             }
             .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
             }
          }
          .infop2{
             display: flex;
             flex-direction: column;
             align-items: flex-end;
             .title{
                color: var(--text-color-primary);
                font-size: 14px;
                margin-bottom: 8px;
             }
             .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
             }        
          }
      }
   }
</style>