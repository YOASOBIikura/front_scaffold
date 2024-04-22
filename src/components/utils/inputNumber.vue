<template>
  <a-input
    v-model:value="inputModel"
    @change="inputChange"
    @blur="inputBlur"
    class="custom-number-input"
    :controls="false"
    :bordered="props.bordered"
    :placeholder="props.placeholder"
  >
    <template #suffix>
      <slot name="suffix"></slot>
    </template>
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
  </a-input>
</template>
<script setup lang="ts">
import { watch, ref,nextTick } from "vue"
const props = defineProps({
  placeholder: { type: String, default: "" },
  value: { type: [String], default: "" },
  decimals: { type: Number, default: 18 },
  bordered: { type: Boolean, default: false },
  hasMinus: { type: Boolean, default: false }, // 是否支持输入负数
});
const emits = defineEmits(["change", "update:value"]);
watch(
  () => props.value,
  (v1, v2) => {
    nextTick(() => {
      inputModel.value = v1;
    });
  }
);
watch(
  () => props.decimals,
  (value) => {
    currentDecimals.value = value;
  }
);
let inputModel = ref<string>(props.value?.toString() || '');
let currentDecimals = ref<number>(18);
const inputChange = () => {
  let bis = "";
  let reservedBits = (props.decimals !== undefined && props.decimals !== null) ? props.decimals : 18;
  for (let i = 0; i < reservedBits; i++) {
    bis += "\\d";
  }
  let num = inputModel.value;
  let position = '';
  if (num.startsWith('-') && props.hasMinus) {
    position = "-";
    num = num.substring(1, num.length);
  }
  let regx = /[^\d\.]/g;
  if (props.decimals === 0) {
    regx = /[^\d]/g;
  }
  // 正数限制
  let tempVal = num.replace(regx, "");
  let Regex = new RegExp(`^(-)*(\\d+)\\.(${bis}).*$`);
  num = tempVal
    .replace(Regex, "$1$2.$3")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  if (position === '-') {
    num = position + num;
  }
  nextTick(() => {
    inputModel.value = num;
  })
  emits("update:value", inputModel.value);
  emits("change", inputModel.value);
};
const inputBlur = () => {
  if (inputModel.value === '' || inputModel.value === undefined || inputModel.value === null) {
    return;
  }
  let lastValue = inputModel.value;
  if (props.hasMinus && inputModel.value === '-') { // 支持负数时 如果只输入一个负号则将输入框的值变为""
    inputModel.value = ''
    emits("update:value", inputModel.value);
    emits("change", inputModel.value);
    return;
  }
  let tempValSplit = inputModel.value.split(".");
  let int = tempValSplit[0];
  let float = tempValSplit[1];
  if (!float || Number(float) === 0) {
    inputModel.value = Number(int).toString();
    if (lastValue != inputModel.value) {
      emits("update:value", inputModel.value);
      emits("change", inputModel.value); 
    }
    return;
  }
  let position = '';
  if (props.hasMinus && inputModel.value.startsWith('-')) { // 处理 int位为 0 并且是负值的小数问题
    if (Number(float) > 0 && Number(int) === 0) {
      position = '-';
    }
  }
  inputModel.value = position + Number(int).toString() + "." + float;
  if (lastValue != inputModel.value) {
    emits("update:value", inputModel.value);
    emits("change", inputModel.value);
  }
};
</script>
<style lang="less" scoped>
.custom-number-input {
  background-color: var(--bg-color-component);
}
</style>