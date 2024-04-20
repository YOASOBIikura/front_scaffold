<template>
    <div class="mul-content">
        <div class="mul-item" 
            v-for="(item,index) in list" 
            :key="'mul-' + index + item.label"
            :class="{'active': value.indexOf(item.key) !== -1}"
            @click="changeSelect(item)"
        >
            <img v-if="item.icon" :src="item.icon" class="icon"/>
            {{ item.label }}
        </div>
    </div>
</template>
<script setup>
import { reactive,watch } from "vue";
const props = defineProps({
    list: Array,
    value: Array,
});
let data = reactive({
    currentSelect: props.value
});
watch(
    () => props.value,
    (val) => {
        console.log(val)
        data.currentSelect = val;
    }
)
const changeSelect = (item) => {
    let selectIndex = data.currentSelect.indexOf(item.key);
    console.log(selectIndex);
    if(selectIndex === -1){
        data.currentSelect.push(item.key);
        emits("update:value", data.currentSelect);
    } else {
        data.currentSelect.splice(selectIndex,1);
        emits("update:value", data.currentSelect);
    }
}
</script>
<style scoped lang="less">
.mul-content{
    display: flex;
    justify-content: space-between;
    width: 100%;
    .mul-item{
        width: calc(50% - 8px);
        height: 48px;
        border: 1px solid var(--component-border);
        padding: 14px 16px;
        font-size: 16px;
        line-height: 16px;
        border-radius: 8px;
        .icon{
            margin-right: 2px;
            width: 16px;
            vertical-align: top;
        }
        &.active{
            border: 2px solid var(--bg-color-container-active);
        }
    }
}
</style>
