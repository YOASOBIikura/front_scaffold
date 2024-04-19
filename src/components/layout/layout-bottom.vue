<template>
    <div class="layout-bottom">
         <div class="bottom-item" v-for="(item,index) in allTabbrList" :key="item">
            <img :src="getImgSrc(index)" @click="changeTabbar(item)"/>
            {{item}}
        </div>

    </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";

let baseData = reactive({
    currentSelect: "Trading",

});
const allTabbrList = ["Trading", "Portfolio", "Notification", "Asset"];
const router = useRouter();
const changeTabbar = (data) => {
    if(data == baseData.currentSelect){
        return;
    }
    baseData.currentSelect = data;
}
const getImgSrc = (index) => {
    if(allTabbrList.indexOf(baseData.currentSelect) == index){
        return `/src/assets/images/tabbar${(parseInt(index)+ 1)}_active.png`;
    }
    return `/src/assets/images/tabbar${(parseInt(index)+ 1)}.png`;
}
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