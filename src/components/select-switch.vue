<template>
    <div class="select-switch">
        <div v-for="item in switchList" :key="item" 
            :class="[
                {'active': currentSelect == item.name},
                'item-' + theme
            ]"
            @click="changeSelect(item)"
        >
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
const emits = defineEmits(["update:value"]);
let currentSelect = ref(props.value); 

watch(
    () => props.value,
    (val) => {
        currentSelect.value = val;
    }
)
watch()

const changeSelect = (data) => {
    currentSelect.value = data.name;
    emits("update:value", currentSelect.value);
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
</style>