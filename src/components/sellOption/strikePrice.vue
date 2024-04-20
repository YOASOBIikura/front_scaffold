<template>
    <div class="s-price-content" >
        <div    
            v-for="(item,index) in priceList" 
            :key="'price-' + index" 
            class="price-item"
            @click="changePrice(item)"
            :class="[{'active': data.currentSelect == item.price}]"
        >$ {{ item.price }}
        </div>
    </div>
</template>
<script setup>
import { reactive,watch } from "vue";

const props = defineProps({
    priceList: Array,
    value: String,
});
const emits = defineEmits(["update:value"]);
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
const changePrice = (data) => {
    data.currentSelect = data.price;
    emits("update:value", data.currentSelect);
}

</script>
<style scope lang="less">
.s-price-content{
    width: 100%;
    white-space: pre-wrap;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: -8px;
    .price-item{
        display: inline-block;
        padding: 7px 14px;
        font-size: 14px;
        background-color: var(--bg-color-secondarycontainer);
        border-radius: 32px;
        flex: 1;
        max-width: calc(25% - 8px);
        margin-top: 12px;
        margin-left: 8px;
        flex-basis:20%;
        overflow: hidden;
        white-space: nowrap;
        &.active{
            background-color: var( --bg-color-container-active);
            color: var(--bg-color-page);
        }
    }
}

</style>