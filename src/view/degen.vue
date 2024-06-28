<template>
  <div class="page">
    <div class="top">
      <DegenInfo />
    </div>
    <div class="down">
      <Degenlist />
    </div>
    <button class="add">
      <img src="../assets/images/plus-circle.png" alt="add"/>
      <span>Add to marketplace</span>
    </button>
  </div>
</template>

<script setup>
import DegenInfo from "@/components/degen/degenInfo.vue";
import Degenlist from "@/components/degen/degenlist.vue";
</script>

<style scoped lang="less">
.page{
  display: flex;
  flex-direction: column;
  background-color: rgba(247, 247, 247, 1);
  height: 100%;
}
.common{
  display: flex;
  background-color: white;
  border-radius: 24px;
  margin-left: 8px;
  margin-right: 8px;
}
.top{
  .common();
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 64px;

}
.down{
  .common();
  justify-content: center;
  margin-top: 8px;
  height: 100%;
}
.add{
  display: flex;
  position: fixed;
  border: none;
  border-radius: 24px;
  background-color: var(--bg-color-container-active);
  width: 204px;
  height: 40px;
  bottom: 4%;
  align-items: center;
  gap: 4px;
  left: 50%;
  transform: translate(-50%, -50%);
  img{
    width: 24px;
    height: 24px;
    margin-left: 12px;
  }
  span{
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-color-active);
  }
}
</style>