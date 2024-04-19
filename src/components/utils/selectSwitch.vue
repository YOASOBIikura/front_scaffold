<template>
    <div class="select-switch">
        <div v-for="item in switchList" :key="item.key" 
            :class="[
                {'active': currentSelect == item.key},
                'item-' + theme
            ]"
            @click="changeSelect(item)"
        >
            <img v-if="item.icon" :src="item.icon" class="icon"/>
            {{ item.label }}
        </div>
    </div>
</template>
<script setup>
import { ref,watch,computed } from "vue";
const props = defineProps({
    switchList: Array,
    value: String,
    theme: {type: String, default: 'white'}
});
const emits = defineEmits(["update:value", "change"]);
let currentSelect = ref(props.value); 

watch(
    () => props.value,
    (val) => {
        currentSelect.value = val;
    }
)


const changeSelect = (data) => {
    if( currentSelect.value === data.key){
        return;
    }
    currentSelect.value = data.key;
    emits("update:value", currentSelect.value);
    emits("change", currentSelect.value)
}
</script>
<style lang="less" scoped>
  .select-switch{
        height: 32px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: var(--bg-color-secondarycontainer);
        border-radius: 56px;
        font-size: 14px;
        font-weight: 600;
        padding: 2px;
        .item-white{
            width: 50%;
            text-align: center;
            line-height: 28px;
            
            &.active{
                background-color: var(--bg-color-container-active);
                color: var(--text-color-active);
                border-radius: 56px;
            }
        }
        .item-black{
            width: 50%;
            text-align: center;
            line-height: 28px;
            &.active{
                background-color: var(--bg-color-page);
                color: var(--text-color-primary);
                border-radius: 56px;
            }
        }
    }

    .icon{
        margin-right: 2px;
        width: 16px;
        vertical-align: sub;
    }
</style>