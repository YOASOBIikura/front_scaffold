<template>
    <div class="protfolio">
      <a-tabs v-model:activeKey="data.activeKey">
        <!-- listing -->
        <a-tab-pane key="listing" tab="My Listings">
             <pendingOrder v-for="(item) in 2" :key="item"></pendingOrder>
        </a-tab-pane>
        <!-- options -->
        <a-tab-pane key="options" tab="My Options" force-render >
           <div class="select" v-if="true">
              <div class="select-content">
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
              <submitOrder v-for="(item) in 2" :key="item"></submitOrder> 
            </div>   
            <!-- empty -->
            <div class="empty" v-else>
                 <img class="icon" src="@/assets/images/empty.png" alt="">
                 <span class="text">You don't currenty hava options</span>
                 <span class="btn">Buy an Option</span>
            </div>
        </a-tab-pane>      
      </a-tabs>
      <!-- dialog -->
      <protfolioFilter></protfolioFilter>
      <protfolioSort></protfolioSort>
      <liquidation></liquidation>
    </div>
</template>

<script setup>
import pendingOrder from "@/components/protfolio/pendingOrder.vue"
import submitOrder from "@/components/protfolio/submitOrder.vue"
import protfolioFilter from "@/components/protfolio/protfolioFilter.vue"
import protfolioSort from "@/components/protfolio/protfolioSort.vue"
import liquidation from "@/components/protfolio/liquidation.vue"
import {reactive} from "vue"
  let data=reactive({
    activeKey:"options",
    openSelectCondition:true,
    openSortCondition:false
  })

  //条件筛选
  var selectCondition=()=>{
       data.openSelectCondition=true
  }
  //排序
  var sortCondition=()=>{
    data.openSortCondition=true
  }
</script>

<style lang="less" >
  .protfolio{
     width: 100%;
     padding: 0px 16px; 
     .select{
      width: 100%;
      .select-content{
          width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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

     } 
     .empty{
       width: 100%;
       height: 100%;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       .icon{
          width: 72px;
          height: 72px;
          margin-bottom: 16px;
       }
       .text{
          color: var(--text-color-primary);
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
       }
       .btn{
          background-color:var(--bg-color-container-active) ;
          color: var(--bg-color-page);
          border-radius: 32px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          padding: 7px 12px;
          box-sizing: border-box;
       }
       
     }
  }

</style>