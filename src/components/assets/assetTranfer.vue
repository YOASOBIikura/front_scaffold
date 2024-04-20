<template>
      <a-drawer height="420px" class="assetTranfer"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen"  @close="closeDrawer" >
        <template v-slot:title v-if="true">
             <div class="filter">
                 <img  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
                 <span class="title">tranfer</span>
                 <span></span>
             </div>
        </template>
        <div class="tranferResult">
              <img class="icon" src="@/assets/images/token-eth.png" alt="">     
              <span class="balance">20ETH</span>
              <p class="info">
                 <span class="text1">Wallet</span>
                 <img class="icon2" src="@/assets/images/arrow_right2.png" alt="">
                 <span class="text2">JVault</span>
              </p>    
              <div class="cost">
                <p class="left">
                    <img class="icon3" src="@/assets/images/cost.png" alt="">
                    <span class="text">Network Cost</span>
                </p>
                <span class="right">0.002Eth</span>
              </div>

              <!--  -->
              <div class="btn">
                 <img class="icon4" src="@/assets/images/certified.png" alt="">
                 <span class="text">Done</span>
              </div>
        </div>
      </a-drawer>
</template>
<script setup> 
import { reactive,defineProps,defineEmits} from 'vue';
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   }
})
const emits=defineEmits(["update:isOpen"])
let data=reactive({

})
var closeDrawer=()=>{
   emits("update:isOpen",false)
}
</script>
<style lang="less" scoped>
.assetTranfer{
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
     .tranferResult{
         width: 100%;
         padding: 16px;
         box-sizing: border-box;
         display: flex;
         flex-direction: column;
         align-items: center;
         .icon{
            width: 40px;
            height: 40px;
            border-radius:50%;
            margin-bottom: 12px;
         }
         .balance{
            font-size: 36px;
            color: var(--text-color-primary);
            font-weight: 600;
            margin-bottom: 12px;
         }
         .info{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            color: var(--text-color-primary);
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 48px;
            .icon2{
              margin-left: 6px;
              margin-right: 6px;
              width: 12px;
              height: 12px;
            }
         }
         .cost{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 17px;
            border-top:1px solid var(--border-color) ;
            padding-top: 16px;
            .left{
                display: flex;
                flex-direction: row;
                align-items: center;
                .icon3{
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
                .text{
                    color: var( --text-color-second);
                    font-size: 14px;
                }
            }
            .right{
                font-size: 14px;
                color: var(--text-color-primary);
            }
         }
         .btn{
            margin-top: 32px;
            width: 100%;
            height: 48px;
            border-radius: 8px;
            background-color: var(--bg-color-secondarycontainer);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .icon4{
               width: 16px;
               height: 16px;
               margin-right: 6px;
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