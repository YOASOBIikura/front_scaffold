<template>
    <div>
        <div class="current-expiry-date">
            {{expiryDataList[baseData.expiryData]}} days · {{ showExpiryDate }}
        </div>
        <a-slider 
            v-model:value="baseData.expiryData" 
            :marks="expiryDataList" 
            :max="7" 
            :step="null" 
            :tip-formatter="null"
            @change="changeSlider"
        >
            <template #mark="{}">

            </template>
        </a-slider>
    </div>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import { TimeTransformDateWithoutHour } from "@/common/timeFormat"
const props = defineProps({
    expiryDataList: [Array,Object],
    value: Number
});
const emits = defineEmits(["update:value","changeAfterReturnTime"]);

let baseData = reactive({
    expiryData: props.value
});
watch(
    () => props.value,
    (val) => {
        baseData.expiryData = props.value;
    }
);
let showExpiryDate = computed(() => {
    let expiryDateTime = calcExpiryDate(baseData.expiryData); 
    let dateString = TimeTransformDateWithoutHour(expiryDateTime);
    return dateString;
})
const changeSlider =(val) => {
    let expiryDateTime = calcExpiryDate(val);
    emits("update:value", val);
    // 更改日期后返回到期的时间戳
    emits("changeAfterReturnTime", expiryDateTime.getTime());
}

/**
 * 计算到期之后的日期
 */
const calcExpiryDate = (index) => {
    // 到期时间长度
    let expiryLength = props.expiryDataList[index];
    // 当前时间(当天0点的时间戳)
    let nowDate = new Date(new Date().toLocaleDateString()).getTime();
    // 一天的时间长度
    let oneDay = 24 * 1000 * 60 * 60;
    // 最终到期日
    let expiryDateTime = new Date(nowDate + (oneDay * expiryLength));
    return expiryDateTime;
}

onMounted(() => {
    changeSlider(baseData.expiryData);
})

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