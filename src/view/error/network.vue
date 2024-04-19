<template>
    <div class="networkError">
         <img class="icon" src="@/assets/images/warn.png" alt="">
         <span class="info">Your connectted network is unsupported</span>
         <span class="btn">Switch Network</span>
    </div>
</template>
<script setup>

</script>
<style lang="less" scoped>
.networkError{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon{
        width: 72px;
        height: 72px;
        margin-bottom: 16px;
    }
    .info{
        color: var(--text-color-primary);
        font-size: 16px;
        margin-bottom: 16px;
    }
    .btn{
        display: inline-block;
        padding: 7px 12px;
        border-radius:32px ;
        color: var(--text-color-active);
        font-size: 14px;
        font-weight: 600;
        background-color: var(--bg-color-container-active);
    }
}

</style>