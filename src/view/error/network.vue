<template>
    <div class="networkError">
        <div class="header">
             <img class="icon" src="@/assets/images/avatar.png" alt="">
        </div>
        <div class="content">
            <img class="icon" src="@/assets/images/warn.png" alt="">
            <span class="info">Your connectted network is unsupported</span>
            <span class="btn">Switch Network</span>
        </div>

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
    justify-content: center;
    position: relative;
    .header{
        position: absolute;
        left: 16px;
        top: 12px;
        .icon{
            width: 60px;
            // height: 32px;
        }
    }
    .content{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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

}

</style>