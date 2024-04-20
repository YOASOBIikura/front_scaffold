<template>
    <div class="refresh" :class="{'animation':data.hasAnimation}" @click="addAnimation">
        <img src="@/assets/images/refresh.png" />
    </div>
</template>
<script setup>
import { reactive } from "vue";

let data = reactive({
    hasAnimation: false
})
const addAnimation = () => {
    data.hasAnimation = true;
    setTimeout(() => {
        data.hasAnimation = false
    }, 500);
}
</script>
<style scoped lang="less">
.refresh{
    display: inline-block;
    margin-left: 4px;
    &.animation{
        animation: rotating 0.5s linear infinite;
    }
    img{
        width: 24px;
        vertical-align: middle;
    }
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(90deg);
  }
  40%{
    transform: rotate(180deg);
  }
  60%{
    transform: rotate(270deg);
  }
  80%{
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>