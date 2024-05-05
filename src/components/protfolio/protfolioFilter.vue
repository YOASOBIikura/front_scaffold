<template>
     <a-drawer v-show="props.isOpen" height="570px" class="protfolioFilter"  :closable="false" :headerStyle="{padding:'0px'}"  :bodyStyle="{padding:'0px'}"  :placement="'bottom'"   :open="props.isOpen" >
        <template v-slot:title>
             <div class="filter">
                 <img  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
                 <span class="title">Filter</span>
                 <span></span>
             </div>
        </template>
        <div class="content">
            <span class="title">Options</span>

            <div class="optionList">
                <div class="option-item" v-for="item in data.optionList" :key="item.value" >
                    <span class="text">{{ item.label }}</span>
                    <a-checkbox  v-model:checked="item.check" @change="optionChange">
                    </a-checkbox>     
                </div>
            </div>
            <p class="line"></p> 
            <span class="title">Status</span>
            <div class="optionList">
                <div class="option-item" v-for="item in data.statusList" :key="item.value" >
                    <span class="text">{{ item.label }}</span>
                    <a-checkbox   v-model:checked="item.check" @change="statusChange">
                    </a-checkbox>     
                </div>
            </div>
            <div class="btn btn1 select" @click="confirm">Apply  Options</div>
            <div class="btn " @click="reset">Reset</div>
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
const emits= defineEmits(["update:isOpen","change","confirm","reset"])
const data=reactive({
     optionSelectList:[],
     statusSelectList:[],
     optionList:[
        {
         label:"Buy Call Options",
         check:false,
         value:0,
         },
         {
         label:"Buy Put Options",
         check:false,
         value:1,
         },
         {
         label:"Sell Call Options",
         check:false,
         value:2,
         },
         {
          label:"Sell put Options",
          check:false,
          value:3,
         },         
     ],
     statusList:[
         {
           label:"Open",
           check:false,
           value:0, 
         },
         {
           label:"Completed",
           check:false,
           value:1
         }
     ],
     statusSelectList:[],
     optionSelectList:[]
})
//关闭弹窗
var closeDrawer=()=>{
   emits("update:isOpen",false)
}

var optionChange=()=>{
   console.log(data.optionList)
   filter()
   emits("change",data.optionSelectList,data.statusSelectList)
}

var statusChange=()=>{
  console.log(data.statusList)
  filter()
  emits("change",data.optionSelectList,data.statusSelectList)
}


var confirm=()=>{
   emits("confirm",data.optionSelectList,data.statusSelectList)
}

var reset=()=>{
   data.optionList.forEach(item=>{
       item.check=false
   })
   data.statusList.forEach(item=>{
      item.check=false
   })
   emits("reset",[],[])
}

var filter=()=>{
    let optionSelectList=[]
    let statusSelectList=[] 
    data.optionList.forEach(item=>{
        if(item.check){
          optionSelectList.push(item.value)
        }
    })
    data.statusList.forEach(item=>{
        if(item.check){
          statusSelectList.push(item.value)
        }
    })
    data.statusSelectList=statusSelectList
    data.optionSelectList=optionSelectList
}
</script>
<style lang="less" scoped>
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
    .content{
      width: 100%;
      padding: 12px 16px;
      box-sizing: border-box;
      .title{
        font-size: 20px;
        color: var(--text-color-primary);
        font-weight: 600;

      }
      .optionList{
         width: 100%;
         display: flex;
         flex-direction: column;
         margin-bottom: 12px;
         .option-item{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between; 
            .text{
                color: var(--text-color-primary); 
                font-size: 16px;
            }
         }
         .ant-checkbox-wrapper{
            margin: 10px 0px;
         }
      }
      .line{
        width: 100%;
        height: 1px;
        background: var( --component-border) ;
        margin-bottom: 20px;
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