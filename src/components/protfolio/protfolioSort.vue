<template>
      <a-drawer v-if="props.isOpen"  class="protfolioSort" height="350px"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen"  >
        <template v-slot:title>
             <div class="filter">
                 <img  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
                 <span class="title">Sort</span>
                 <span></span>
             </div>
        </template>
        <div class="sort-all">
           <a-radio-group v-model:value="data.value" @change="change">
                <!-- <div class="sort-item">
                    <div class="text">Recommended</div>
                    <a-radio :value="'Recommended'"></a-radio>
                  
                </div> -->
                <div class="sort-item">
                    <span  class="text">Expiry Date</span>        
                    <a-radio :value="1"></a-radio>
                </div>
                <div class="sort-item">
                    <span  class="text">Start Date</span>
                    <a-radio :value="3"></a-radio>
                </div>                
            </a-radio-group>
        </div>
        <div class="btnContent">
          <div class="btn btn1 select" @click="confirm">Confirm</div>
          <div class="btn " @click="reset">Reset</div>
        </div>

      </a-drawer>
</template>
<script setup>
import { reactive,defineProps,defineEmits} from 'vue';
const data=reactive({
  value:0
})
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   }
})
const emits= defineEmits(["update:isOpen","confirm","reset"])

//关闭弹窗
var closeDrawer=()=>{
   emits("update:isOpen",false)
}

var change=(value)=>{
   console.log(data.value,value)
}

var confirm=()=>{
   emits("confirm",data.value)
}
var reset=()=>{
   emits("reset",0)
}

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
        .ant-radio-group{
          width: 100%;
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
 
        

     }
     .btnContent{
        width: 100%;
        padding:0 16px;
        box-sizing: border-box;   
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
        // margin-top: 20px;
      }
      .select{
        background-color: var(--bg-color-container-active);
        color: var(--text-color-active);
      }
     }


</style>