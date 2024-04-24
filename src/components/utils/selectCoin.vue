<template>
    <div class="selectCoin">
         <div class="content">
            <p @click="selectChange(item)" :class="isSelect==index?'item active':'item'" v-for="(item,index) in props.dataList" :index="index">
                 <img class="selectIcon" :src="item.img" alt="">
                 <span class="selectText">{{item.name}}</span>
            </p>
         </div>
    </div>
</template>
<script setup>
import {defineProps,defineEmits,computed } from 'vue';
const props=defineProps({
     dataList:{
        type:Array,
        default:[]
     },
     value:{
          type:Object,
          require:true,
          default:{}
     }
})

const emits=defineEmits(["change","update:value"])

var isSelect=computed(()=>{
      let currentIndex=-1;
      props.dataList.forEach((item,index)=>{
           if(item.name==props.value.name){
               currentIndex=index
           }
      })
      return currentIndex;
})

var selectChange=(item)=>{
      emits("update:value",item)
      emits("change",item)
}


</script>
<style lang="less" scoped>
.selectCoin{
     width: 100%;
     display: flex;
     overflow-x: auto;
     .content{
          display: flex;
          flex-direction: row;
          align-items: center;
          background: var(--bg-color-secondarycontainer);
          border-radius: 52px;
          .item{
               width: 170px;
               height: 32px;
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;
               border-radius: 52px;
               .selectIcon{
                  width: 16px;
                  height: 16px;
                  margin-right: 4px;
                  border-radius:50% ;
               }
               .selectText{
                  color: var( --text-color-primary);
                  font-size: 14px;
                  font-weight: 600;
               }
          }
          .active{
               background: var(--bg-color-container-active);
               .selectText{
                    color: var(--text-color-active);
               }
          }
     }
}

</style>