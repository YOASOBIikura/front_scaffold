<template>
    <div class="navigationBar">
          <img class="icon" src="@/assets/images/back.png" alt="">
          <div class="info">
            <slot class="iconSlot" name="icon"></slot>
            <span class="titleText">Transfer Eth</span>
          </div>
          <span></span>

    </div>
</template>
<script setup>

</script>
<style lang="less" scoped>
 .navigationBar{
     width: 100%;
     padding: 16px 0;
     box-sizing: border-box;
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
     .icon{
        width: 24px;
        height: 24px;
     }
     .info{
        display: flex;
        flex-direction: row;
        align-items: center;
        .iconSlot{
            margin-right: 6px;
        }
        .titleText{
            color: var(--text-color-primary);
            font-size: 16px;
            font-weight: 600;
        }
     }
 }
</style>