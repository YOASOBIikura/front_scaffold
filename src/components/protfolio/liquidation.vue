<template>
      <a-drawer  class="liquidation" height="500px"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen">
        <template v-slot:title>
             <div class="filter">
                 <!-- <img  class="close" src="@/assets/images/close.png" alt="" @click="data.openSortCondition=false"> -->
                 <span></span>
                 <span class="title">Choose Exercise Method</span>
                 <span></span>
             </div>
        </template>
        <div class="liquidation-body">
            <div class="settle settle-active">
                <img class="icon" src="@/assets/images/method1.png" alt="">
                <p class="info">
                    <span class="text1">Cash settlemnt</span>
                    <span class="text2">Get 0.23ETH</span>
                    <span class="text3">≈$898</span>
                </p>
                <span class="status">Recommend</span>
            </div>

            <div class="settle">
                <img class="icon" src="@/assets/images/method2.png" alt="">
                <p class="info">
                    <span class="text1">Asset Delivery</span>
                    <span class="text2">Pay 3100USDT to get 1ETH</span>
                    <span class="text3">≈$898</span>
                </p>
            </div>

            <div class="warn">
                <img class="icon" src="@/assets/images/warn.png" alt="">
                <span class="text">Slippage in trading may cause deviations</span>
            </div>
            

            <div class="btn btn1 select">Exercise</div>
            <div class="btn" @click="closeDrawer">Not Now</div>
       </div>
      </a-drawer>
</template>
<script setup>
import { reactive,defineProps,defineEmits} from 'vue';
const data=reactive({

})
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   }
})
const emits= defineEmits(["update:isOpen"])
//关闭弹窗
var closeDrawer=()=>{
   emits("update:isOpen",false)
}
</script>
<style lang="less" scoped>
      .liquidation{
        width: 100%;
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


        .liquidation-body{
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            .settle{
                width: 100%;
                height: 94px;
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;
                padding: 16px 24px;
                box-sizing: border-box;
                border:1px solid  var( --border-color);
                border-radius: 8px;
                margin-bottom: 16px;
                .icon{
                    width: 24px;
                    height: 24px;
                    margin-right: 28px;
                }
                .info{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .text1{
                    color: var(--text-color-second);
                    font-size: 14px;
                    }
                    .text2{
                    color: var(--text-color-primary);
                    font-size: 14px;
                    } 
                    .text3{
                    color: var(--text-color-primary);
                    font-size: 14px;
                    }
                }
                .status{
                    display: flex;
                    background-color: var(--text-color-third);
                    color: var( --text-color-active);
                    font-size: 12px;
                    border-radius: 4px;
                    padding: 2.5px 4px;
                    position: absolute;
                    right: 16px;
                    top: 16px;
                }
            }
            .settle-active{
                background-color: var(--bg-color-secondarycontainer);
                border:1px solid var(--bg-color-container-active) ;
            }
            .warn{
               width: 100%;
               background-color: var(--bg-color-warn);
               border-radius:8px;
               padding: 14px;
               box-sizing: border-box;
               display: flex;
               flex-direction: row;
               align-items: center;
               .icon{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                margin-right: 8px;
               }
               .text{
                 color: var(--text-color-primary);
                 font-size: 12px;
               }
            }

       }
        .btn{
            width: 100%;
            height: 48px;
            line-height: 48px;
            text-align: center;
            background-color: var(--component-border);
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color-second);
            border-radius: 8px; 
            margin-bottom: 8px;
        }
        .btn1{
            margin-top: 20px;
        }
        .select{
            background-color: var(--bg-color-container-active);
            color: var(--text-color-active);
        }
      }

 

 


 



</style>