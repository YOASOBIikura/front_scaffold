<template>
    <div class="layout-bottom">
        <div class="bottom-item">Trading</div>
        <div class="bottom-item">Portfolio</div>
        <div class="bottom-item">Notifications</div>
        <div class="bottom-item">Asset</div>
    </div>
</template>
<script setup>

</script>
<style lang="less" scoped>
.layout-bottom{
   height: 50px;
   width: 100%; 
   display: flex;
   justify-content: space-between;
   .bottom-item{
        width: 25%;
        display: inline-flex;
        justify-content: center;
   }
}
</style>