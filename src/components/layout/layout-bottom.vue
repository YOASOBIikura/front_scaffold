<template>
    <div class="layout-bottom">
        <div class="bottom-item">
            <img src="@/assets/images/bottom-trading.png" />
            Trading</div>
        <div class="bottom-item">
            <img src="@/assets/images/bottom-portfolio.png"/>
            Portfolio</div>
        <div class="bottom-item">
            <img src="@/assets/images/bottom-notifications.png"/>
            Notifications</div>
        <div class="bottom-item">
            <img src="@/assets/images/bottom-asset.png"/>
            Asset</div>
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
   border-top: 1px solid var(--component-border);
   padding: 6px 0;
   .bottom-item{
        width: 25%;
        font-size: 12px;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        img{
            height: 24px;
            width: 24px;
        }
   }
}
</style>