<template>
    <div>
        <div class="current-expiry-date">
            {{props.value.day}} days · {{props.value.date}}
        </div>
        <a-slider
            v-if="props.dataList.length>0" 
            v-model:value="currentIndex" 
            :max="props.dataList.length-1" 
            :step="1" 
            :tipFormatter="null"
            @change="changeSlider"
        >
        </a-slider>
    </div>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from "vue";

const props = defineProps({
    dataList:{
        type:Array,
        require:true,
        default:[]
    },
    value:{
        type:Object,
        require:true,
        default:{}
    }
});
var currentIndex=computed(()=>{
     return props.value.key
})
const emits = defineEmits(["update:value","change"]);

var changeSlider=(item)=>{
     emits("update:value",props.dataList[item])
     emits("change",props.dataList[item])
}






</script>
<style scoped lang="less">
:deep(.ant-slider-step .ant-slider-dot){
    border: none;
}

:deep(.ant-slider-handle){
    width: 24px;
    height: 24px;
    &:hover{
        &::after{
            box-shadow: 0 0 0 var(--bg-color-secondarycontainer);
            border: 2px solid var(--bg-color-secondarycontainer);
            width: 24px;
            height: 24px;
            transform: translate(0%, -25%);
        }
    }
    &::after{
        box-shadow: 0 0 0 var(--bg-color-secondarycontainer);
        border: 2px solid var(--bg-color-secondarycontainer);
        width: 24px;
        height: 24px;
        transform: translate(0%, -25%);
    }
}
</style>