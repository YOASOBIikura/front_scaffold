<template>
      <a-drawer  class="protfolioSort" height="260px"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="data.openSortCondition"  @close="data.openSortCondition=false" >
        <template v-slot:title>
             <div class="filter">
                 <img  class="close" src="@/assets/images/close.png" alt="" @click="data.openSortCondition=false">
                 <span class="title">Sort</span>
                 <span></span>
             </div>
        </template>
        <div class="sort-all">
                <div class="sort-item">
                    <div class="text">Recommended</div>
                    <a-radio :value="'Recommended'"></a-radio>
                  
                </div>
                <div class="sort-item">
                    <span  class="text">Expiry Date</span>        
                    <a-radio :value="'ExpiryDate'"></a-radio>
                </div>
                <div class="sort-item">
                    <span  class="text">Start Date</span>
                    <a-radio :value="'StartDate'"></a-radio>
                </div>                
                
        </div>
      </a-drawer>
</template>
<script setup>
import { reactive } from 'vue';
let data=reactive({
    openSortCondition:false,
    sortSelect:"Recommended"
  })
</script>
<style lang="less" scoped>
.protfolioSort{
    width: 100%;
}
     .filter{
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .text{
          font-size: 16px;
          font-weight: 600;
          color: var( --text-color-primary);
        }
        .close{
          width: 24px;
          height: 24px;
        }
     }
     .sort-all{
        width: 100%;
        margin-top: 14px;
        padding: 16px;
        box-sizing: border-box;
          .sort-item{
            padding: 14px 0px;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .text{
             color: var(--text-color-primary);
             font-size: 16px;
            }
          }
        

     }



</style>