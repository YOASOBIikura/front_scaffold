<template>
  <div class="table">
    <div class="vault">
      <img src="../../assets/images/accountDemo.png" alt="photo"/>
      <div class="addr">
        <span>fadacai</span>
        <span>0x023...2311</span>
      </div>
    </div>
    <span class="time">8.5h</span>
    <div class="premium">
      <span>$12.32</span>
      <span>67.2%</span>
    </div>
    <div class="ava">
      <span class="available">1.3</span>
      <button>Trade</button>
    </div>

  </div>
</template>

<script setup>

</script>

<style scoped lang="less">
.table{
  font-size: 10px;
  display: flex;
  min-height: 64px;
  height: 64px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  img{
    width: 32px;
    height: 32px;
  }
  button{
    border: none;
    background-color: var(--green-color-primary);
    width: 56px;
    height: 32px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-color-degen-third);
  }
}
.multi{
  display: flex;
  flex-direction: column;
}
.vault{
  display: flex;
  align-items: center;
  gap: 4px;
  width: 31%;
  margin-left: 12px;
  .addr{
    .multi();
    span:first-child{
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: var(--text-color-primary);
    }
    span:last-child{
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: var(--text-color-tabs-unActive);
      margin-top: 4px;
    }
  }
}
.time{
  font-weight: 400;
  font-size: 14px;
  line-height: 17.5px;
  color: var(--text-color-primary);
  width: 13%;
  display: flex;
  justify-content: center;
}
.premium{
  .multi();
  width: 18%;
  span:first-child{
    display: flex;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-color-success);
  }
  span:last-child{
    display: flex;
    justify-content: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-color-primary);
  }
}
.ava{
  width: 23%;
  display: flex;
  justify-content: flex-end;
  margin-right: 8px;
  align-items: center;
}
.available{
  font-weight: 400;
  font-size: 14px;
  line-height: 17.5px;
  color: var(--text-color-primary);
}
</style>