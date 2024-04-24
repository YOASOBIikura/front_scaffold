<template>
      <a-drawer v-if="props.isOpen" height="420px" class="assetTranfer"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen"  @close="closeDrawer" >
        <template v-slot:title v-if="true">
             <div class="filter">
                 <!-- <img  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer"> -->
                 <span></span>
                 <span class="title">{{ props.type}}</span>
                 <span></span>
             </div>
        </template>
        <div class="tranferResult">
              <img class="icon" :src="props.tokenInfo.img" alt="">     
              <span class="balance">{{ data.showAmount }}{{ props.tokenInfo.name }}</span>
              <p class="info">
                 <span class="text1">Wallet</span>
                 <img class="icon2" :src="data.png" alt="">
                 <span class="text2">JVault</span>
              </p>    
              <div class="cost">
               <span class="right">{{`${String(props.hash).substring(0,6)}...${String(props.hash).substring(38)}`}}</span>
                <p class="left">         
                    <span class="text">Hash</span>
                    <img class="icon3" src="@/assets/images/cost.png" alt="">
                </p>
                
              </div>

              <!--  -->
              <div class="btn" @click="closeDrawer">
                 <img class="icon4" src="@/assets/images/certified.png" alt="">
                 <span class="text">Done</span>
              </div>
        </div>
      </a-drawer>
</template>
<script setup> 
import { reactive,defineProps,defineEmits,onMounted} from 'vue';
import issuePng from "@/assets/images/arrow_right2.png"
import redeemPng from "@/assets/images/arrow_left.png"
import { BigNumber, ethers } from 'ethers';
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   },
   tokenInfo:{
       type:Object,
       require:true,
       default:{}
   },
   hash:{
      type:String,
      require:false,
      default:""
   },
   type:{
      type:String,
      require:true,
      default:"issue"
   },
   amount:{
      type:[String,Object],
      require:true,
      default:"0"
   },
   txResult:{
      type:Object,
      require:false
   },
   decimals:{
      type:Number,
      require:true,
      default:18
   }
})
const emits=defineEmits(["update:isOpen"])
let data=reactive({
   title:"issue",
   png:issuePng,
   showAmount:BigNumber.from("0")
})

onMounted(()=>{
    if(props.type=="issue"){
      data.png=issuePng
     
    }else{
      data.png=redeemPng
    }
    data.showAmount=(BigNumber.from(props.amount).div(ethers.utils.parseUnits("1",props.decimals-2)).toNumber()/100).toFixed()
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