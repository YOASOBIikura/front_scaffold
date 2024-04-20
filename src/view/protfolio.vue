<template>
    <div class="protfolio">
      <a-tabs class="protfolio-tabs" v-model:activeKey="data.activeKey">
        <!-- listing -->
        <a-tab-pane key="listing" tab="My Listings">
          <div class="contains" v-if="true">
            <pendingOrder v-for="(item) in 5" :key="item"></pendingOrder>
          </div>    

          <writeOptionEmpty class="empty" v-else ></writeOptionEmpty>
        </a-tab-pane>
        <!-- options -->
        <a-tab-pane key="options" tab="My Options" force-render >
          <div class="select" v-if="true">
                  <span class="text">9 Options</span>
                  <div class="list">
                    <div class="list-one">
                      <img  src="@/assets/images/selecttwo.png" alt="" @click="selectCondition">
                    </div>
                    <div class="list-two">
                    <img  src="@/assets/images/selectone.png" alt="" @click="sortCondition">
                    </div>
                  </div>
          </div>
           <div class="contains padding" v-if="true">
              <submitOrder v-for="(item) in 2" :key="item"  @liquidation="liquidationTx"></submitOrder> 
            </div>   
            <!-- empty -->
            <buyOptionEmpty class="empty"  v-else></buyOptionEmpty>   
        </a-tab-pane>      
      </a-tabs>
      <!-- dialog -->
      <protfolioFilter v-model:isOpen="data.isOpenSelect"></protfolioFilter>
      <protfolioSort v-model:isOpen="data.isOpenSort"></protfolioSort>
      <liquidation v-model:isOpen="data.isOpenLiquidation"></liquidation>
    </div>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"  
import submitOrder from "@/components/protfolio/submitOrder.vue"
import protfolioFilter from "@/components/protfolio/protfolioFilter.vue"
import protfolioSort from "@/components/protfolio/protfolioSort.vue"
import liquidation from "@/components/protfolio/liquidation.vue"
import buyOptionEmpty from "@/components/utils/buyOptionEmpty.vue"
import writeOptionEmpty from "@/components/utils/writeOptionEmpty.vue"
import {reactive} from "vue"
  let data=reactive({
    activeKey:"options",
    isOpenSelect:false,
    isOpenSort:false,
    isOpenLiquidation:false
  })

  //条件筛选
  var selectCondition=()=>{
       data.isOpenSelect=true
  }
  //排序
  var sortCondition=()=>{
    data.isOpenSort=true
  }

  // 清算
  var liquidationTx=()=>{
    console.log(121123223)
      data.isOpenLiquidation=true
  }
</script>

<style lang="less" >
  .protfolio{
     width: 100%;
     padding: 56px 0px 50px; 
     box-sizing: border-box;
     height: 100%;
     .protfolio-tabs{
        width: 100%;
        height: 100%;
        .ant-tabs-nav{
          padding:0 16px;
          box-sizing: border-box;
        }
        .ant-tabs-content{
          width: 100%;
          height: 100%;
          .contains{
            width: 100%;
            height: 100%;
            overflow-y:auto ;
            padding: 0 16px;
            box-sizing: border-box;        
          }
          .padding{
            padding-bottom: 50px;
          }
        }
     }
     .select{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        box-sizing: border-box;
        .text{
          font-size: 16px;
          color: var(--text-color-primary);
        }
        .list{
          display: flex;
          flex-direction: row;
          align-items: center;
          .list-one{
            width: 32px;
            height: 32px;
            border-radius: 50%;     
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-color-secondarycontainer);
            img{
              width: 16px;
              height: 16px;
            }
          }
          .list-two{
            width: 32px;
            height: 32px;
            border-radius: 50%;  
            margin-left: 9px;   
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;        
            background-color: var(--bg-color-secondarycontainer);
            img{
              width: 16px;
              height: 16px;
            }

          }
        }
      }
      .empty{
        width: 100%;
        height: 100%;
      }

  }

</style>