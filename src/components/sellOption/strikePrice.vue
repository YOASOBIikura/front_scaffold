<template>
    <div class="stikePrice" >
        <span @click="select(item,index)" :class="data.currentSelect==index ?'stikePriceItem active':'stikePriceItem'" v-for="(item,index) in props.dataList" :key="index">
           ${{item.price}}
        </span>
    </div>
</template>
<script setup>
import { reactive,watch,onMounted } from "vue";
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
const data = reactive({
    currentSelect: -1
});
const emits = defineEmits(["update:value","change"]);
onMounted(()=>{
    props.dataList.forEach((item,index)=>{
          if(item.key==props.value.key){
              data.currentSelect=index
          }
    })
})

var select=(item,index)=>{
      data.currentSelect=index
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
        padding: 7px 15px;
        border-radius:32px ;
        background-color: var(--bg-color-secondarycontainer);
        color: var(--text-color-primary);
        font-size: 14px;
        font-weight: bold;
        margin-right: 12px;
        margin-bottom: 10px;
    }
    .active{
        background-color: var(--bg-color-container-active);
        color: var(--text-color-active);
    }
}

</style>