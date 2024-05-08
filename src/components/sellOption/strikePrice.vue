<template>
    <div class="stikePrice" >
        <span @click="select(item,index)" :class="currentSelect==index ?'stikePriceItem active':'stikePriceItem'" v-for="(item,index) in props.dataList" :key="index">
           ${{item.price}}
        </span>
    </div>
</template>
<script setup>
import {computed } from "vue";
const props = defineProps({
    dataList: {
        type:Array,
        require:true,
        default:[]
    },
    value: {
        type:Object,
        require:true,
        default:{}
    },
});

const emits = defineEmits(["update:value","change"]);
var currentSelect=computed(()=>{
    let currentIndex=-1
    props.dataList.forEach((item,index)=>{
          if(item.key==props.value.key){
            currentIndex=index
          }
    })
    return currentIndex
     
})

var select=(item,index)=>{
     emits("update:value",item)
     emits("change",item)
}

</script>
<style scope lang="less">
.stikePrice{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .stikePriceItem{
        display: inline-block;
        padding: 7px 0px;
        text-align: center;
        width: 80px;
        border-radius:32px ;
        background-color: var(--bg-color-secondarycontainer);
        color: var(--text-color-primary);
        font-size: 14px;
        font-weight: bold;
        margin-right: 6px;
        margin-bottom: 10px;
    }
    .active{
        background-color: var(--bg-color-container-active);
        color: var(--text-color-active);
    }
}

</style>