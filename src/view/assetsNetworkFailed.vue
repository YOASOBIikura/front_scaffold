<template>
  <div>
    <layoutavatar :account="accountInfo"></layoutavatar>
    <div class="center">
      <img src="@/assets/images/warn.png">
      <p>Your connected network is unsupported</p>
      <button v-on:click="">Switch Network</button>
    </div>
  </div>
</template>

<script setup>
import layoutavatar from "../components/assets/layout-avatar.vue"
import {reactive} from "vue";

const accountInfo = reactive({data:{
    name: "Joey268",
    address: "0x69...350d",
    photo: "/src/assets/images/avatarDemo.png"
  }
})
</script>

<style scoped lang="less">
.center{
  border-top: 8px solid #F0F0F0;
  img{
    width: 72px;
    height: 72px;
    margin-top: 96px;
    margin-left: 152px;
  }
  p{
    font-weight: 600;
    font-size: 16px;
    margin-left: 35px;
    margin-top: 16px;
  }
  button{
    width: 131px;
    height: 32px;
    margin-left: 122px;
    margin-top: 16px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    background-color: black;
    color: white;
    border-radius: 30px 30px 30px 30px;
  }
}
</style>