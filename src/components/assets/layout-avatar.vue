<template>
  <div class="card">
      <div class="avatar">
        <a-avatar :size="64" :src="photo_src" />
      </div>
      <div class="info">
        <div class="name">
          <p>{{name}}</p>
          <img src="@/assets/icon/verify.png">
        </div>
        <div class="address">
          <p>{{address}}</p>
          <button v-on:click="copyAddress" class="copy_button">
            <img src="@/assets/icon/copy.png">
          </button>
        </div>
      </div>
      <div class="link">
        <button v-on:click="linkJump">
          <img src="@/assets/icon/link.png">
        </button>
      </div>
  </div>
</template>

<script setup>

import {ref} from "vue";

const name = ref("Joey268");
const address = ref("0x69...350d");
const photo_src = ref("https://s3-alpha-sig.figma.com/img/52ef/d102/7449c5a3687e8914750875679d508805?Expires=1714348800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ffEp2TB3fWSHGkLnbdzjDgg3ZbK8XT1mo-N~5i2Ud~y9w3nxYDeWyfd7Yl0V9L6ZF3pK4CM-dUv7YBgUcmc49M06LGcADRYP24LkbDn51PaVUb3FL69YoZ8KDJWf3FiTf~7u1iKPJ3nPkmhyw8tAfxcyzbGIV5lvJof80qrGGbCQPI1cDgC7gh0M-kT8WD9JlUPxkAyhFIPSKoHrGkgGIEY~QqNKuV8lt6n-ZClANf4SaYlHqOS2MHe~l2WhukDQMHLNzkEA7yP5Sfc1FN2wO~LIPR4pfoyNuqunwc~BwwwkbYGqWSQ-QTVUsQi8D4oe7UUOamprKzd5KkZo1ZS9uA__");

function setName(){
  name.value = "";
}

function setAddress(){
  address.value = "";
}

function setPhotoSrc(src){
  photo_src.value = src
}

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