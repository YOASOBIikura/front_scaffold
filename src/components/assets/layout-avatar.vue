<template>
  <div class="card">
      <div class="avatar">
        <a-avatar :size="64" :src="account.data.photo" />
      </div>
      <div class="info">
        <div class="name">
          <p>{{account.data.name}}</p>
          <img src="@/assets/images/certified.png">
        </div>
        <div class="address">
          <p>{{account.data.address}}</p>
          <button v-on:click="copyAddress" class="copy_button">
            <img src="@/assets/images/copy2.png">
          </button>
        </div>
      </div>
      <div class="link">
        <button v-on:click="linkJump">
          <img src="@/assets/images/arrow_right.png">
        </button>
      </div>
  </div>
</template>

<script setup>
const props = defineProps({account:{type: Object}})

function copyAddress(){
  const account_address = address.value;
  navigator.clipboard.writeText(account_address).then(() => {
    console.log("address复制成功");
  })
  .catch(error => {
    console.log("复制失败:", error);
  })
}

function linkJump(){
  console.log("linkbutton触发！");
}

</script>

<style scoped lang="less">
.card{
  width: 375px;
  height: 128px;
}
p{
  color: #000000;
}
.avatar{
  float: left;
  margin-left: 16px;
  margin-top: 32px;
}
.name{
  font-size: 24px;
  font-weight: 600;
}
.name{
  p{
    float: left;
  }
  img{
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 6px;
    margin-left: 4px;
  }
}
.address{
  font-size: 16px;
  font-weight: 400;
  p{
    float: left;
  }
  button{
    background-color: transparent;
    border: none;
    float: left;
    margin-top: 2px;
  }
  img{
    width: 16px;
    height: 16px;
  }
}
.info{
  float: left;
  margin-left: 16px;
  margin-top: 38px;
}
.link{
  float: right;
  margin-top: 64px;
  margin-right: 16px;
  button{
    background-color: transparent;
    border: none;
  }
  img{
    width: 16px;
    height: 16px;
  }
}
</style>