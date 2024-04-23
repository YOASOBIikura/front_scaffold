<template>
    <div class="mul-content">
        <div :class="item.select?'mul-item actice':'mul-item'" @click="select(item)"  v-for="(item,index) in props.value" :key="index">
              <img v-if="item.img" class="icon" :src="item.img" alt="">
              <span class="text">{{item.name}}</span>
        </div>
    </div>
</template>
<script setup>
import {defineEmits} from "vue";
const emits=defineEmits(["update:value","change"])
const props = defineProps({
    value: {
        type:Array,
        default:[]
    },
});
var select=(item)=>{
    item.select=!item.select
    emits("change",item)
}
</script>
<style scoped lang="less">
.mul-content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    .mul-item{
        border:1px solid var(--border-color);
        border-radius: 8px;
        width: 167px;
        padding: 16px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-right: 6px;
        }
        .text{
            box-sizing: border-box;;
            color: var(--text-color-primary);
            font-size:16px;
            font-weight: 600;
        }
    }
    .actice{
        box-sizing: border-box;
        border: 1px solid var(--border-active);
    }
}
</style>
